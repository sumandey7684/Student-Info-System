import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DepartmentsService } from './departments.service';

@ApiTags('departments')
@Controller('departments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  @RequirePermissions('departments:read')
  list() {
    return this.departmentsService.list();
  }

  @Post()
  @RequirePermissions('departments:create')
  create(@Body() dto: { name: string; code: string }) {
    return this.departmentsService.create(dto);
  }
}
