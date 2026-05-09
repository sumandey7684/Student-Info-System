import { BadRequestException } from '@nestjs/common';

const REQUIRED_KEYS = [
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'COOKIE_SECRET',
  'REDIS_HOST',
] as const;

export function validateEnv(config: Record<string, unknown>) {
  const missing = REQUIRED_KEYS.filter((key) => !config[key]);
  if (missing.length) {
    throw new BadRequestException(`Missing required environment variables: ${missing.join(', ')}`);
  }
  return config;
}
