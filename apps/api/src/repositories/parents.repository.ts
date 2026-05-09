import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../modules/prisma/prisma.service';
import { QueryDto } from '../common/dto/query.dto';
import { buildPagination } from '../common/utils/query.util';

@Injectable()
export class ParentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createParentUser(passwordHash: string, dto: { fullName: string; email: string }) {
    return this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        passwordHash,
        parent: { create: {} },
      },
      include: { parent: true },
    });
  }

  paginatedParents(query: QueryDto) {
    const { skip, take } = buildPagination(query);
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      parent: { isNot: null },
      ...(query.search
        ? {
            OR: [
              { fullName: { contains: query.search, mode: 'insensitive' as const } },
              { email: { contains: query.search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };
    const orderBy: Prisma.UserOrderByWithRelationInput = { createdAt: query.order ?? 'desc' };
    return Promise.all([
      this.prisma.user.findMany({
        where,
        include: { parent: true },
        skip,
        take,
        orderBy,
      }),
      this.prisma.user.count({ where }),
    ]);
  }
}
