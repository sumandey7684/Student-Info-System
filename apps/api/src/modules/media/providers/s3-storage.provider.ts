import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { SignedUpload, StorageProvider } from './storage-provider.interface';

@Injectable()
export class S3StorageProvider implements StorageProvider {
  private readonly client = new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT || undefined,
    credentials:
      process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
          }
        : undefined,
  });

  async getSignedUploadUrl(input: {
    key: string;
    mimeType: string;
    size: number;
  }): Promise<SignedUpload> {
    const bucket = process.env.STORAGE_BUCKET ?? 'sis';
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: input.key,
      ContentType: input.mimeType,
      ACL: 'private',
    });
    const expiresIn = 600;
    const uploadUrl = await getSignedUrl(this.client, command, { expiresIn });
    return {
      uploadUrl,
      key: input.key,
      expiresIn,
      headers: { 'content-type': input.mimeType, 'x-upload-size': String(input.size) },
    };
  }
}
