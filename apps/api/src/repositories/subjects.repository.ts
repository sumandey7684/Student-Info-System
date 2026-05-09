import { Injectable } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.SubjectCreateInput) {
    return this.prisma.subject.create({ data });
  }

  findAllActive() {
    return this.prisma.subject.findMany({
      where: { deletedAt: null },
      include: { department: true },
    });
  }
}
