import { Injectable } from '@nestjs/common';
import { SubjectsRepository } from '../../repositories/subjects.repository';

@Injectable()
export class SubjectsService {
  constructor(private readonly subjectsRepo: SubjectsRepository) {}

  create(data: { name: string; code: string; departmentId?: string }) {
    return this.subjectsRepo.create(data);
  }

  list() {
    return this.subjectsRepo.findAllActive();
  }
}
