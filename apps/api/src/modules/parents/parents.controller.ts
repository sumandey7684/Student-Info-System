import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ParentsService } from './parents.service';
import { QueryDto } from '../../common/dto/query.dto';

@ApiTags('parents')
@Controller('parents')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Get()
  @RequirePermissions('parents:read')
  list(@Query() query: QueryDto) {
    return this.parentsService.list(query);
  }

  @Post()
  @RequirePermissions('parents:create')
  create(@Body() dto: { fullName: string; email: string }) {
    return this.parentsService.create(dto);
  }
}
