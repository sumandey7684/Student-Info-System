import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../modules/prisma/prisma.module';
import { TransactionManager } from './transaction.manager';
import { AuthRepository } from './auth.repository';
import { StudentsRepository } from './students.repository';
import { TeachersRepository } from './teachers.repository';
import { ParentsRepository } from './parents.repository';
import { DepartmentsRepository } from './departments.repository';
import { SubjectsRepository } from './subjects.repository';
import { CoursesRepository } from './courses.repository';
import { ClassesRepository } from './classes.repository';
import { AnalyticsRepository } from './analytics.repository';
import { MediaRepository } from './media.repository';
import { AuditLogsRepository } from './audit-logs.repository';
import { DatabaseRepository } from './database.repository';
import { PaymentsRepository } from './payments.repository';

export const CORE_REPOSITORIES = [
  TransactionManager,
  AuthRepository,
  StudentsRepository,
  TeachersRepository,
  ParentsRepository,
  DepartmentsRepository,
  SubjectsRepository,
  CoursesRepository,
  ClassesRepository,
  AnalyticsRepository,
  MediaRepository,
  AuditLogsRepository,
  DatabaseRepository,
  PaymentsRepository,
] as const;

@Global()
@Module({
  imports: [PrismaModule],
  providers: [...CORE_REPOSITORIES],
  exports: [...CORE_REPOSITORIES],
})
export class RepositoriesModule {}
