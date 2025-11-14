
import { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export interface YoastSeoData {
  title?: string;
  description?: string;
  canonical?: string;
  opengraph_title?: string;
  opengraph_description?: string;
  opengraph_image?: string;
  opengraph_url?: string;
  opengraph_site_name?: string;
  opengraph_type?: string;
  twitter_card?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  schema?: object | object[];
  breadcrumb?: object;
}

interface UseYoastSeoProps {
  yoastData?: YoastSeoData;
  fallbackTitle: string;
  fallbackDescription?: string;
  fallbackCanonical?: string;
  siteName?: string;
}

export function useYoastSeo({
  yoastData,
  fallbackTitle,
  fallbackDescription = '',
  fallbackCanonical = '',
  siteName = 'Jimmy'
}: UseYoastSeoProps) {
  const { currentLang } = useLanguage();

  return useMemo(() => {
    const title = yoastData?.title || `${fallbackTitle} | ${siteName}`;
    const description = yoastData?.description || fallbackDescription;
    
    // Create canonical URL without language prefix since we're not using URL-based localization
    const baseCanonical = fallbackCanonical || window.location.pathname;
    const canonical = yoastData?.canonical || baseCanonical;
    const fullCanonical = canonical.startsWith('http') ? canonical : `${window.location.origin}${canonical}`;
    
    const openGraph: Record<string, string> = {};
    const twitter: Record<string, string> = {};
    
    // Map Open Graph data
    if (yoastData?.opengraph_title) openGraph.title = yoastData.opengraph_title;
    if (yoastData?.opengraph_description) openGraph.description = yoastData.opengraph_description;
    if (yoastData?.opengraph_image) openGraph.image = yoastData.opengraph_image;
    if (yoastData?.opengraph_url) openGraph.url = yoastData.opengraph_url;
    if (yoastData?.opengraph_site_name) openGraph.site_name = yoastData.opengraph_site_name;
    if (yoastData?.opengraph_type) openGraph.type = yoastData.opengraph_type;
    
    // Fallbacks for Open Graph
    if (!openGraph.title) openGraph.title = title;
    if (!openGraph.description) openGraph.description = description;
    if (!openGraph.url) openGraph.url = fullCanonical;
    if (!openGraph.site_name) openGraph.site_name = siteName;
    if (!openGraph.type) openGraph.type = 'website';
    
    // Add language-specific Open Graph data
    openGraph.locale = currentLang === 'ar' ? 'ar_AE' : currentLang === 'fr' ? 'fr_FR' : 'en_US';
    
    // Map Twitter Card data
    if (yoastData?.twitter_card) twitter.card = yoastData.twitter_card;
    if (yoastData?.twitter_title) twitter.title = yoastData.twitter_title;
    if (yoastData?.twitter_description) twitter.description = yoastData.twitter_description;
    if (yoastData?.twitter_image) twitter.image = yoastData.twitter_image;
    
    // Fallbacks for Twitter
    if (!twitter.card) twitter.card = 'summary_large_image';
    if (!twitter.title) twitter.title = title;
    if (!twitter.description) twitter.description = description;
    
    // Combine schema data with language context
    let jsonLd = yoastData?.schema;
    if (yoastData?.breadcrumb && jsonLd) {
      if (Array.isArray(jsonLd)) {
        jsonLd = [...jsonLd, yoastData.breadcrumb];
      } else {
        jsonLd = [jsonLd, yoastData.breadcrumb];
      }
    } else if (yoastData?.breadcrumb) {
      jsonLd = yoastData.breadcrumb;
    }
    
    // Add language info to schema if present
    if (jsonLd) {
      const addInLanguage = (schema: any) => {
        if (schema && typeof schema === 'object') {
          schema.inLanguage = currentLang;
        }
        return schema;
      };
      
      if (Array.isArray(jsonLd)) {
        jsonLd = jsonLd.map(addInLanguage);
      } else {
        jsonLd = addInLanguage(jsonLd);
      }
    }
    
    return {
      title,
      description,
      canonical: fullCanonical,
      openGraph,
      twitter,
      jsonLd
    };
  }, [yoastData, fallbackTitle, fallbackDescription, fallbackCanonical, siteName, currentLang]);
}
