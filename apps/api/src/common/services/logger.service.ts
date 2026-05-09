import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppLoggerService extends Logger {
  logAudit(message: string, context?: string) {
    this.log(`[AUDIT] ${message}`, context);
  }
}
