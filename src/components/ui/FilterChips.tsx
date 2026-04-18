import React from 'react';
import { X } from 'lucide-react';
import { Category } from '../../types/project';

interface FilterChipsProps {
  searchQuery: string;
  selectedCategory: number | null;
  categories: Category[];
  onClearSearch: () => void;
  onClearCategory: () => void;
}

export const FilterChips = ({
  searchQuery,
  selectedCategory,
  categories,
  onClearSearch,
  onClearCategory,
}: FilterChipsProps) => {
  const activeCategoryName = selectedCategory
    ? categories.find((c) => c.id === selectedCategory)?.name
    : null;

  if (!searchQuery && !selectedCategory) return null;

  return (
    <div className="flex flex-wrap gap-3 mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
      {searchQuery && (
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold border border-primary/20">
          <span>Search: <span className="italic">"{searchQuery}"</span></span>
          <button
            onClick={onClearSearch}
            className="hover:bg-primary/20 p-1 rounded-full transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {selectedCategory && activeCategoryName && (
        <div className="flex items-center gap-2 bg-tertiary/10 text-tertiary px-4 py-2 rounded-full text-sm font-bold border border-tertiary/20">
          <span>Category: {activeCategoryName}</span>
          <button
            onClick={onClearCategory}
            className="hover:bg-tertiary/20 p-1 rounded-full transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
      
      {(searchQuery || selectedCategory) && (
         <button 
           onClick={() => { onClearSearch(); onClearCategory(); }}
           className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors hover:underline underline-offset-4 px-2"
         >
           Clear All
         </button>
      )}
    </div>
  );
};
