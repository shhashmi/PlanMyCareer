import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
const STORAGE_KEY = 'utm_data';

export function useUTMTracking() {
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const utmData: Record<string, string> = {};
    let hasUTM = false;

    for (const param of UTM_PARAMS) {
      const value = params.get(param);
      if (value) {
        utmData[param] = value;
        hasUTM = true;
      }
    }

    if (!hasUTM) return;

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utmData));

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('set', utmData);
    }
  }, [search]);
}
