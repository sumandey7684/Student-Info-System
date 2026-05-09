import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryDto } from '../../common/dto/query.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TeachersService } from './teachers.service';

@ApiTags('teachers')
@Controller('teachers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  @RequirePermissions('teachers:read')
  list(@Query() query: QueryDto) {
    return this.teachersService.findAll(query);
  }

  @Post()
  @RequirePermissions('teachers:create')
  create(@Body() dto: { fullName: string; email: string; departmentId?: string }) {
    return this.teachersService.create(dto);
  }
}
