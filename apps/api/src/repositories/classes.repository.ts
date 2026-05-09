import { Injectable } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClassesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ClassRoomCreateInput) {
    return this.prisma.classRoom.create({ data });
  }

  findAllActive() {
    return this.prisma.classRoom.findMany({
      where: { deletedAt: null },
      include: { teacher: { include: { user: true } }, course: true, students: true },
    });
  }
}
