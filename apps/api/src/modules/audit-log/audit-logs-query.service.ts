import { Injectable } from '@nestjs/common';
import { QueryDto } from '../../common/dto/query.dto';
import { buildPagination } from '../../common/utils/query.util';
import { AuditLogsRepository } from '../../repositories/audit-logs.repository';

@Injectable()
export class AuditLogsQueryService {
  constructor(private readonly auditLogsRepository: AuditLogsRepository) {}

  async listPaginated(query: QueryDto) {
    const { skip, take } = buildPagination(query);
    const where = query.search
      ? {
          OR: [
            { action: { contains: query.search, mode: 'insensitive' as const } },
            { resource: { contains: query.search, mode: 'insensitive' as const } },
          ],
        }
      : {};
    const [items, total] = await this.auditLogsRepository.paginated(skip, take, where);
    return { items, total, page: query.page, limit: query.limit };
  }
}
