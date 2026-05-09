import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../modules/prisma/prisma.service';
import { QueryDto } from '../common/dto/query.dto';
import { buildPagination } from '../common/utils/query.util';

@Injectable()
export class StudentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createStudentUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data, include: { student: true } });
  }

  paginatedStudentUsers(query: QueryDto, where: Prisma.UserWhereInput) {
    const { skip, take } = buildPagination(query);
    const orderBy: Prisma.UserOrderByWithRelationInput =
      typeof query.order === 'string' && query.sortBy
        ? { [query.sortBy]: query.order }
        : { createdAt: query.order ?? 'desc' };

    return Promise.all([
      this.prisma.user.findMany({
        where,
        include: { student: true },
        skip,
        take,
        orderBy,
      }),
      this.prisma.user.count({ where }),
    ]);
  }

  findUserWithStudent(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { student: true },
    });
  }

  updateStudentRow(studentRecordId: string, data: Prisma.StudentUpdateInput) {
    return this.prisma.student.update({
      where: { id: studentRecordId },
      data,
    });
  }

  softDeleteUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
  }
}
