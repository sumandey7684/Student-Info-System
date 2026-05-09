import { Injectable } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DepartmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.DepartmentCreateInput) {
    return this.prisma.department.create({ data });
  }

  findAllActive() {
    return this.prisma.department.findMany({ where: { deletedAt: null } });
  }
}
