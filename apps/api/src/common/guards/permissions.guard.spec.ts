import { Reflector } from '@nestjs/core';
import { PermissionsGuard } from './permissions.guard';

describe('PermissionsGuard', () => {
  it('allows super admin override', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['students:read']),
    } as unknown as Reflector;
    const guard = new PermissionsGuard(reflector);
    const result = guard.canActivate({
      getClass: () => ({}),
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user: { roles: ['SUPER_ADMIN'], permissions: [] } }),
      }),
    } as never);
    expect(result).toBe(true);
  });
});
