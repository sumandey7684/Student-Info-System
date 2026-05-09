import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';
import { DatabaseRepository } from '../../repositories/database.repository';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly databaseRepository: DatabaseRepository,
  ) {}

  @Get('live')
  live() {
    return { status: 'ok' };
  }

  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([
      async () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      async () => {
        await this.databaseRepository.ping();
        return { database: { status: 'up' } };
      },
    ]);
  }
}
