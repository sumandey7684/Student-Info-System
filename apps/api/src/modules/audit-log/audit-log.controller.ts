import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QueryDto } from '../../common/dto/query.dto';
import { AuditLogsQueryService } from './audit-logs-query.service';

@ApiTags('audit-logs')
@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogsQuery: AuditLogsQueryService) {}

  @Get()
  async list(@Query() query: QueryDto) {
    return this.auditLogsQuery.listPaginated(query);
  }
}
