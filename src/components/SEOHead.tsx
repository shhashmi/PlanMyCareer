import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { seoConfig, BASE_URL, DEFAULT_IMAGE, SITE_NAME } from '../config/seoConfig';
import { generateBreadcrumbs } from '../lib/structuredData';

interface SEOHeadProps {
  title?: string;
  description?: string;
  noIndex?: boolean;
  structuredData?: object;
}

export default function SEOHead({ title, description, noIndex, structuredData }: SEOHeadProps) {
  const { pathname } = useLocation();
  const config = seoConfig[pathname];

  const pageTitle = title || config?.title || `${SITE_NAME} - AI Skill Gap Analysis`;
  const pageDescription = description || config?.description || '';
  const shouldNoIndex = noIndex ?? config?.noIndex ?? false;
  const canonicalUrl = `${BASE_URL}${pathname === '/' ? '' : pathname}`;

  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {shouldNoIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={DEFAULT_IMAGE} />
      <meta property="og:image:alt" content="AI Fluens — AI Skill Gap Analysis & Personalized Upskilling Plans" />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />

      {/* Breadcrumb structured data */}
      {breadcrumbs && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
      )}

      {/* Page-specific structured data */}
      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
    </Helmet>
  );
}
