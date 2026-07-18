import { InputHTMLAttributes, ReactNode, ChangeEventHandler } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  id: string; // strict requirement
  rightIcon?: ReactNode;
  type?: string;
  placeholder?: string;
  step?: string;
  min?: string | number;
  max?: string | number;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  className?: string;
}

export default function Input({
  label,
  error,
  helperText,
  id,
  rightIcon,
  className = '',
  type = 'text',
  ...props
}: InputProps) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 leading-none"
        >
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        <input
          id={id}
          type={type}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={`w-full font-sans text-sm text-gray-900 placeholder:text-gray-400 bg-white border rounded-xl px-4 py-2.5 shadow-xs focus:ring-2 focus:ring-gray-950 focus:border-gray-950 transition-all duration-150 outline-hidden disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200'} 
            ${rightIcon ? 'pr-11' : ''} 
            ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 flex items-center pointer-events-none text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600 font-sans mt-0.5">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${id}-helper`} className="text-xs text-gray-500 font-sans mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
