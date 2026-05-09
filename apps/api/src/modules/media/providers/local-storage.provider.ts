import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SignedUpload, StorageProvider } from './storage-provider.interface';

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  async getSignedUploadUrl(input: {
    key: string;
    mimeType: string;
    size: number;
  }): Promise<SignedUpload> {
    const token = randomUUID();
    return {
      uploadUrl: `${process.env.APP_BASE_URL ?? 'http://localhost:3000'}/uploads/${input.key}?token=${token}`,
      key: input.key,
      expiresIn: 600,
      headers: { 'content-type': input.mimeType, 'x-upload-size': String(input.size) },
    };
  }
}
