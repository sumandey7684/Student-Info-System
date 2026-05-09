import { Module } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';
import { AuditLogsQueryService } from './audit-logs-query.service';

@Module({
  providers: [AuditLogService, AuditLogsQueryService],
  controllers: [AuditLogController],
  exports: [AuditLogService],
})
export class AuditLogModule {}
