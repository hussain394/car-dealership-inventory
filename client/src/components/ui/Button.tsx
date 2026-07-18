import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

const variantClasses = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800 disabled:bg-slate-300',
  secondary: 'bg-white text-slate-900 border border-slate-300 hover:bg-slate-50',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-200',
};

export const Button = ({
  variant = 'primary',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...rest
}: ButtonProps) => (
  <button
    disabled={disabled || isLoading}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
    {...rest}
  >
    {isLoading ? 'Please wait…' : children}
  </button>
);
