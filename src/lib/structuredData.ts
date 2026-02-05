import { BASE_URL, SITE_NAME } from '../config/seoConfig';

const ROUTE_LABELS: Record<string, string> = {
  '/how-it-works': 'How It Works',
  '/pricing': 'Pricing',
  '/faq': 'FAQ',
  '/about': 'About',
  '/contact': 'Contact',
  '/privacy-policy': 'Privacy Policy',
  '/terms-of-use': 'Terms of Use',
  '/refund-policy': 'Refund Policy',
  '/skills': 'Your AI Skills',
  '/login': 'Sign In',
};

export function generateBreadcrumbs(pathname: string): object | null {
  if (pathname === '/') return null;

  const label = ROUTE_LABELS[pathname] || pathname.slice(1).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: SITE_NAME,
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: label,
        item: `${BASE_URL}${pathname}`,
      },
    ],
  };
}
