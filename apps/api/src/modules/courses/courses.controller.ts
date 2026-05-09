import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CoursesService } from './courses.service';

@ApiTags('courses')
@Controller('courses')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @RequirePermissions('courses:read')
  list() {
    return this.coursesService.list();
  }

  @Post()
  @RequirePermissions('courses:create')
  create(@Body() dto: { name: string; code: string; subjectId?: string; teacherId?: string }) {
    return this.coursesService.create(dto);
  }
}
