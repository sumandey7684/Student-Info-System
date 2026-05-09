import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { RedisService } from '../redis/redis.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuthRepository } from '../../repositories/auth.repository';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn().mockResolvedValue('token') },
        },
        {
          provide: AuthRepository,
          useValue: {
            findUniqueByEmail: jest.fn(),
            createUserBasic: jest.fn(),
            createAuthToken: jest.fn(),
            findUserForLogin: jest.fn(),
            createSession: jest.fn(),
            findSession: jest.fn(),
            findUserWithRolesFlat: jest.fn(),
            rotateSessionAndAudit: jest.fn(),
            revokeSession: jest.fn(),
            findActiveSessionsForUser: jest.fn(),
            revokeAllActiveSessions: jest.fn(),
            findPasswordResetTokens: jest.fn(),
            findUserRequired: jest.fn(),
            resetPasswordConsumeToken: jest.fn(),
            findEmailVerifyTokens: jest.fn(),
            consumeEmailVerify: jest.fn(),
            updateMfaPendingSecret: jest.fn(),
            enableMfa: jest.fn(),
            disableMfa: jest.fn(),
            findUserSecrets: jest.fn(),
          },
        },
        { provide: RedisService, useValue: { set: jest.fn(), del: jest.fn(), get: jest.fn() } },
        { provide: AuditLogService, useValue: { create: jest.fn() } },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
