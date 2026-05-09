import { Injectable } from '@nestjs/common';
import { CoursesRepository } from '../../repositories/courses.repository';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepo: CoursesRepository) {}

  create(data: { name: string; code: string; subjectId?: string; teacherId?: string }) {
    return this.coursesRepo.create(data);
  }

  list() {
    return this.coursesRepo.findAllActive();
  }
}
