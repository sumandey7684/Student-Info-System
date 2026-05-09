import { Injectable } from '@nestjs/common';
import { Prisma, TokenType } from '@prisma/client';
import { PrismaService } from '../modules/prisma/prisma.service';

const userRolesDeepInclude = {
  roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
} satisfies Prisma.UserInclude;

export type UserWithRolePermissions = Prisma.UserGetPayload<{
  include: typeof userRolesDeepInclude;
}>;

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUniqueByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  createUserBasic(data: { email: string; fullName: string; passwordHash: string }) {
    return this.prisma.user.create({ data });
  }

  createAuthToken(data: Prisma.AuthTokenUncheckedCreateInput) {
    return this.prisma.authToken.create({ data });
  }

  findUserForLogin(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: userRolesDeepInclude,
    });
  }

  createSession(data: Prisma.SessionUncheckedCreateInput) {
    return this.prisma.session.create({ data });
  }

  findSession(sessionId: string) {
    return this.prisma.session.findUnique({ where: { id: sessionId } });
  }

  findUserWithRolesFlat(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });
  }

  rotateSessionAndAudit(params: {
    sessionId: string;
    refreshTokenHashNext: string;
    userId: string;
    ipAddress?: string | null;
    priorIp?: string | null;
  }) {
    return this.prisma.$transaction(async (tx) => {
      await tx.session.update({
        where: { id: params.sessionId },
        data: {
          refreshTokenHash: params.refreshTokenHashNext,
          ipAddress: params.ipAddress ?? params.priorIp ?? undefined,
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: params.userId,
          action: 'AUTH_REFRESH',
          resource: 'AUTH',
          resourceId: params.sessionId,
          status: 'SUCCESS',
        },
      });
    });
  }

  revokeSession(sessionId: string) {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }

  findActiveSessionsForUser(userId: string) {
    return this.prisma.session.findMany({
      where: { userId, revokedAt: null },
      select: { id: true },
    });
  }

  revokeAllActiveSessions(userId: string) {
    return this.prisma.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  findPasswordResetTokens() {
    return this.prisma.authToken.findMany({
      where: { type: TokenType.PASSWORD_RESET, consumedAt: null, expiresAt: { gt: new Date() } },
    });
  }

  findEmailVerifyTokens() {
    return this.prisma.authToken.findMany({
      where: { type: TokenType.EMAIL_VERIFY, consumedAt: null, expiresAt: { gt: new Date() } },
    });
  }

  findUserRequired(userId: string) {
    return this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
  }

  resetPasswordConsumeToken(params: { userId: string; newPasswordHash: string; tokenId: string }) {
    return this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: params.userId },
        data: { passwordHash: params.newPasswordHash },
      }),
      this.prisma.authToken.update({
        where: { id: params.tokenId },
        data: { consumedAt: new Date() },
      }),
    ]);
  }

  consumeEmailVerify(tokenId: string) {
    return this.prisma.authToken.update({
      where: { id: tokenId },
      data: { consumedAt: new Date() },
    });
  }

  updateMfaPendingSecret(userId: string, secret: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { mfaSecretEncrypted: secret },
    });
  }

  enableMfa(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isMfaEnabled: true },
    });
  }

  disableMfa(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isMfaEnabled: false, mfaSecretEncrypted: null },
    });
  }

  findUserSecrets(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        isMfaEnabled: true,
        mfaSecretEncrypted: true,
        passwordHash: true,
      },
    });
  }

  findJwtIdentity(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, isMfaEnabled: true },
    });
  }

  existsById(id: string) {
    return this.prisma.user.count({ where: { id } }).then((c) => c > 0);
  }

  findUserAuthorizationGraph(userId: string): Promise<UserWithRolePermissions | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: userRolesDeepInclude,
    });
  }
}
