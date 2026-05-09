import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return [{ id: 'u_1', role: 'ADMIN', fullName: 'System Admin' }];
  }
}
