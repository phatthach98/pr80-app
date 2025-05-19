import { ReactNode } from 'react';

export interface ButtonProps {
  /** Button content */
  children: ReactNode;
  /** Button variants */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Button sizes */
  size?: 'sm' | 'md' | 'lg';
  /** Is button full width */
  fullWidth?: boolean;
  /** Is button disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** onClick handler */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  ...props
}: ButtonProps) => {
  // Base button classes
  const baseClasses =
    'font-semibold border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-lg',
  };

  // Variant classes
  const variantClasses = {
    primary:
      'bg-primary-600 text-white border-primary-600 hover:bg-primary-700 focus:ring-primary-500',
    secondary:
      'bg-secondary-600 text-white border-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500',
    outline:
      'bg-transparent border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost:
      'bg-transparent border-transparent text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  };

  // Width class
  const widthClass = fullWidth ? 'w-full' : '';

  // Disabled class
  const disabledClass = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';

  return (
    <button
      type="button"
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${widthClass}
        ${disabledClass}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
