import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { name: string; code: string; subjectId?: string; teacherId?: string }) {
    return this.prisma.course.create({ data });
  }

  list() {
    return this.prisma.course.findMany({
      where: { deletedAt: null },
      include: { subject: true, teacher: { include: { user: true } } },
    });
  }
}
