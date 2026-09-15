import { Lead, SearchFilters, OsmType } from '../types';
import { BUSINESS_CATEGORIES } from '../data/categories';
import { NICHE_DEFINITIONS, findNicheByTerm } from '../data/nicheMappings';
import { getInitials, getAvatarColor, formatOpeningHours } from '../utils/formatters';
import { OVERPASS_ENDPOINTS } from '../constants';
import { calculateDistanceKm, formatDistance } from '../utils/distanceUtils';
import { normalizeOsmElement } from '../utils/leadNormalizer';
import { deduplicateLeads } from '../utils/leadDeduplication';
import { getCachedSearch, setCachedSearch } from './searchCache';
import { authHeaders } from '../lib/apiAuth';

export { getInitials, getAvatarColor, formatOpeningHours, OVERPASS_ENDPOINTS, calculateDistanceKm, formatDistance };

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
  city: string;
  state: string;
  formattedLocation: string;
}

let lastNominatimCallTime = 0;

/**
 * Geocodes city and state prioritizing city/town/municipality within Brazil.
 */
export async function geocodeCity(
  city: string,
  state: string,
  signal?: AbortSignal
): Promise<GeocodeResult | null> {
  const cleanCity = city.trim();
  const cleanState = state.trim();
  const query = `${cleanCity}, ${cleanState}, Brasil`;

  // Respect Nominatim 1 req/sec policy
  const now = Date.now();
  const timeSinceLast = now - lastNominatimCallTime;
  if (timeSinceLast < 1000) {
    await new Promise((r) => setTimeout(r, 1000 - timeSinceLast));
  }
  lastNominatimCallTime = Date.now();

  // 1. Try backend proxy first
  try {
    const proxyRes = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`, {
      headers: await authHeaders(),
      signal,
    });
    if (proxyRes.ok) {
      const data = await proxyRes.json();
      if (Array.isArray(data) && data.length > 0) {
        // Prioritize city/administrative place
        const best = data.find((item: any) =>
          item.type === 'city' ||
          item.type === 'administrative' ||
          item.class === 'boundary' ||
          item.class === 'place'
        ) || data[0];

        const address = best.address || {};
        const detectedCity = address.city || address.town || address.municipality || address.village || cleanCity;
        const detectedState = address.state || cleanState;
        const formatted = `${detectedCity}, ${detectedState}, Brasil`;

        return {
          lat: parseFloat(best.lat),
          lng: parseFloat(best.lon),
          displayName: best.display_name,
          city: detectedCity,
          state: detectedState,
          formattedLocation: formatted,
        };
      }
    }
  } catch (proxyErr: any) {
    if (proxyErr.name === 'AbortError' || signal?.aborted) {
      throw new Error('Busca cancelada pelo usuário.');
    }
    console.warn('Proxy geocode failed, trying direct Nominatim fallback:', proxyErr);
  }

  // 2. Direct Nominatim fallback
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=br&q=${encodeURIComponent(
      query
    )}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'LeadSiteAI/2.0 (https://leadsite.ai - Prospeccao Local)',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
      signal,
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const best = data.find((item: any) =>
      item.type === 'city' ||
      item.type === 'administrative' ||
      item.class === 'boundary' ||
      item.class === 'place'
    ) || data[0];

    const address = best.address || {};
    const detectedCity = address.city || address.town || address.municipality || address.village || cleanCity;
    const detectedState = address.state || cleanState;
    const formatted = `${detectedCity}, ${detectedState}, Brasil`;

    return {
      lat: parseFloat(best.lat),
      lng: parseFloat(best.lon),
      displayName: best.display_name,
      city: detectedCity,
      state: detectedState,
      formattedLocation: formatted,
    };
  } catch (error: any) {
    if (error.name === 'AbortError' || signal?.aborted) {
      throw new Error('Busca cancelada pelo usuário.');
    }
    console.error('Nominatim error:', error);
    return null;
  }
}

/**
 * Builds an optimized Overpass QL Query supporting multi-tag combinations.
 */
export function buildOverpassQuery(
  tags: string[],
  lat: number,
  lng: number,
  radiusMeters: number
): string {
  const queryBlocks: string[] = [];

  tags.forEach((tagStr) => {
    // tagStr can be "amenity=restaurant;cuisine=pizza" or "shop=hairdresser"
    const tagConditions = tagStr
      .split(';')
      .map((pair) => {
        const [key, val] = pair.split('=');
        if (val) {
          return `["${key.trim()}"="${val.trim()}"]`;
        }
        return `["${key.trim()}"]`;
      })
      .join('');

    queryBlocks.push(`node${tagConditions}(around:${radiusMeters},${lat},${lng});`);
    queryBlocks.push(`way${tagConditions}(around:${radiusMeters},${lat},${lng});`);
  });

  return `[out:json][timeout:25];
(
  ${queryBlocks.join('\n  ')}
);
out center tags;`;
}

/**
 * Executes Overpass query with multi-server mirrors and cancellation signal support.
 */
export async function executeOverpassSearch(
  query: string,
  preferredServer: string = 'auto',
  signal?: AbortSignal
): Promise<any> {
  const serversToTry =
    preferredServer !== 'auto' && preferredServer.startsWith('http')
      ? [preferredServer, ...OVERPASS_ENDPOINTS.filter((s) => s !== preferredServer)]
      : OVERPASS_ENDPOINTS;

  // 1. Try via backend proxy first
  try {
    const proxyResponse = await fetch('/api/overpass-proxy', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ query, servers: serversToTry }),
      signal,
    });

    if (proxyResponse.ok) {
      const result = await proxyResponse.json();
      if (result.success && result.data) {
        return result.data;
      }
    }
  } catch (proxyError: any) {
    if (proxyError.name === 'AbortError' || signal?.aborted) {
      throw new Error('Busca cancelada pelo usuário.');
    }
    console.warn('Overpass proxy request failed, switching to client mirrors:', proxyError?.message);
  }

  // 2. Direct client fallback across multiple mirrors
  let lastErr: any = null;

  for (let i = 0; i < serversToTry.length; i++) {
    if (signal?.aborted) {
      throw new Error('Busca cancelada pelo usuário.');
    }

    const server = serversToTry[i];
    try {
      const response = await fetch(server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: `data=${encodeURIComponent(query)}`,
        signal,
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
      lastErr = new Error(`Servidor ${server} retornou status HTTP ${response.status}`);
    } catch (err: any) {
      if (err.name === 'AbortError' || signal?.aborted) {
        throw new Error('Busca cancelada pelo usuário.');
      }
      lastErr = err;
      console.warn(`Overpass server [${i + 1}/${serversToTry.length}] (${server}) indisponível:`, err?.message);
    }
  }

  throw new Error(
    `Não foi possível obter dados dos servidores OpenStreetMap após consultar múltiplos espelhos (${serversToTry.length} servidores). Tente novamente em instantes ou reduza o raio de busca.`
  );
}

export interface SearchResultPayload {
  leads: number;
  results: Lead[];
  center: { lat: number; lng: number };
  locationFormatted: string;
  fromCache?: boolean;
}

/**
 * Full business search pipeline:
 * 1. Cache check
 * 2. Geocoding
 * 3. Niche & Overpass tags resolution
 * 4. Multi-server Overpass Query
 * 5. Lead normalization
 * 6. High-precision deduplication
 * 7. Lead qualification scoring (0-100)
 * 8. Filtering & sorting by top opportunity
 */
export async function searchLeads(
  filters: SearchFilters,
  onProgress?: (step: number, message: string) => void,
  preferredServer: string = 'auto',
  signal?: AbortSignal,
  bypassCache = false
): Promise<SearchResultPayload> {
  // Step 0: Check memory/session cache
  if (!bypassCache) {
    const cached = getCachedSearch(filters);
    if (cached) {
      onProgress?.(4, 'Resultados carregados do cache instantâneo...');
      return {
        leads: cached.results.length,
        results: cached.results,
        center: cached.center,
        locationFormatted: `${filters.city}, ${filters.state}, Brasil`,
        fromCache: true,
      };
    }
  }

  // Step 1: Geocoding
  onProgress?.(1, `Localizando ${filters.city}, ${filters.state}...`);
  const geo = await geocodeCity(filters.city, filters.state, signal);
  if (!geo) {
    throw new Error(`Não encontramos a cidade "${filters.city}, ${filters.state}". Verifique a digitação ou selecione um estado vizinho.`);
  }

  // Step 2: Resolve Category & Multi-tag OSM conditions
  let tagsToQuery: string[] = ['shop=hairdresser'];
  let categoryLabel = 'Negócio Local';

  if (filters.categoryKey === 'personalizado' && filters.customCategoryTag) {
    tagsToQuery = [filters.customCategoryTag.trim()];
    categoryLabel = `Tag: ${filters.customCategoryTag.trim()}`;
  } else {
    // Check rich niche definitions with multi-tags
    const niche = NICHE_DEFINITIONS.find((n) => n.key === filters.categoryKey);
    if (niche) {
      tagsToQuery = niche.overpassTags && niche.overpassTags.length > 0 ? niche.overpassTags : [niche.primaryTag];
      categoryLabel = niche.label;
    } else {
      const standardCat = BUSINESS_CATEGORIES.find((c) => c.key === filters.categoryKey);
      if (standardCat) {
        tagsToQuery = [standardCat.osmTag];
        categoryLabel = standardCat.label;
      }
    }
  }

  // Step 3: Overpass Query
  onProgress?.(2, 'Consultando base de dados do OpenStreetMap...');
  const radiusMeters = Math.min(filters.radiusKm * 1000, 35000); // safety cap at 35km
  const overpassQL = buildOverpassQuery(tagsToQuery, geo.lat, geo.lng, radiusMeters);

  const rawOsmData = await executeOverpassSearch(overpassQL, preferredServer, signal);
  const elements = rawOsmData?.elements || [];

  // Step 4: Normalization
  onProgress?.(3, 'Processando e qualificando leads...');
  const rawLeads: Lead[] = [];

  for (const el of elements) {
    const lead = normalizeOsmElement(el, {
      categoryKey: filters.categoryKey,
      categoryLabel,
      searchCity: geo.city,
      searchState: geo.state,
      centerLat: geo.lat,
      centerLng: geo.lng,
    });

    if (lead) {
      rawLeads.push(lead);
    }
  }

  // Step 5: High-precision deduplication
  onProgress?.(4, 'Removendo duplicatas e calculando oportunidades...');
  const deduplicated = deduplicateLeads(rawLeads);

  // Step 6: Apply Filters
  const filtered = deduplicated.filter((lead) => {
    // Website filter (default prioritizes/filters businesses without identified website)
    if (filters.websiteFilter === 'no_website_only' && lead.hasWebsite) {
      return false;
    }
    if (filters.websiteFilter === 'has_website_only' && !lead.hasWebsite) {
      return false;
    }

    // Phone filter
    if (filters.onlyWithPhone && !lead.phone) {
      return false;
    }

    // Full address filter (street + housenumber)
    if (filters.onlyWithFullAddress && (!lead.street || !lead.housenumber)) {
      return false;
    }

    // Exclude closed/disused
    if (filters.excludeClosed && lead.closed) {
      return false;
    }

    // Minimum Lead Score filter
    if (typeof filters.minScore === 'number' && filters.minScore > 0) {
      if (lead.leadScore < filters.minScore) {
        return false;
      }
    }

    return true;
  });

  // Step 7: Sort by Opportunity (Lead Score descending by default)
  filtered.sort((a, b) => {
    if (b.leadScore !== a.leadScore) {
      return b.leadScore - a.leadScore;
    }
    return a.distanceKm - b.distanceKm;
  });

  // Step 8: Safe limit
  const limitCount = Math.max(5, Math.min(filters.limit || 50, 200));
  const finalResults = filtered.slice(0, limitCount);

  // Save to Cache
  setCachedSearch(filters, finalResults, { lat: geo.lat, lng: geo.lng });

  return {
    leads: finalResults.length,
    results: finalResults,
    center: { lat: geo.lat, lng: geo.lng },
    locationFormatted: geo.formattedLocation,
  };
}
