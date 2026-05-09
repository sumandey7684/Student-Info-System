import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuditLogsRepository } from '../../repositories/audit-logs.repository';

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
  constructor(private readonly auditLogsRepository: AuditLogsRepository) {}

  async create(input: AuditInput) {
    return this.auditLogsRepository.create({
      actorId: input.actorId,
      targetUserId: input.targetUserId,
      action: input.action,
      resource: input.resource,
      resourceId: input.resourceId,
      status: input.status,
      requestId: input.requestId,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      metadata:
        input.metadata === undefined ? undefined : (input.metadata as Prisma.InputJsonValue),
    });
  }
}
