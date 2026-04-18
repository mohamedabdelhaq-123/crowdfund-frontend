import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  onSearch,
  placeholder = 'Search projects...',
}: SearchBarProps) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant/50">
        <Search size={20} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-4 bg-surface-container-low rounded-2xl outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all font-body text-on-surface shadow-sm"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute inset-y-0 right-4 flex items-center text-on-surface-variant/50 hover:text-primary transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};
