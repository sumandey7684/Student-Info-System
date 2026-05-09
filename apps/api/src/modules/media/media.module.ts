import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { LocalStorageProvider } from './providers/local-storage.provider';
import { S3StorageProvider } from './providers/s3-storage.provider';

@Module({
  providers: [MediaService, LocalStorageProvider, S3StorageProvider],
  controllers: [MediaController],
})
export class MediaModule {}
