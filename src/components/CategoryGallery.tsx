import React from 'react';
import { Category } from '../types/project';

interface CategoryGalleryProps {
  categories: Category[];
  onSelect?: (id: number) => void;
}

// 🎨 Bug #10 Fix: Expanded image map to cover all real backend categories
const CATEGORY_IMAGES: Record<string, string> = {
  "Technology":         "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600",
  "Education":          "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600",
  "Healthcare":         "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600",
  "Environment":        "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600",
  "Arts & Culture":     "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600",
  "Community":          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600",
  "Food & Agriculture": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600",
  "Sports & Fitness":   "https://images.unsplash.com/photo-1461896756913-c28ee000de5a?w=600",
  "Social Impact":      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600",
  "Science & Research": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600",
  "Electronics":        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600",
  "Sports":             "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600",
};

export const CategoryGallery = ({ categories, onSelect }: CategoryGalleryProps) => {
  if (!categories || categories.length === 0) return null;

  // 🚀 Bug #9 Fix: Removed the .slice(0, 3) to allow all categories to be discovered
  const displayCategories = categories;

  return (
    <section className="mb-24">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-4xl font-black font-headline tracking-tighter">
          Browse by <span className="text-primary italic">Category</span>
        </h2>
        <span className="text-on-surface-variant text-sm font-bold uppercase tracking-widest">
           {categories.length} Destinations
        </span>
      </div>
      
      {/* Scrollable on mobile, grid on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {displayCategories.map((category) => (
          <div 
            key={category.id} 
            onClick={() => onSelect?.(category.id)}
            className="relative h-[280px] rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-ambient hover:-translate-y-2 transition-all duration-500"
          >
            <img
              src={CATEGORY_IMAGES[category.name] || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800'}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
            
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <h3 className="text-2xl font-black font-headline text-white tracking-tighter leading-tight group-hover:text-primary-container transition-colors">
                {category.name}
              </h3>
              <div className="w-0 group-hover:w-12 h-1 bg-primary-container mt-2 transition-all duration-500 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
