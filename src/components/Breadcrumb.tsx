import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '../types';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  id: string;
}

// Simple static string sanitizer to replace unescaped string interpolation
function sanitizePath(pathStr: string): string {
  const origin = window.location.origin;
  const cleanPath = pathStr.startsWith('/') ? pathStr : '/' + pathStr;
  return origin + cleanPath;
}

export default function Breadcrumb({ items, id }: BreadcrumbProps) {
  // Generate JSON-LD schema for breadcrumbs dynamically using sanitized path generator
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': window.location.origin,
      },
      ...items.map((item, idx) => ({
        '@type': 'ListItem',
        'position': idx + 2,
        'name': item.label,
        'item': item.path ? sanitizePath(item.path) : undefined,
      })),
    ],
  };

  return (
    <nav
      id={id}
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-xs sm:text-sm font-sans font-medium text-blue-700 mb-6 bg-gray-50/50 px-4 py-2.5 rounded-xl border border-gray-100 max-w-max"
    >
      {/* Schema Script Injection */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>

      <ol className="flex items-center gap-2">
        {/* Home Item */}
        <li className="flex items-center">
          <Link
            id={`${id}-home`}
            to="/"
            className="flex items-center gap-1 text-blue-700 hover:text-blue-900 hover:underline transition-colors font-semibold"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
        </li>

        {/* Dynamic Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              {isLast ? (
                <span
                  id={`${id}-item-${index}`}
                  className="text-blue-900 font-extrabold truncate max-w-[150px] sm:max-w-none"
                >
                  {item.label}
                </span>
              ) : !item.path ? (
                <span
                  id={`${id}-item-${index}`}
                  className="text-gray-500 font-normal"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  id={`${id}-link-${index}`}
                  to={item.path}
                  className="text-blue-700 hover:text-blue-900 hover:underline transition-colors font-semibold"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
