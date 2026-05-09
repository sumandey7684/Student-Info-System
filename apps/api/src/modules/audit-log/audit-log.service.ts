import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type AuditInput = {
  actorId?: string;
  targetUserId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  status: 'SUCCESS' | 'FAILURE';
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
};

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: AuditInput) {
    return this.prisma.auditLog.create({
      data: input,
    });
  }
}
