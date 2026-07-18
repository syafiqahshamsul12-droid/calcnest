import { useEffect } from 'react';
import { SEOMetadata } from '../types';

interface SEOManagerProps {
  metadata: SEOMetadata;
}

export default function SEOManager({ metadata }: SEOManagerProps) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = `${metadata.title} | CalcNest`;

    // 2. Manage Standard Metas
    updateMetaTag('name', 'description', metadata.description);

    // 3. Manage Open Graph (OG) Metas
    updateMetaTag('property', 'og:title', `${metadata.title} | CalcNest`);
    updateMetaTag('property', 'og:description', metadata.description);
    updateMetaTag('property', 'og:url', metadata.canonicalUrl);
    updateMetaTag('property', 'og:type', metadata.ogType || 'website');
    updateMetaTag('property', 'og:site_name', 'CalcNest');

    // 4. Manage Twitter Metas
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', `${metadata.title} | CalcNest`);
    updateMetaTag('name', 'twitter:description', metadata.description);

    // 5. Manage Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', metadata.canonicalUrl);

    // 6. Manage JSON-LD & FAQ Structured Data Scripts
    const scriptIds: string[] = [];

    // Main Structured Data
    if (metadata.structuredData) {
      const mainScript = document.createElement('script');
      mainScript.id = 'seo-jsonld-main';
      mainScript.type = 'application/ld+json';
      mainScript.text = JSON.stringify(metadata.structuredData);
      document.head.appendChild(mainScript);
      scriptIds.push(mainScript.id);
    }

    // FAQ Schema
    if (metadata.faqSchema && metadata.faqSchema.length > 0) {
      const faqScript = document.createElement('script');
      faqScript.id = 'seo-jsonld-faq';
      faqScript.type = 'application/ld+json';
      
      const faqData = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': metadata.faqSchema.map((item) => ({
          '@type': 'Question',
          'name': item.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': item.answer,
          },
        })),
      };

      faqScript.text = JSON.stringify(faqData);
      document.head.appendChild(faqScript);
      scriptIds.push(faqScript.id);
    }

    // Cleanup function when component unmounts or changes
    return () => {
      scriptIds.forEach((id) => {
        const script = document.getElementById(id);
        if (script) {
          script.remove();
        }
      });
    };
  }, [metadata]);

  return null; // Pure side-effect component
}

// Helper to find and update or create meta tags
function updateMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}
