import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import {
  DisableMfaDto,
  ForgotPasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto,
  SetupMfaDto,
  VerifyEmailDto,
} from './auth.dto';
import { RedisService } from '../redis/redis.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { ERROR_CODES } from '../../common/constants/error-codes';
import { AuthRepository } from '../../repositories/auth.repository';

@Injectable()
export class AuthService {
  private readonly refreshTtlMs = 7 * 24 * 60 * 60 * 1000;
  private readonly maxLoginAttempts = 5;

  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepo: AuthRepository,
    private readonly redis: RedisService,
    private readonly auditLog: AuditLogService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.authRepo.findUniqueByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already registered');

    const passwordHash = await argon2.hash(dto.password);
    const user = await this.authRepo.createUserBasic({
      email: dto.email,
      fullName: dto.fullName,
      passwordHash,
    });

    const token = crypto.randomBytes(32).toString('hex');
    await this.authRepo.createAuthToken({
      userId: user.id,
      tokenHash: await argon2.hash(token),
      type: 'EMAIL_VERIFY',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return {
      message: 'User registered',
      emailVerificationToken: token,
      user: { id: user.id, email: user.email, fullName: user.fullName },
    };
  }

  async login(
    dto: LoginDto,
    context?: { ipAddress?: string; userAgent?: string | string[]; deviceId?: string },
  ) {
    const lockKey = `auth:lock:${dto.email}`;
    const blocked = await this.redis.get<{ until: number }>(lockKey);
    if (blocked && blocked.until > Date.now()) {
      throw new UnauthorizedException('Account temporarily locked due to failed attempts');
    }

    const user = await this.authRepo.findUserForLogin(dto.email);
    if (!user) {
      await this.trackFailedAttempt(dto.email);
      throw new UnauthorizedException(ERROR_CODES.AUTH_INVALID_CREDENTIALS);
    }

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) {
      await this.trackFailedAttempt(dto.email);
      throw new UnauthorizedException(ERROR_CODES.AUTH_INVALID_CREDENTIALS);
    }
    await this.redis.del(`auth:attempts:${dto.email}`);

    if (user.isMfaEnabled) {
      if (!dto.totpCode && !dto.backupCode) {
        throw new UnauthorizedException(ERROR_CODES.AUTH_MFA_REQUIRED);
      }
      const mfaValidated = await this.validateMfa(user.id, dto.totpCode, dto.backupCode);
      if (!mfaValidated) throw new UnauthorizedException(ERROR_CODES.AUTH_MFA_REQUIRED);
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map((entry) => entry.role.name),
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_TTL ?? '15m',
    });

    const refreshTokenRaw = crypto.randomBytes(48).toString('hex');
    const refreshTokenHash = await argon2.hash(refreshTokenRaw);
    const session = await this.authRepo.createSession({
      userId: user.id,
      refreshTokenHash,
      deviceId: context?.deviceId ?? dto.deviceId ?? crypto.randomUUID(),
      userAgent: Array.isArray(context?.userAgent)
        ? context?.userAgent.join(';')
        : context?.userAgent,
      ipAddress: context?.ipAddress,
      expiresAt: new Date(Date.now() + this.refreshTtlMs),
    });

    await this.redis.set(
      `session:${session.id}`,
      { userId: user.id },
      Math.floor(this.refreshTtlMs / 1000),
    );
    await this.auditLog.create({
      actorId: user.id,
      action: 'AUTH_LOGIN',
      resource: 'AUTH',
      resourceId: session.id,
      status: 'SUCCESS',
    });

    return {
      accessToken,
      refreshToken: `${session.id}.${refreshTokenRaw}`,
      tokenType: 'Bearer',
      expiresIn: process.env.JWT_ACCESS_TTL ?? '15m',
    };
  }

  async refreshTokens(dto: RefreshTokenDto, ipAddress?: string) {
    const providedToken = dto.refreshToken ?? '';
    const [sessionId, rawToken] = providedToken.split('.');
    if (!sessionId || !rawToken) throw new UnauthorizedException(ERROR_CODES.AUTH_TOKEN_INVALID);

    const session = await this.authRepo.findSession(sessionId);
    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedException(ERROR_CODES.AUTH_SESSION_EXPIRED);
    }

    const tokenMatches = await argon2.verify(session.refreshTokenHash, rawToken);
    if (!tokenMatches) {
      await this.revokeAllSessions(session.userId);
      throw new UnauthorizedException(ERROR_CODES.AUTH_TOKEN_INVALID);
    }

    if (ipAddress && session.ipAddress && session.ipAddress !== ipAddress) {
      await this.revokeAllSessions(session.userId);
      throw new UnauthorizedException('Session anomaly detected');
    }

    const user = await this.authRepo.findUserWithRolesFlat(session.userId);
    if (!user) throw new UnauthorizedException(ERROR_CODES.AUTH_TOKEN_INVALID);

    const newRawToken = crypto.randomBytes(48).toString('hex');
    await this.authRepo.rotateSessionAndAudit({
      sessionId: session.id,
      refreshTokenHashNext: await argon2.hash(newRawToken),
      userId: user.id,
      ipAddress,
      priorIp: session.ipAddress,
    });

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      roles: user.roles.map((entry) => entry.role.name),
    });

    return {
      accessToken,
      refreshToken: `${session.id}.${newRawToken}`,
    };
  }

  async revokeSession(refreshToken: string) {
    const [sessionId] = refreshToken.split('.');
    await this.authRepo.revokeSession(sessionId);
    await this.redis.del(`session:${sessionId}`);
    return { revoked: true };
  }

  async revokeAllSessions(userId: string) {
    const sessions = await this.authRepo.findActiveSessionsForUser(userId);
    await this.authRepo.revokeAllActiveSessions(userId);
    await Promise.all(sessions.map((session) => this.redis.del(`session:${session.id}`)));
    return { revokedAll: true };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.authRepo.findUniqueByEmail(dto.email);
    if (!user) return { message: 'If account exists, reset token was issued.' };
    const token = crypto.randomBytes(24).toString('hex');
    await this.authRepo.createAuthToken({
      userId: user.id,
      tokenHash: await argon2.hash(token),
      type: 'PASSWORD_RESET',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });
    return {
      message: 'Password reset requested',
      resetToken: token,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokens = await this.authRepo.findPasswordResetTokens();
    const tokenRecord = (
      await Promise.all(
        tokens.map(async (token) =>
          (await argon2.verify(token.tokenHash, dto.token)) ? token : null,
        ),
      )
    ).find(Boolean);

    if (!tokenRecord) throw new UnauthorizedException(ERROR_CODES.AUTH_TOKEN_INVALID);
    const user = await this.authRepo.findUserRequired(tokenRecord.userId);
    const history = (await this.redis.get<string[]>(`password-history:${user.id}`)) ?? [];
    const isReused = await Promise.all(
      history.map((item) => argon2.verify(item, dto.newPassword)),
    ).then((results) => results.some(Boolean));
    if (isReused || (await argon2.verify(user.passwordHash, dto.newPassword))) {
      throw new BadRequestException('Password was used recently');
    }
    const nextHash = await argon2.hash(dto.newPassword);
    await this.authRepo.resetPasswordConsumeToken({
      userId: tokenRecord.userId,
      newPasswordHash: nextHash,
      tokenId: tokenRecord.id,
    });
    await this.redis.set(
      `password-history:${user.id}`,
      [user.passwordHash, ...history].slice(0, 5),
      90 * 24 * 60 * 60,
    );
    return { message: 'Password updated' };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const tokens = await this.authRepo.findEmailVerifyTokens();
    const tokenRecord = (
      await Promise.all(
        tokens.map(async (token) =>
          (await argon2.verify(token.tokenHash, dto.token)) ? token : null,
        ),
      )
    ).find(Boolean);
    if (!tokenRecord) throw new UnauthorizedException(ERROR_CODES.AUTH_TOKEN_INVALID);
    await this.authRepo.consumeEmailVerify(tokenRecord.id);
    return { message: 'Email verified' };
  }

  async setupMfa(userId: string) {
    const secret = speakeasy.generateSecret({ name: `SIS (${userId})` });
    if (!secret.base32 || !secret.otpauth_url) {
      throw new BadRequestException('MFA secret generation failed');
    }
    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);
    await this.authRepo.updateMfaPendingSecret(userId, secret.base32);
    const backupCodes = Array.from({ length: 8 }).map(() => crypto.randomBytes(4).toString('hex'));
    await this.redis.set(`mfa:backup:${userId}`, backupCodes, 365 * 24 * 60 * 60);
    return { qrCodeDataUrl, backupCodes };
  }

  async enableMfa(userId: string, dto: SetupMfaDto) {
    const valid = await this.validateMfa(userId, dto.code, undefined);
    if (!valid) throw new UnauthorizedException(ERROR_CODES.AUTH_MFA_REQUIRED);
    await this.authRepo.enableMfa(userId);
    return { enabled: true };
  }

  async disableMfa(userId: string, dto: DisableMfaDto) {
    const valid = await this.validateMfa(userId, dto.code, undefined);
    if (!valid) throw new UnauthorizedException(ERROR_CODES.AUTH_MFA_REQUIRED);
    await this.authRepo.disableMfa(userId);
    await this.redis.del(`mfa:backup:${userId}`);
    return { disabled: true };
  }

  private async validateMfa(userId: string, totpCode?: string, backupCode?: string) {
    const user = await this.authRepo.findUserSecrets(userId);
    if (!user?.mfaSecretEncrypted) return false;

    if (backupCode) {
      const backupCodes = (await this.redis.get<string[]>(`mfa:backup:${userId}`)) ?? [];
      if (backupCodes.includes(backupCode)) {
        await this.redis.set(
          `mfa:backup:${userId}`,
          backupCodes.filter((code) => code !== backupCode),
          365 * 24 * 60 * 60,
        );
        return true;
      }
    }

    if (!totpCode) return false;
    return speakeasy.totp.verify({
      secret: user.mfaSecretEncrypted,
      encoding: 'base32',
      token: totpCode,
      window: 1,
    });
  }

  private async trackFailedAttempt(email: string) {
    const key = `auth:attempts:${email}`;
    const current = (await this.redis.get<number>(key)) ?? 0;
    const next = current + 1;
    await this.redis.set(key, next, 10 * 60);
    if (next >= this.maxLoginAttempts) {
      await this.redis.set(`auth:lock:${email}`, { until: Date.now() + 15 * 60 * 1000 }, 15 * 60);
    }
  }
}
