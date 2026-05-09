import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { name: string; code: string; departmentId?: string }) {
    return this.prisma.subject.create({ data });
  }

  list() {
    return this.prisma.subject.findMany({ where: { deletedAt: null }, include: { department: true } });
  }
}
