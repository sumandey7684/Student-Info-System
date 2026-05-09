import { Worker } from 'bullmq';

const worker = new Worker(
  'email-queue',
  async (job) => {
    console.log('[email-worker]', job.name, job.id);
  },
  {
    connection: {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT ?? 6379),
    },
    concurrency: 10,
  },
);

worker.on('failed', (job, error) => {
  console.error('[email-worker][failed]', job?.id, error.message);
});
