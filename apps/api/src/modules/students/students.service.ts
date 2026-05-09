import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { QueryDto } from '../../common/dto/query.dto';
import { CreateStudentDto, UpdateStudentDto } from './students.dto';
import * as argon2 from 'argon2';
import { StudentsRepository } from '../../repositories/students.repository';

@Injectable()
export class StudentsService {
  constructor(private readonly studentsRepo: StudentsRepository) {}

  async create(dto: CreateStudentDto) {
    const passwordHash = await argon2.hash('TempPass#123');
    return this.studentsRepo.createStudentUser({
      email: dto.email,
      fullName: dto.fullName,
      passwordHash,
      student: {
        create: {
          registration: dto.registration,
          gradeLevel: dto.gradeLevel,
          guardianNote: dto.guardianNote,
        },
      },
    });
  }

  async findAll(query: QueryDto) {
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      student: { isNot: null },
      ...(query.search
        ? {
            OR: [
              { fullName: { contains: query.search, mode: 'insensitive' as const } },
              { email: { contains: query.search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };
    const [items, total] = await this.studentsRepo.paginatedStudentUsers(query, where);
    return { items, total, page: query.page, limit: query.limit };
  }

  async update(studentUserId: string, dto: UpdateStudentDto) {
    const user = await this.studentsRepo.findUserWithStudent(studentUserId);
    if (!user?.student) throw new NotFoundException('Student not found');
    return this.studentsRepo.updateStudentRow(user.student.id, dto);
  }

  async softDelete(studentUserId: string) {
    await this.studentsRepo.softDeleteUser(studentUserId);
    return { deleted: true };
  }
}
