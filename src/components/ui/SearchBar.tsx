import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onSearch,
  placeholder = 'Search projects...',
}: SearchBarProps) => {
  // Local state for immediate UI feedback while typing
  const [inputValue, setInputValue] = useState(value);

  // Sync internal input when parent value changes (e.g., on "Clear Filters" or URL change)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    // 🚦 Bug #8 Fix: Don't fire requests for meaningless single characters (needs at least 2)
    if (inputValue.length > 0 && inputValue.length < 2) return;

    const timer = setTimeout(() => {
      if (inputValue !== value) {
        onSearch(inputValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, onSearch, value]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant/50">
        <Search size={20} />
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-4 bg-surface-container-low rounded-2xl outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all font-body text-on-surface shadow-sm"
      />
      {inputValue && (
        <button
          onClick={() => {
            setInputValue('');
            onSearch('');
          }}
          className="absolute inset-y-0 right-4 flex items-center text-on-surface-variant/50 hover:text-primary transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};
