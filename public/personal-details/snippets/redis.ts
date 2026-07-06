import { createClient } from "redis";

const client = createClient({ url: process.env.REDIS_URL });

await client.connect();

// Cache-aside pattern with TTL
async function getCached<T>(key: string, fetch: () => Promise<T>, ttl = 300): Promise<T> {
  const cached = await client.get(key);
  if (cached) return JSON.parse(cached) as T;

  const data = await fetch();
  await client.setEx(key, ttl, JSON.stringify(data));
  return data;
}
