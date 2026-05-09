import { Injectable } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CoursesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.CourseCreateInput) {
    return this.prisma.course.create({ data });
  }

  findAllActive() {
    return this.prisma.course.findMany({
      where: { deletedAt: null },
      include: {
        subject: true,
        teacher: { include: { user: true } },
      },
    });
  }
}
