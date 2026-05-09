import { Injectable } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { buildPagination } from '../common/utils/query.util';
import { QueryDto } from '../common/dto/query.dto';

@Injectable()
export class TeachersRepository {
  constructor(private readonly prisma: PrismaService) {}

  createTeacherUser(
    passwordHash: string,
    dto: { fullName: string; email: string; departmentId?: string },
  ) {
    return this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        passwordHash,
        teacher: { create: dto.departmentId ? { departmentId: dto.departmentId } : {} },
      },
      include: { teacher: true },
    });
  }

  paginatedTeachers(query: QueryDto) {
    const { skip, take } = buildPagination(query);
    const where: Prisma.UserWhereInput = { deletedAt: null, teacher: { isNot: null } };
    return Promise.all([
      this.prisma.user.findMany({
        where,
        include: { teacher: true },
        skip,
        take,
        orderBy: { createdAt: query.order ?? 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);
  }
}
