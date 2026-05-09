import { Injectable } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';

/** DB connectivity only — kept separate from domain repositories. */
@Injectable()
export class DatabaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  ping() {
    return this.prisma.$queryRaw`SELECT 1`;
  }
}
