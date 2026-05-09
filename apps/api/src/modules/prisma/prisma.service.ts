import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    this.$use(async (params, next) => {
      const start = performance.now();
      const result = await next(params);
      const elapsed = Math.round(performance.now() - start);
      if (elapsed > 200) {
        console.warn(`[prisma][slow] ${params.model}.${params.action} ${elapsed}ms`);
      }
      return result;
    });

    this.$use(async (params, next) => {
      const softDeleteModels = new Set([
        'User',
        'Student',
        'Teacher',
        'Parent',
        'Department',
        'Subject',
        'Course',
        'ClassRoom',
      ]);
      if (!params.model || !softDeleteModels.has(params.model)) {
        return next(params);
      }

      if ((params.action === 'findUnique' || params.action === 'findFirst') && params.args?.where) {
        params.action = 'findFirst';
        params.args.where = { ...params.args.where, deletedAt: null };
      }
      if (params.action === 'findMany') {
        params.args = params.args || {};
        params.args.where = { ...(params.args.where || {}), deletedAt: null };
      }
      return next(params);
    });

    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
