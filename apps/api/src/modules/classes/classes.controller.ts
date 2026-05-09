import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ClassesService } from './classes.service';

@ApiTags('classes')
@Controller('classes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  @RequirePermissions('classes:read')
  list() {
    return this.classesService.list();
  }

  @Post()
  @RequirePermissions('classes:create')
  create(@Body() dto: { name: string; code: string; teacherId?: string; courseId?: string }) {
    return this.classesService.create(dto);
  }
}
