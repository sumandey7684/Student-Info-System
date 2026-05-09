import { Injectable, BadRequestException } from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async createSignedUpload(ownerId: string, filename: string, mimeType: string, size: number) {
    if (size > 10 * 1024 * 1024) throw new BadRequestException('File too large');
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(mimeType)) throw new BadRequestException('Unsupported mime type');
    const key = `${ownerId}/${Date.now()}-${filename}`;
    const uploadToken = createHash('sha256').update(`${key}:${randomUUID()}`).digest('hex');
    return {
      uploadUrl: `${process.env.APP_BASE_URL ?? 'http://localhost:3000'}/uploads/${key}?token=${uploadToken}`,
      key,
      uploadToken,
    };
  }

  async saveMetadata(input: {
    ownerId: string;
    key: string;
    mimeType: string;
    size: number;
    checksum?: string;
    storage?: string;
  }) {
    return this.prisma.fileAsset.create({
      data: {
        ownerId: input.ownerId,
        storage: input.storage ?? process.env.STORAGE_DRIVER ?? 'local',
        path: input.key,
        mimeType: input.mimeType,
        size: input.size,
        checksum: input.checksum,
      },
    });
  }
}
