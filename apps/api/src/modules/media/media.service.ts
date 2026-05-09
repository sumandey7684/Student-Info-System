import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LocalStorageProvider } from './providers/local-storage.provider';
import { S3StorageProvider } from './providers/s3-storage.provider';
import { StorageProvider } from './providers/storage-provider.interface';

@Injectable()
export class MediaService {
  private readonly provider: StorageProvider;

  constructor(
    private readonly prisma: PrismaService,
    localStorageProvider: LocalStorageProvider,
    s3StorageProvider: S3StorageProvider,
  ) {
    this.provider = (process.env.STORAGE_DRIVER ?? 'local') === 's3' ? s3StorageProvider : localStorageProvider;
  }

  async createSignedUpload(ownerId: string, filename: string, mimeType: string, size: number) {
    if (size > 10 * 1024 * 1024) throw new BadRequestException('File too large');
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(mimeType)) throw new BadRequestException('Unsupported mime type');
    const cleanName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `uploads/${ownerId}/${new Date().toISOString().slice(0, 10)}/${Date.now()}-${cleanName}`;
    return this.provider.getSignedUploadUrl({ key, mimeType, size });
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
