import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { name: string; code: string; teacherId?: string; courseId?: string }) {
    return this.prisma.classRoom.create({ data });
  }

  list() {
    return this.prisma.classRoom.findMany({
      where: { deletedAt: null },
      include: { teacher: { include: { user: true } }, course: true, students: true },
    });
  }
}
