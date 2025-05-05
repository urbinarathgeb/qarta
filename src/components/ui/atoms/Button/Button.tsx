import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Componente de botón reutilizable con distintas variantes y tamaños
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  fullWidth,
  children,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-accent',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    danger: 'bg-red-100 text-red-700 hover:bg-red-200',
    success: 'bg-green-100 text-green-700 hover:bg-green-200',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
    icon: 'w-9 h-9 flex items-center justify-center',
  };

  return (
    <button
      className={twMerge(
        clsx(
          'rounded font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary hover:cursor-pointer',
          variantClasses[variant],
          sizeClasses[size],
          disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '',
          fullWidth ? 'w-full' : '',
          className
        )
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="inline-block w-4 h-4 mr-2 border-2 border-current rounded-full border-t-transparent animate-spin" />
      )}
      {!isLoading && leftIcon && size !== 'icon' && <span className="mr-2">{leftIcon}</span>}
      {size === 'icon' ? leftIcon || children : children}
      {!isLoading && rightIcon && size !== 'icon' && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;
