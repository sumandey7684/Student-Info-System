import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { sanitizePayload } from '../security/sanitize.util';

@Injectable()
export class PayloadSanitizationMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    if (req.body) req.body = sanitizePayload(req.body);
    if (req.query) req.query = sanitizePayload(req.query) as Request['query'];
    next();
  }
}
