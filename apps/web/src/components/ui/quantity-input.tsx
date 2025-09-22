import React from 'react';
import { cn } from '@/tailwind/utils';
import { MinusIcon, PlusIcon } from 'lucide-react';

export interface QuantityInputProps {
  /** Current quantity value */
  value: number;
  /** Callback when quantity changes */
  onChange: (value: number) => void;
  /** Minimum allowed quantity (default: 0) */
  min?: number;
  /** Maximum allowed quantity (default: Infinity) */
  max?: number;
  /** Step value for increment/decrement (default: 1) */
  step?: number;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Additional CSS class for the container */
  className?: string;
  /** CSS class for the buttons */
  buttonClassName?: string;
  /** CSS class for the value display */
  valueClassName?: string;
  /** Size variant (default: 'md') */
  size?: 'sm' | 'md' | 'lg';
}

export function QuantityInput({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  disabled = false,
  className,
  buttonClassName,
  valueClassName,
  size = 'md',
}: QuantityInputProps) {
  const handleIncrement = () => {
    if (value + step <= max) {
      onChange(value + step);
    }
  };

  const handleDecrement = () => {
    if (value - step >= min) {
      onChange(value - step);
    }
  };

  // Size-specific classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          button: 'h-6 w-6',
          icon: 'h-3 w-3',
          value: 'w-5 text-sm',
        };
      case 'lg':
        return {
          button: 'h-12 w-12',
          icon: 'h-6 w-6',
          value: 'w-8 text-xl',
        };
      case 'md':
      default:
        return {
          button: 'h-8 w-8',
          icon: 'h-4 w-4',
          value: 'w-6 text-base',
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className={cn(
          'flex items-center justify-center rounded-full bg-gray-200 transition-colors',
          'hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2',
          disabled && 'cursor-not-allowed opacity-50 hover:bg-gray-200',
          value <= min && 'opacity-50',
          sizeClasses.button,
          buttonClassName
        )}
        aria-label="Decrease quantity"
      >
        <MinusIcon className={sizeClasses.icon} />
      </button>

      <span className={cn('text-center', sizeClasses.value, valueClassName)}>
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className={cn(
          'flex items-center justify-center rounded-full bg-gray-200 transition-colors',
          'hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2',
          disabled && 'cursor-not-allowed opacity-50 hover:bg-gray-200',
          value >= max && 'opacity-50',
          sizeClasses.button,
          buttonClassName
        )}
        aria-label="Increase quantity"
      >
        <PlusIcon className={sizeClasses.icon} />
      </button>
    </div>
  );
}
