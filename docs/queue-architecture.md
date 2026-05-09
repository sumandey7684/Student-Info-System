# Queue Architecture

## Queues

- `email-queue`: email dispatch jobs
- `notification-queue`: push/system notification jobs
- `dead-letter-queue`: failed jobs routed for replay investigation

## Reliability Policy

- Exponential/fixed backoff retries
- Job timeout (`30s`)
- Failed jobs copied to dead-letter queue
- Dedicated worker process (`pnpm --filter @sis/api worker:email`)

## Operational Notes

- Monitor failed job growth in dead-letter queue.
- Replay dead-letter jobs only after root-cause fix.
- Keep queue workers horizontally scalable and stateless.
