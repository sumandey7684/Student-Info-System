import { Injectable } from '@nestjs/common';
import { ClassesRepository } from '../../repositories/classes.repository';

@Injectable()
export class ClassesService {
  constructor(private readonly classesRepo: ClassesRepository) {}

  create(data: { name: string; code: string; teacherId?: string; courseId?: string }) {
    return this.classesRepo.create(data);
  }

  list() {
    return this.classesRepo.findAllActive();
  }
}
