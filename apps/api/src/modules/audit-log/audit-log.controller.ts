import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from '../../common/dto/query.dto';
import { buildPagination } from '../../common/utils/query.util';

@ApiTags('audit-logs')
@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(@Query() query: QueryDto) {
    const { skip, take } = buildPagination(query);
    const where = query.search
      ? {
          OR: [
            { action: { contains: query.search, mode: 'insensitive' as const } },
            { resource: { contains: query.search, mode: 'insensitive' as const } },
          ],
        }
      : {};
    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({ skip, take, where, orderBy: { createdAt: 'desc' } }),
      this.prisma.auditLog.count({ where }),
    ]);
    return { items, total, page: query.page, limit: query.limit };
  }
}
