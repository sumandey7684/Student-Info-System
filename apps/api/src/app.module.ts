import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { RequestTraceMiddleware } from './common/middleware/request-trace.middleware';
import { TeachersModule } from './modules/teachers/teachers.module';
import { ParentsModule } from './modules/parents/parents.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ClassesModule } from './modules/classes/classes.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { QueueModule } from './modules/queue/queue.module';
import { CommonModule } from './common/common.module';
import { MediaModule } from './modules/media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PrismaModule,
    RedisModule,
    CommonModule,
    AuditLogModule,
    AuthModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
    ParentsModule,
    DepartmentsModule,
    SubjectsModule,
    CoursesModule,
    ClassesModule,
    PaymentsModule,
    AnalyticsModule,
    QueueModule,
    MediaModule,
    NotificationsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestTraceMiddleware).forRoutes('*');
  }
}
