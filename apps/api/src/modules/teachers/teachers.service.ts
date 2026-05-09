import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { QueryDto } from '../../common/dto/query.dto';
import { buildPagination } from '../../common/utils/query.util';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: { fullName: string; email: string; departmentId?: string }) {
    return this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        passwordHash: await argon2.hash('TempPass#123'),
        teacher: { create: { departmentId: dto.departmentId } },
      },
      include: { teacher: true },
    });
  }

  findAll(query: QueryDto) {
    const { skip, take } = buildPagination(query);
    return this.prisma.user.findMany({
      where: { deletedAt: null, teacher: { isNot: null } },
      include: { teacher: true },
      skip,
      take,
    });
  }
}
