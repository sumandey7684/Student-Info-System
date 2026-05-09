import { Injectable } from '@nestjs/common';
import { RedisService } from '../../modules/redis/redis.service';
import { AuthRepository } from '../../repositories/auth.repository';

@Injectable()
export class PermissionCacheService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly redis: RedisService,
  ) {}

  async getPermissionsForUser(userId: string): Promise<{ roles: string[]; permissions: string[] }> {
    const cacheKey = `authz:user:${userId}`;
    const cached = await this.redis.get<{ roles: string[]; permissions: string[] }>(cacheKey);
    if (cached) return cached;

    const user = await this.authRepository.findUserAuthorizationGraph(userId);
    if (!user) return { roles: [], permissions: [] };
    const roles = user.roles.map((entry) => entry.role.name);
    const permissions = user.roles.flatMap((entry) =>
      entry.role.permissions.map(
        (mapping) => `${mapping.permission.resource}:${mapping.permission.action}`,
      ),
    );
    const payload = { roles, permissions: [...new Set(permissions)] };
    await this.redis.set(cacheKey, payload, 300);
    return payload;
  }

  async invalidate(userId: string) {
    await this.redis.del(`authz:user:${userId}`);
  }
}
