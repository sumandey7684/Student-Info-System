import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { QueryDto } from '../../common/dto/query.dto';
import { ParentsRepository } from '../../repositories/parents.repository';

@Injectable()
export class ParentsService {
  constructor(private readonly parentsRepo: ParentsRepository) {}

  async create(dto: { fullName: string; email: string }) {
    const passwordHash = await argon2.hash('TempPass#123');
    return this.parentsRepo.createParentUser(passwordHash, dto);
  }

  async list(query: QueryDto) {
    const [items, total] = await this.parentsRepo.paginatedParents(query);
    return { items, total, page: query.page, limit: query.limit };
  }
}
