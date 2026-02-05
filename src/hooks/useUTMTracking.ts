import { useEffect } from 'react';
import { getStoredQueryParams } from '../utils/queryParamStore';

const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

export function useUTMTracking() {
  useEffect(() => {
    const stored = getStoredQueryParams();
    const utmData: Record<string, string> = {};
    let hasUTM = false;

    for (const param of UTM_PARAMS) {
      const value = stored[param];
      if (value) {
        utmData[param] = value;
        hasUTM = true;
      }
    }

    if (!hasUTM) return;

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('set', utmData);
    }
  }, []);
}
