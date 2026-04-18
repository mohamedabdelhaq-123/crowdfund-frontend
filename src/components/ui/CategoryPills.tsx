import { Category } from '../../types/project';

interface CategoryPillsProps {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export const CategoryPills = ({
  categories,
  selectedId,
  onSelect,
}: CategoryPillsProps) => {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
      <button
        onClick={() => onSelect(null)}
        className={`px-6 py-2 rounded-full text-sm font-headline font-bold transition-all whitespace-nowrap ${
          selectedId === null
            ? 'signature-gradient text-on-primary shadow-lg shadow-primary/20'
            : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
        }`}
      >
        All Projects
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`px-6 py-2 rounded-full text-sm font-headline font-bold transition-all whitespace-nowrap ${
            selectedId === category.id
              ? 'signature-gradient text-on-primary shadow-lg shadow-primary/20'
              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};
