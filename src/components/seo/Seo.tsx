
import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

interface SeoProps {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  openGraph?: Record<string, string>;
  twitter?: Record<string, string>;
  jsonLd?: object | object[];
}

export function Seo({
  title,
  description,
  canonical,
  image,
  openGraph = {},
  twitter = {},
  jsonLd
}: SeoProps) {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        
        {/* Default image for Open Graph */}
        {image && <meta property="og:image" content={image} />}
        
        {/* Open Graph tags */}
        {Object.entries(openGraph).map(([key, val]) => (
          <meta key={`og:${key}`} property={`og:${key}`} content={val} />
        ))}
        
        {/* Twitter Card tags */}
        {Object.entries(twitter).map(([key, val]) => (
          <meta key={`twitter:${key}`} name={`twitter:${key}`} content={val} />
        ))}
        
        {/* JSON-LD Schema */}
        {jsonLd && (
          <script type="application/ld+json">
            {JSON.stringify(jsonLd)}
          </script>
        )}
      </Helmet>
    </HelmetProvider>
  );
}
