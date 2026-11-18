// High-performance In-Memory Cache with TTL & Tag-based invalidation
// Drastically slashes MongoDB query count and accelerates server response time

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  set<T>(key: string, data: T, ttlSeconds: number = 60): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttlSeconds * 1000,
    });
  }

  invalidate(keyPrefixOrExact: string): void {
    for (const key of this.cache.keys()) {
      if (key === keyPrefixOrExact || key.startsWith(keyPrefixOrExact)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

export const serverCache = new MemoryCache();
