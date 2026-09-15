import { Lead, SearchFilters } from '../types';

interface CachedSearchResult {
  timestamp: number;
  results: Lead[];
  center: { lat: number; lng: number };
  totalFound: number;
}

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes TTL
const memoryCache = new Map<string, CachedSearchResult>();

export function generateSearchCacheKey(filters: SearchFilters): string {
  const normCity = filters.city.trim().toLowerCase();
  const normState = filters.state.trim().toUpperCase();
  const normCat = filters.categoryKey.trim().toLowerCase();
  const customTag = (filters.customCategoryTag || '').trim().toLowerCase();
  return `${normState}_${normCity}_${normCat}_${customTag}_${filters.radiusKm}km`;
}

export function getCachedSearch(filters: SearchFilters): {
  results: Lead[];
  center: { lat: number; lng: number };
  totalFound: number;
} | null {
  const key = generateSearchCacheKey(filters);
  const cached = memoryCache.get(key);

  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > CACHE_TTL_MS) {
    memoryCache.delete(key);
    return null;
  }

  // Return a cloned copy to prevent mutations
  return {
    results: [...cached.results],
    center: { ...cached.center },
    totalFound: cached.totalFound,
  };
}

export function setCachedSearch(
  filters: SearchFilters,
  results: Lead[],
  center: { lat: number; lng: number }
): void {
  const key = generateSearchCacheKey(filters);
  memoryCache.set(key, {
    timestamp: Date.now(),
    results: [...results],
    center: { ...center },
    totalFound: results.length,
  });

  // Keep cache size bounded (max 50 recent queries)
  if (memoryCache.size > 50) {
    const firstKey = memoryCache.keys().next().value;
    if (firstKey) {
      memoryCache.delete(firstKey);
    }
  }
}

export function clearSearchCache(): void {
  memoryCache.clear();
}
