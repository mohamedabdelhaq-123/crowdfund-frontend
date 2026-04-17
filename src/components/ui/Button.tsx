import React from 'react';
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
  isLoading?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

const variantStyles = {
  primary:
    'signature-gradient text-on-primary rounded-full hover:shadow-ambient hover:scale-[1.02] active:scale-95',
  secondary:
    'bg-surface-container-highest text-primary rounded-full hover:bg-surface-container-high',
  tertiary:
    'bg-transparent text-primary hover:underline underline-offset-8 !px-0',
};

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  isLoading = false,
  type = 'button',
  className = '',
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        px-8 py-3 font-headline font-bold transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};
