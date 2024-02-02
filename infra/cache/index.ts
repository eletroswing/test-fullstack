import Redis from "ioredis";

class Cache {
  private redis: Redis;

  constructor(redis_url: string) {
    this.redis = new Redis(redis_url);
  }

  public async search(key: string) {
    const res = await this.redis.get(key);
    if(res) return JSON.parse(res);
    return 
  }

  public async save(key: string, expires_in: number, data: any) {
    return await this.redis.setex(key, expires_in, JSON.stringify(data));
  }
}

export default Cache;
