const STORAGE_KEY = 'query_params';

// Params injected by OAuth redirects that should never be persisted
const TRANSIENT_PARAMS = new Set(['error', 'code', 'state']);

let initialLoadHandled = false;

/**
 * On the very first call (full page load), reset stored params to match
 * only the current URL so that manually removed params are respected.
 * On subsequent in-app navigations, merge as before.
 */
export function captureQueryParams(search: string): void {
  const params = new URLSearchParams(search);

  if (!initialLoadHandled) {
    initialLoadHandled = true;
    const fresh: Record<string, string> = {};
    params.forEach((value, key) => {
      if (!TRANSIENT_PARAMS.has(key)) {
        fresh[key] = value;
      }
    });
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return;
  }

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
 * Remove specific params from sessionStorage.
 */
export function removeStoredQueryParams(...keys: string[]): void {
  const stored = getStoredQueryParams();
  let changed = false;

  for (const key of keys) {
    if (key in stored) {
      delete stored[key];
      changed = true;
    }
  }

  if (changed) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }
}

/**
 * Return stored params as a URL query string (without leading '?').
 */
export function getStoredQueryString(): string {
  const stored = getStoredQueryParams();
  const params = new URLSearchParams(stored);
  return params.toString();
}
