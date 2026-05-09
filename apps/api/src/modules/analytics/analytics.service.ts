import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async dashboardSummary() {
    const cacheKey = 'analytics:dashboard:summary';
    const cached = await this.redis.get<Record<string, unknown>>(cacheKey);
    if (cached) return cached;

    const [students, teachers, attendancePresent, attendanceTotal, revenue] = await Promise.all([
      this.prisma.student.count({ where: { deletedAt: null } }),
      this.prisma.teacher.count({ where: { deletedAt: null } }),
      this.prisma.attendance.count({ where: { present: true } }),
      this.prisma.attendance.count(),
      this.prisma.payment.aggregate({
        where: { status: 'SUCCEEDED' },
        _sum: { amount: true },
      }),
    ]);

    const data = {
      students,
      teachers,
      attendanceRate: attendanceTotal === 0 ? 0 : (attendancePresent / attendanceTotal) * 100,
      revenue: revenue._sum.amount ?? 0,
    };
    await this.redis.set(cacheKey, data, 120);
    return data;
  }
}
