import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { AnalyticsRepository } from '../../repositories/analytics.repository';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly analyticsRepo: AnalyticsRepository,
    private readonly redis: RedisService,
  ) {}

  async dashboardSummary() {
    const cacheKey = 'analytics:dashboard:summary';
    const cached = await this.redis.get<Record<string, unknown>>(cacheKey);
    if (cached) return cached;

    const [students, teachers, attendancePresent, attendanceTotal, revenue] =
      await this.analyticsRepo.dashboardSummaryTuples();

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
