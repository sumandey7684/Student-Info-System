import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { NextFunction, Request, Response } from 'express';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const currentToken = req.signedCookies?.csrf_token ?? req.cookies?.csrf_token;
    if (!currentToken) {
      const token = randomBytes(24).toString('hex');
      res.cookie('csrf_token', token, {
        httpOnly: false,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        signed: true,
      });
    }

    if (SAFE_METHODS.has(req.method)) {
      next();
      return;
    }

    const requestToken = req.headers['x-csrf-token'];
    const cookieToken = req.signedCookies?.csrf_token ?? req.cookies?.csrf_token;
    if (!requestToken || !cookieToken || requestToken !== cookieToken) {
      throw new UnauthorizedException('Invalid CSRF token');
    }
    next();
  }
}
