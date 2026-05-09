import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { QueryDto } from '../../common/dto/query.dto';
import { TeachersRepository } from '../../repositories/teachers.repository';

@Injectable()
export class TeachersService {
  constructor(private readonly teachersRepo: TeachersRepository) {}

  async create(dto: { fullName: string; email: string; departmentId?: string }) {
    const passwordHash = await argon2.hash('TempPass#123');
    return this.teachersRepo.createTeacherUser(passwordHash, dto);
  }

  async findAll(query: QueryDto) {
    const [items, total] = await this.teachersRepo.paginatedTeachers(query);
    return { items, total, page: query.page, limit: query.limit };
  }
}
