import React from 'react';

// Layout for [locale] dynamic route
// This exports generateStaticParams() for all child routes
// Note: dynamicParams = false removed - it conflicts with output: 'export' and causes
// "missing generateStaticParams" false positive in dev (Next.js #64906, #56253)

export function generateStaticParams() {
  return [
    { locale: 'fr' }, // French first (default)
    { locale: 'en' }
  ];
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

