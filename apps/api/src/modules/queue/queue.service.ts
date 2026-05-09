import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue, Worker, JobsOptions, QueueEvents } from 'bullmq';

@Injectable()
export class QueueService implements OnModuleDestroy {
  private readonly connection = {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
  };
  private readonly emailQueue = new Queue('email-queue', { connection: this.connection });
  private readonly deadLetterQueue = new Queue('dead-letter-queue', {
    connection: this.connection,
  });
  private readonly notificationQueue = new Queue('notification-queue', {
    connection: this.connection,
  });
  private readonly queueEvents = new QueueEvents('email-queue', { connection: this.connection });

  private readonly emailWorker = new Worker(
    'email-queue',
    async (job) => {
      console.log('Processing email job', job.name, job.data);
    },
    {
      connection: this.connection,
      concurrency: 5,
      lockDuration: 60_000,
      autorun: true,
    },
  );

  constructor() {
    this.emailWorker.on('failed', async (job, error) => {
      await this.deadLetterQueue.add('email-failed', {
        jobId: job?.id,
        name: job?.name,
        data: job?.data,
        reason: error.message,
      });
    });
  }

  async enqueueEmail(name: string, payload: Record<string, unknown>, options?: JobsOptions) {
    return this.emailQueue.add(name, payload, {
      attempts: 5,
      removeOnComplete: 200,
      removeOnFail: 1000,
      backoff: { type: 'exponential', delay: 1_000 },
      ...options,
    });
  }

  async enqueueNotification(name: string, payload: Record<string, unknown>, options?: JobsOptions) {
    return this.notificationQueue.add(name, payload, {
      attempts: 3,
      removeOnComplete: 200,
      removeOnFail: 1000,
      backoff: { type: 'fixed', delay: 500 },
      ...options,
    });
  }

  async onModuleDestroy() {
    await Promise.all([
      this.emailWorker.close(),
      this.queueEvents.close(),
      this.emailQueue.close(),
      this.deadLetterQueue.close(),
      this.notificationQueue.close(),
    ]);
  }
}
