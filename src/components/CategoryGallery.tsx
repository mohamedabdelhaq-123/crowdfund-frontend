import React from 'react';
import { Category } from '../types/project';

interface CategoryGalleryProps {
  categories: Category[];
  onSelect?: (id: number) => void;
}

const CATEGORY_IMAGES: Record<string, string> = {
  Electronics: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=600',
  Sports: 'https://images.unsplash.com/photo-1461896756913-c28ee000de5a?q=80&w=600',
  Education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600',
  Technology: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600',
  'Social Impact': 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=600',
};

export const CategoryGallery = ({ categories, onSelect }: CategoryGalleryProps) => {
  if (!categories || categories.length === 0) return null;

  // Show only the first 3 categories to match the premium design grid
  const displayCategories = categories.slice(0, 3);

  return (
    <section className="mb-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayCategories.map((category) => (
          <div 
            key={category.id} 
            onClick={() => onSelect?.(category.id)}
            className="relative h-[320px] rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-ambient hover:-translate-y-2 transition-all duration-500"
          >
            <img
              src={CATEGORY_IMAGES[category.name] || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=600'}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-10 left-10 text-white">
              <h3 className="text-3xl font-black font-headline tracking-tighter leading-tight group-hover:text-primary-container transition-colors">
                {category.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
