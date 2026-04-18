import { Project } from '../types/project';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const progressPercent = Math.min(
    (project.current_money / project.target) * 100,
    100
  );

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden editorial-shadow group flex flex-col h-full hover:-translate-y-2 transition-transform duration-500 cursor-pointer">
      <div className="relative h-64 overflow-hidden bg-surface-container-low">
        <img
          src={project.uploaded_image_url}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://via.placeholder.com/400x300?text=OasisFund';
          }}
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
          {project.category_name}
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-2xl font-bold font-headline mb-4 group-hover:text-primary transition-colors line-clamp-2">
          {project.title}
        </h3>

        <p className="text-on-surface-variant text-sm leading-relaxed mb-8 flex-1 line-clamp-3">
          {project.details}
        </p>

        <div className="space-y-4 mb-6">
          <div className="w-full bg-secondary-container h-2 rounded-full overflow-hidden">
            <div
              className="signature-gradient h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-sm">
            <div className="flex flex-col">
              <span className="text-xs font-label uppercase text-on-surface-variant">
                Raised
              </span>
              <span className="font-bold text-lg text-primary">
                {project.current_money.toLocaleString()} EGP
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-label uppercase text-on-surface-variant">
                Target
              </span>
              <span className="font-bold text-lg">
                {project.target.toLocaleString()} EGP
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-surface-container-low flex justify-between items-center mt-auto">
          <div className="flex items-center gap-1 text-tertiary font-bold text-sm">
            ⭐ {project.calculate_average_rating.toFixed(1)}
          </div>
          <span className="text-xs text-on-surface-variant font-label uppercase">
            By{' '}
            <span className="font-bold text-on-surface">
              {project.user_fullname}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
