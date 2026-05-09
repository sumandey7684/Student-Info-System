import { QueryDto } from '../common/dto/query.dto';
import { buildPagination } from '../common/utils/query.util';

/** Case-insensitive OR search across string fields used in list endpoints. */
export function buildInsensitiveOrSearch(fields: string[], search?: string) {
  if (!search?.trim()) return {};
  const mode = 'insensitive' as const;
  return {
    OR: fields.map((field) => ({ [field]: { contains: search, mode } })),
  };
}

/** Standard paginated twin queries (caller supplies Prisma delegates). */
export async function twinQueries<T>(
  query: QueryDto,
  findMany: (skip: number, take: number) => Promise<T[]>,
  count: () => Promise<number>,
) {
  const { skip, take } = buildPagination(query);
  const [items, total] = await Promise.all([findMany(skip, take), count()]);
  return { items, total, page: query.page, limit: query.limit };
}
