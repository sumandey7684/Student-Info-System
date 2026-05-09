import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { ERROR_CODES } from '../../common/constants/error-codes';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly auditLog: AuditLogService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already registered');

    const passwordHash = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        passwordHash,
      },
    });

    const token = crypto.randomBytes(32).toString('hex');
    await this.prisma.authToken.create({
      data: {
        userId: user.id,
        tokenHash: await argon2.hash(token),
        type: 'EMAIL_VERIFY',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return {
      message: 'User registered',
      emailVerificationToken: token,
      user: { id: user.id, email: user.email, fullName: user.fullName },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        roles: {
          include: { role: { include: { permissions: { include: { permission: true } } } } },
        },
      },
    });
    if (!user) throw new UnauthorizedException(ERROR_CODES.AUTH_INVALID_CREDENTIALS);

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) throw new UnauthorizedException(ERROR_CODES.AUTH_INVALID_CREDENTIALS);

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
    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash,
        deviceId: dto.deviceId ?? crypto.randomUUID(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await this.redis.set(`session:${session.id}`, { userId: user.id }, 7 * 24 * 60 * 60);
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

  async refreshTokens(dto: RefreshTokenDto) {
    const [sessionId, rawToken] = dto.refreshToken.split('.');
    if (!sessionId || !rawToken) throw new UnauthorizedException(ERROR_CODES.AUTH_TOKEN_INVALID);

    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedException(ERROR_CODES.AUTH_SESSION_EXPIRED);
    }

    const tokenMatches = await argon2.verify(session.refreshTokenHash, rawToken);
    if (!tokenMatches) throw new UnauthorizedException(ERROR_CODES.AUTH_TOKEN_INVALID);

    const user = await this.prisma.user.findUnique({
      where: { id: session.userId },
      include: { roles: { include: { role: true } } },
    });
    if (!user) throw new UnauthorizedException(ERROR_CODES.AUTH_TOKEN_INVALID);

    const newRawToken = crypto.randomBytes(48).toString('hex');
    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        refreshTokenHash: await argon2.hash(newRawToken),
      },
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
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
    await this.redis.del(`session:${sessionId}`);
    return { revoked: true };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) return { message: 'If account exists, reset token was issued.' };
    const token = crypto.randomBytes(24).toString('hex');
    await this.prisma.authToken.create({
      data: {
        userId: user.id,
        tokenHash: await argon2.hash(token),
        type: 'PASSWORD_RESET',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    return {
      message: 'Password reset requested',
      resetToken: token,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokens = await this.prisma.authToken.findMany({
      where: { type: 'PASSWORD_RESET', consumedAt: null, expiresAt: { gt: new Date() } },
    });
    const tokenRecord = (
      await Promise.all(
        tokens.map(async (token) =>
          (await argon2.verify(token.tokenHash, dto.token)) ? token : null,
        ),
      )
    ).find(Boolean);

    if (!tokenRecord) throw new UnauthorizedException(ERROR_CODES.AUTH_TOKEN_INVALID);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { passwordHash: await argon2.hash(dto.newPassword) },
      }),
      this.prisma.authToken.update({
        where: { id: tokenRecord.id },
        data: { consumedAt: new Date() },
      }),
    ]);
    return { message: 'Password updated' };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const tokens = await this.prisma.authToken.findMany({
      where: { type: 'EMAIL_VERIFY', consumedAt: null, expiresAt: { gt: new Date() } },
    });
    const tokenRecord = (
      await Promise.all(
        tokens.map(async (token) =>
          (await argon2.verify(token.tokenHash, dto.token)) ? token : null,
        ),
      )
    ).find(Boolean);
    if (!tokenRecord) throw new UnauthorizedException(ERROR_CODES.AUTH_TOKEN_INVALID);
    await this.prisma.authToken.update({
      where: { id: tokenRecord.id },
      data: { consumedAt: new Date() },
    });
    return { message: 'Email verified' };
  }

  async setupMfa(userId: string) {
    const secret = speakeasy.generateSecret({ name: `SIS (${userId})` });
    if (!secret.base32 || !secret.otpauth_url) {
      throw new BadRequestException('MFA secret generation failed');
    }
    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaSecretEncrypted: secret.base32 },
    });
    const backupCodes = Array.from({ length: 8 }).map(() => crypto.randomBytes(4).toString('hex'));
    await this.redis.set(`mfa:backup:${userId}`, backupCodes, 365 * 24 * 60 * 60);
    return { qrCodeDataUrl, backupCodes };
  }

  async enableMfa(userId: string, dto: SetupMfaDto) {
    const valid = await this.validateMfa(userId, dto.code, undefined);
    if (!valid) throw new UnauthorizedException(ERROR_CODES.AUTH_MFA_REQUIRED);
    await this.prisma.user.update({ where: { id: userId }, data: { isMfaEnabled: true } });
    return { enabled: true };
  }

  async disableMfa(userId: string, dto: DisableMfaDto) {
    const valid = await this.validateMfa(userId, dto.code, undefined);
    if (!valid) throw new UnauthorizedException(ERROR_CODES.AUTH_MFA_REQUIRED);
    await this.prisma.user.update({
      where: { id: userId },
      data: { isMfaEnabled: false, mfaSecretEncrypted: null },
    });
    await this.redis.del(`mfa:backup:${userId}`);
    return { disabled: true };
  }

  private async validateMfa(userId: string, totpCode?: string, backupCode?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
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
}
