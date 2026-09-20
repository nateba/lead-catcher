import { BRAZIL_STATES } from '../data/categories';

// Worldwide country/state/city lists come from countriesnow (free, no key, CORS
// open). Brazilian municipalities come from IBGE instead — it is the official
// registry, and the automatic search geocodes those names, so they must be exact.
const COUNTRIES_NOW = 'https://countriesnow.space/api/v0.1';
const IBGE_ESTADOS = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

export interface CountryOption {
  /** English name — what countriesnow expects back in its queries. */
  value: string;
  /** Localized name shown in the UI and used in the Google Maps query. */
  label: string;
}

const countriesCache: { list?: CountryOption[] } = {};
const statesCache = new Map<string, string[]>();
const citiesCache = new Map<string, string[]>();

const byLabel = (a: CountryOption, b: CountryOption) => a.label.localeCompare(b.label, 'pt-BR');
const sortPt = (names: string[]) => names.sort((a, b) => a.localeCompare(b, 'pt-BR'));

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${COUNTRIES_NOW}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(json.msg || `Falha ao consultar ${path} (${res.status}).`);
  }
  return json.data as T;
}

export async function getCountries(): Promise<CountryOption[]> {
  if (countriesCache.list) return countriesCache.list;

  const res = await fetch(`${COUNTRIES_NOW}/countries/iso`);
  if (!res.ok) throw new Error(`Não foi possível carregar a lista de países (${res.status}).`);
  const json = await res.json();

  let display: Intl.DisplayNames | null = null;
  try {
    display = new Intl.DisplayNames(['pt-BR'], { type: 'region' });
  } catch {
    display = null; // very old browsers: fall back to the English names
  }

  const list = (json.data as Array<{ name: string; Iso2: string }>)
    .map(({ name, Iso2 }) => ({
      value: name,
      label: (Iso2 && display?.of(Iso2)) || name,
    }))
    .sort(byLabel);

  countriesCache.list = list;
  return list;
}

export async function getStates(country: string): Promise<string[]> {
  const cached = statesCache.get(country);
  if (cached) return cached;

  const data = await postJson<{ states: Array<{ name: string }> }>('/countries/states', { country });
  const names = sortPt(data.states.map((s) => s.name));

  statesCache.set(country, names);
  return names;
}

/** Municipalities of a Brazilian state, by UF code — used by the automatic search. */
export async function getCitiesByUf(uf: string): Promise<string[]> {
  const key = `uf:${uf}`;
  const cached = citiesCache.get(key);
  if (cached) return cached;

  const res = await fetch(`${IBGE_ESTADOS}/${uf}/municipios`);
  if (!res.ok) throw new Error(`IBGE respondeu ${res.status} ao listar municípios de ${uf}.`);

  const data = (await res.json()) as Array<{ nome: string }>;
  const names = sortPt(data.map((m) => m.nome));

  citiesCache.set(key, names);
  return names;
}

export async function getCities(country: string, state: string): Promise<string[]> {
  const key = `${country}:${state}`;
  const cached = citiesCache.get(key);
  if (cached) return cached;

  // Prefer IBGE whenever the state resolves to a Brazilian UF.
  const uf = BRAZIL_STATES.find((s) => s.name === state)?.uf;
  if (uf && /brazil|brasil/i.test(country)) {
    const names = await getCitiesByUf(uf);
    citiesCache.set(key, names);
    return names;
  }

  const names = sortPt(await postJson<string[]>('/countries/state/cities', { country, state }));
  citiesCache.set(key, names);
  return names;
}
