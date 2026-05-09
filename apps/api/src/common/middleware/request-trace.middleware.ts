import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

export interface TracedRequest extends Request {
  requestId?: string;
}

@Injectable()
export class RequestTraceMiddleware implements NestMiddleware {
  use(req: TracedRequest, _: Response, next: NextFunction) {
    req.requestId = req.headers['x-request-id']?.toString() ?? randomUUID();
    next();
  }
}
