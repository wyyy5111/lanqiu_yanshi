import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'input-glass flex h-11 w-full rounded-[var(--radius-md)] px-4 text-sm text-[var(--text-1)] shadow-none placeholder:text-[var(--text-3)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-[var(--duration-fast)]',
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
