import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { MediaService } from './media.service';
import { TracedRequest } from '../../common/middleware/request-trace.middleware';

@ApiTags('media')
@Controller('media')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('signed-upload')
  @RequirePermissions('media:create')
  createSignedUpload(
    @Req() req: TracedRequest,
    @Body() dto: { filename: string; mimeType: string; size: number },
  ) {
    const user = req.user as { id: string };
    return this.mediaService.createSignedUpload(user.id, dto.filename, dto.mimeType, dto.size);
  }

  @Post('metadata')
  @RequirePermissions('media:create')
  saveMetadata(
    @Req() req: TracedRequest,
    @Body() dto: { key: string; mimeType: string; size: number; checksum?: string },
  ) {
    const user = req.user as { id: string };
    return this.mediaService.saveMetadata({
      ownerId: user.id,
      key: dto.key,
      mimeType: dto.mimeType,
      size: dto.size,
      checksum: dto.checksum,
    });
  }
}
