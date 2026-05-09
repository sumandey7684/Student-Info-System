import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubjectsService } from './subjects.service';

@ApiTags('subjects')
@Controller('subjects')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  @RequirePermissions('subjects:read')
  list() {
    return this.subjectsService.list();
  }

  @Post()
  @RequirePermissions('subjects:create')
  create(@Body() dto: { name: string; code: string; departmentId?: string }) {
    return this.subjectsService.create(dto);
  }
}
