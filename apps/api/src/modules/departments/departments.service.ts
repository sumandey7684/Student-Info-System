import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { name: string; code: string }) {
    return this.prisma.department.create({ data });
  }

  list() {
    return this.prisma.department.findMany({ where: { deletedAt: null } });
  }
}
