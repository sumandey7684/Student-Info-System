import { Global, Module } from '@nestjs/common';
import { PermissionCacheService } from './services/permission-cache.service';
import { AppLoggerService } from './services/logger.service';

@Global()
@Module({
  providers: [PermissionCacheService, AppLoggerService],
  exports: [PermissionCacheService, AppLoggerService],
})
export class CommonModule {}
