import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../modules/prisma/prisma.service';

@Injectable()
export class MediaRepository {
  constructor(private readonly prisma: PrismaService) {}

  createAsset(data: Prisma.FileAssetUncheckedCreateInput) {
    return this.prisma.fileAsset.create({ data });
  }
}
