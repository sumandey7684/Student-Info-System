import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ParentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: { fullName: string; email: string }) {
    return this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        passwordHash: await argon2.hash('TempPass#123'),
        parent: { create: {} },
      },
      include: { parent: true },
    });
  }

  list() {
    return this.prisma.user.findMany({
      where: { deletedAt: null, parent: { isNot: null } },
      include: { parent: true },
    });
  }
}
