import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PermissionCacheService } from '../../../common/services/permission-cache.service';
import { AuthRepository } from '../../../repositories/auth.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly permissionCache: PermissionCacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET ?? 'change_me',
    });
  }

  async validate(payload: { sub: string; email?: string }) {
    const thin = await this.authRepository.findJwtIdentity(payload.sub);
    if (!thin) return null;

    const authz = await this.permissionCache.getPermissionsForUser(thin.id);

    return {
      id: thin.id,
      email: payload.email ?? thin.email,
      roles: authz.roles,
      permissions: authz.permissions,
      isMfaEnabled: thin.isMfaEnabled,
    };
  }
}
