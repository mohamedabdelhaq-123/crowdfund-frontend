import React from 'react';

interface InputProps {
  label: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  className = '',
  disabled = false,
}: InputProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="font-headline text-[10px] font-bold tracking-widest text-on-surface-variant uppercase ml-2">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-4 py-4 rounded-2xl outline-none border-none transition-all duration-300
          text-on-surface placeholder:text-on-surface-variant/50
          bg-surface-container-low font-body
          focus:bg-surface focus:ring-2 focus:ring-primary/40 focus:shadow-sm
          ${disabled ? 'cursor-not-allowed text-on-surface-variant' : ''}
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
