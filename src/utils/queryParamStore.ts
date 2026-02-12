const STORAGE_KEY = 'query_params';

// Params injected by OAuth redirects that should never be persisted
const TRANSIENT_PARAMS = new Set(['error', 'code', 'state']);

/**
 * Merge any non-transient query params from the current URL into
 * sessionStorage. Runs on every location change so params added at
 * any point in the session are preserved until the tab is closed.
 */
export function captureQueryParams(search: string): void {
  const params = new URLSearchParams(search);
  const existing = getStoredQueryParams();
  let changed = false;

  params.forEach((value, key) => {
    if (!TRANSIENT_PARAMS.has(key) && existing[key] !== value) {
      existing[key] = value;
      changed = true;
    }
  });

  if (changed) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }
}

/**
 * Return all stored query params as a key-value record.
 */
export function getStoredQueryParams(): Record<string, string> {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/**
 * Append stored params to a path, without overriding params already present.
 */
export function buildUrlWithParams(path: string): string {
  const stored = getStoredQueryParams();
  if (Object.keys(stored).length === 0) return path;

  const [basePath, existingSearch] = path.split('?');
  const params = new URLSearchParams(existingSearch || '');

  for (const [key, value] of Object.entries(stored)) {
    if (!params.has(key)) {
      params.set(key, value);
    }
  }

  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/**
 * Return stored params as a URL query string (without leading '?').
 */
export function getStoredQueryString(): string {
  const stored = getStoredQueryParams();
  const params = new URLSearchParams(stored);
  return params.toString();
}
