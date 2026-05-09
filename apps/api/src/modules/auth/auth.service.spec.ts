import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { AuditLogService } from '../audit-log/audit-log.service';

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
          provide: PrismaService,
          useValue: {
            user: { findUnique: jest.fn(), create: jest.fn() },
            authToken: { create: jest.fn(), findMany: jest.fn(), update: jest.fn() },
            session: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
            $transaction: jest.fn(),
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
