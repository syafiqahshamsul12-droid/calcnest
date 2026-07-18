/**
 * Global TypeScript declarations for CalcNest.
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: 'website' | 'article';
  faqSchema?: FAQItem[];
  structuredData?: Record<string, any>;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}
