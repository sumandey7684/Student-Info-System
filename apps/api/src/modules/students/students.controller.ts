import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  @Get()
  list() {
    return [
      {
        id: 's_1',
        regNo: 'SIS-2026-001',
        fullName: 'Alice Johnson',
        attendanceRate: 94.2,
      },
    ];
  }
}
