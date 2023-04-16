
import { Injectable } from '@nestjs/common';
import { Logger as NestLogger } from '@nestjs/common/services/logger.service';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
@Injectable()
export class RedisService {
  nestLogger: any = undefined;
  constructor(
    @InjectRedis() private readonly redis: Redis,
  ) {
    this.nestLogger = new NestLogger('Redis_Logger');
  }

  async setKeyNoExpire(key: string, value: string) {
    await this.redis.set(key, value)
  }
  async setKey(key: string, value: string, ex: string, ttl?: number) {
    await this.redis.set(key, value, "EX", ttl);
  }
  async getKey(key: string): Promise<Record<string, any> | any> {
    const result = await this.redis.get(key);
    return JSON.parse(result);
  }
}
