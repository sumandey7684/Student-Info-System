import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (!required?.length) return true;

    const request = context.switchToHttp().getRequest();
    const userPermissions: string[] = request.user?.permissions ?? [];
    const roles: string[] = request.user?.roles ?? [];
    if (roles.includes('SUPER_ADMIN')) return true;

    return required.every((permission) => userPermissions.includes(permission));
  }
}
