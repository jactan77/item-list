import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheStorageService {
  private readonly CACHE_NAME = 'app-cache-v1';

  private async getCache(): Promise<Cache> {
    return await caches.open(this.CACHE_NAME);
  }

  async setItem(key: string, value: any): Promise<void> {
    const cache = await this.getCache();
    const response = new Response(JSON.stringify(value));
    await cache.put(key, response);
  }

  async getItem<T>(key: string): Promise<T | null> {
    const cache : Cache = await this.getCache();
    const response : Response | undefined = await cache.match(key);

    if (!response) {
      return null;
    }

    const data = await response.json();
    return data as T;
  }

  async removeItem(key: string): Promise<void> {
    const cache : Cache = await this.getCache();
    await cache.delete(key);
  }

  async clear(): Promise<void> {
    await caches.delete(this.CACHE_NAME);
  }

  async getAllKeys(): Promise<string[]> {
    const cache = await this.getCache();
    const requests = await cache.keys();
    return requests.map(request => request.url);
  }
}
