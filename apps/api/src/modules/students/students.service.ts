import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from '../../common/dto/query.dto';
import { buildPagination } from '../../common/utils/query.util';
import { CreateStudentDto, UpdateStudentDto } from './students.dto';
import * as argon2 from 'argon2';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStudentDto) {
    return this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        passwordHash: await argon2.hash('TempPass#123'),
        student: {
          create: {
            registration: dto.registration,
            gradeLevel: dto.gradeLevel,
            guardianNote: dto.guardianNote,
          },
        },
      },
      include: { student: true },
    });
  }

  async findAll(query: QueryDto) {
    const { skip, take } = buildPagination(query);
    const where = {
      deletedAt: null,
      ...(query.search
        ? {
            OR: [
              { fullName: { contains: query.search, mode: 'insensitive' as const } },
              { email: { contains: query.search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
      student: { isNot: null },
    };
    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: { student: true },
        skip,
        take,
        orderBy: { createdAt: query.order },
      }),
      this.prisma.user.count({ where }),
    ]);
    return { items, total, page: query.page, limit: query.limit };
  }

  async update(studentUserId: string, dto: UpdateStudentDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: studentUserId },
      include: { student: true },
    });
    if (!user?.student) throw new NotFoundException('Student not found');
    return this.prisma.student.update({
      where: { id: user.student.id },
      data: dto,
    });
  }

  async softDelete(studentUserId: string) {
    await this.prisma.user.update({
      where: { id: studentUserId },
      data: { deletedAt: new Date() },
    });
    return { deleted: true };
  }
}
