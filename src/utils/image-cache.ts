// Image cache utilities for better performance

export class ImageCacheManager {
  private static instance: ImageCacheManager;
  private cache = new Map<
    string,
    { loaded: boolean; error: boolean; timestamp: number }
  >();
  private preloadQueue = new Set<string>();
  private maxCacheSize = 100;
  private cacheExpiry = 30 * 60 * 1000; // 30 minutes

  static getInstance(): ImageCacheManager {
    if (!ImageCacheManager.instance) {
      ImageCacheManager.instance = new ImageCacheManager();
    }
    return ImageCacheManager.instance;
  }

  // Normalize image URL
  normalizeUrl(url: string): string {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `https://phimimg.com/${url}`;
  }

  // Check if image is cached and not expired
  getCachedStatus(url: string): { loaded: boolean; error: boolean } | null {
    const normalizedUrl = this.normalizeUrl(url);
    const cached = this.cache.get(normalizedUrl);

    if (!cached) return null;

    // Check if cache is expired
    if (Date.now() - cached.timestamp > this.cacheExpiry) {
      this.cache.delete(normalizedUrl);
      return null;
    }

    return { loaded: cached.loaded, error: cached.error };
  }

  // Set cache status
  setCacheStatus(url: string, loaded: boolean, error: boolean): void {
    const normalizedUrl = this.normalizeUrl(url);

    // Clean old entries if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      this.cleanOldEntries();
    }

    this.cache.set(normalizedUrl, {
      loaded,
      error,
      timestamp: Date.now(),
    });
  }

  // Preload important images
  async preloadImage(url: string): Promise<boolean> {
    const normalizedUrl = this.normalizeUrl(url);

    if (this.preloadQueue.has(normalizedUrl)) {
      return false; // Already preloading
    }

    // Check cache first
    const cached = this.getCachedStatus(normalizedUrl);
    if (cached?.loaded) {
      return true;
    }

    this.preloadQueue.add(normalizedUrl);

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      const cleanup = () => {
        this.preloadQueue.delete(normalizedUrl);
        img.onload = null;
        img.onerror = null;
      };

      img.onload = () => {
        this.setCacheStatus(normalizedUrl, true, false);
        cleanup();
        resolve(true);
      };

      img.onerror = () => {
        this.setCacheStatus(normalizedUrl, false, true);
        cleanup();
        resolve(false);
      };

      img.src = normalizedUrl;

      // Timeout after 10 seconds
      setTimeout(() => {
        cleanup();
        resolve(false);
      }, 10000);
    });
  }

  // Preload multiple images with priority
  async preloadImages(urls: string[], maxConcurrent = 3): Promise<void> {
    const chunks = [];
    for (let i = 0; i < urls.length; i += maxConcurrent) {
      chunks.push(urls.slice(i, i + maxConcurrent));
    }

    for (const chunk of chunks) {
      await Promise.allSettled(chunk.map((url) => this.preloadImage(url)));
    }
  }

  // Clean old cache entries
  private cleanOldEntries(): void {
    const entries = Array.from(this.cache.entries());

    // Sort by timestamp and remove oldest entries
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    // Remove oldest 20% of entries
    const removeCount = Math.floor(entries.length * 0.2);
    for (let i = 0; i < removeCount; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  // Clear expired entries
  clearExpired(): void {
    const now = Date.now();
    for (const [url, data] of this.cache.entries()) {
      if (now - data.timestamp > this.cacheExpiry) {
        this.cache.delete(url);
      }
    }
  }

  // Clear all cache
  clearAll(): void {
    this.cache.clear();
    this.preloadQueue.clear();
  }

  // Get cache stats
  getStats(): { size: number; preloading: number } {
    return {
      size: this.cache.size,
      preloading: this.preloadQueue.size,
    };
  }
}

// Export singleton instance
export const imageCache = ImageCacheManager.getInstance();

// Preload hero images and other critical images
export const preloadCriticalImages = async (movies: any[]): Promise<void> => {
  if (!movies?.length) return;

  // Get first 5 movies' poster/thumb URLs for preloading
  const criticalUrls = movies
    .slice(0, 5)
    .map((movie) => movie.poster_url || movie.thumb_url)
    .filter(Boolean);

  await imageCache.preloadImages(criticalUrls, 2);
};
