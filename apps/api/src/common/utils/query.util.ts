import { QueryDto } from '../dto/query.dto';

export function buildPagination(query: QueryDto) {
  const take = query.limit;
  const skip = (query.page - 1) * query.limit;
  return { take, skip };
}

export function buildSort(query: QueryDto, fallbackField = 'createdAt') {
  return {
    [query.sortBy ?? fallbackField]: query.order ?? 'desc',
  };
}
