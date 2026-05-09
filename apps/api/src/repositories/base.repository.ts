import { QueryDto } from '../common/dto/query.dto';

export type PaginationResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export abstract class BaseRepository {
  protected toPagination<T>(items: T[], total: number, query: QueryDto): PaginationResult<T> {
    return { items, total, page: query.page, limit: query.limit };
  }
}
