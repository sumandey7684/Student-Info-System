import { Injectable } from '@nestjs/common';
import { DepartmentsRepository } from '../../repositories/departments.repository';

@Injectable()
export class DepartmentsService {
  constructor(private readonly departmentsRepo: DepartmentsRepository) {}

  create(data: { name: string; code: string }) {
    return this.departmentsRepo.create(data);
  }

  list() {
    return this.departmentsRepo.findAllActive();
  }
}
