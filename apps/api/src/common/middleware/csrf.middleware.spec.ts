import { UnauthorizedException } from '@nestjs/common';
import { CsrfMiddleware } from './csrf.middleware';

describe('CsrfMiddleware', () => {
  it('rejects mutating requests without token match', () => {
    const middleware = new CsrfMiddleware();
    const req = {
      method: 'POST',
      headers: {},
      signedCookies: { csrf_token: 'abc' },
      cookies: {},
    };
    const res = { cookie: jest.fn() };
    expect(() => middleware.use(req as never, res as never, jest.fn())).toThrow(UnauthorizedException);
  });
});
