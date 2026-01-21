declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('Google Analytics: Missing VITE_GA_MEASUREMENT_ID');
    return;
  }

  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', {
      page_path: window.location.pathname,
      anonymize_ip: true
    });
  `;
  document.head.appendChild(script2);
};

export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  window.gtag('config', measurementId, {
    page_path: url
  });
};

export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const trackConversion = (conversionLabel: string, value?: number) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'conversion', {
    send_to: conversionLabel,
    value: value,
    currency: 'USD'
  });
};

export const trackAssessmentStart = (assessmentType: 'basic' | 'advanced') => {
  trackEvent('assessment_start', 'assessment', assessmentType);
};

export const trackAssessmentComplete = (assessmentType: 'basic' | 'advanced', score: number) => {
  trackEvent('assessment_complete', 'assessment', assessmentType, score);
};

export const trackSignup = (method: string) => {
  trackEvent('sign_up', 'user', method);
};

export const trackLogin = (method: string) => {
  trackEvent('login', 'user', method);
};
