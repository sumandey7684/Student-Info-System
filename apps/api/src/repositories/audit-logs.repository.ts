import { Injectable } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuditLogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.AuditLogUncheckedCreateInput, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return client.auditLog.create({ data });
  }

  paginated(skip: number, take: number, where: Prisma.AuditLogWhereInput) {
    return Promise.all([
      this.prisma.auditLog.findMany({
        skip,
        take,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);
  }

  findStripeWebhookReplay(action: string, resourceId: string) {
    return this.prisma.auditLog.findFirst({
      where: { action, resourceId },
      select: { id: true },
    });
  }
}
