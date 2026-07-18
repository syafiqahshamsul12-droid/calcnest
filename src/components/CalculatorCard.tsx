import { ReactNode } from 'react';

interface CalculatorCardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  id: string; // strict identifier requirement
  className?: string;
  key?: string | number;
}

export default function CalculatorCard({
  children,
  title,
  description,
  id,
  className = '',
}: CalculatorCardProps) {
  return (
    <article
      id={id}
      className={`w-full bg-white border border-gray-100 rounded-2xl shadow-xs p-6 md:p-8 transition-all duration-300 hover:shadow-md hover:border-gray-200/80 ${className}`}
    >
      {(title || description) && (
        <div className="mb-6 md:mb-8 border-b border-gray-100 pb-5">
          {title && (
            <h2 className="text-xl md:text-2xl font-sans font-semibold tracking-tight text-gray-900 mb-1">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-gray-500 font-sans leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
      <div>{children}</div>
    </article>
  );
}
