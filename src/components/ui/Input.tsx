import React from 'react';

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
}

export const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  className = '',
}: InputProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="font-headline text-sm font-bold text-on-surface-variant">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-3 rounded-xl outline-none transition-all duration-300
          text-on-surface placeholder:text-on-surface-variant/50
          bg-surface-container-low
          focus:bg-surface focus:ring-2 focus:ring-primary/40 focus:shadow-sm
          ${error ? 'ring-2 ring-red-500/50 bg-red-50/10' : ''}
        `}
      />

      {error && (
        <span className="text-xs font-bold text-red-500 mt-1">{error}</span>
      )}
    </div>
  );
};

export default Input;
