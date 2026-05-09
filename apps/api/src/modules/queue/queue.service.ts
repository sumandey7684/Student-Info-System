import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue, Worker, JobsOptions } from 'bullmq';

@Injectable()
export class QueueService implements OnModuleDestroy {
  private readonly connection = {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
  };
  private readonly emailQueue = new Queue('email-queue', { connection: this.connection });
  private readonly notificationQueue = new Queue('notification-queue', {
    connection: this.connection,
  });

  private readonly emailWorker = new Worker(
    'email-queue',
    async (job) => {
      console.log('Processing email job', job.name, job.data);
    },
    { connection: this.connection },
  );

  async enqueueEmail(name: string, payload: Record<string, unknown>, options?: JobsOptions) {
    return this.emailQueue.add(name, payload, { attempts: 3, backoff: { type: 'exponential', delay: 500 }, ...options });
  }

  async enqueueNotification(name: string, payload: Record<string, unknown>, options?: JobsOptions) {
    return this.notificationQueue.add(name, payload, {
      attempts: 3,
      backoff: { type: 'fixed', delay: 500 },
      ...options,
    });
  }

  async onModuleDestroy() {
    await Promise.all([
      this.emailWorker.close(),
      this.emailQueue.close(),
      this.notificationQueue.close(),
    ]);
  }
}
