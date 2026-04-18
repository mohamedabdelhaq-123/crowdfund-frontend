import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ProjectItem } from '../../types/profile';

const ITEMS_PER_PAGE = 6;

export default function MyProjectsTab({ projects, isPublicView }: { projects: ProjectItem[] | undefined, isPublicView?: boolean }) {
  const [currentPage, setCurrentPage] = useState(1);

  const safeProjects = projects || [];
  
  const totalPages = Math.ceil(safeProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = safeProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProjects.map((project) => {
          const progress = Math.min((project.current_money / project.target) * 100, 100);
          return (
            <div key={project.id} className="bg-surface-container-lowest rounded-3xl p-6 transition-all hover:translate-y-[-4px] hover:shadow-[0_40px_40px_rgba(47,46,46,0.06)] flex flex-col h-[480px]">
              <div className="h-48 w-full rounded-2xl overflow-hidden mb-6 bg-surface-container-low">
                {project.images_urls && project.images_urls.length > 0 ? (
                  <img 
                    src={project.images_urls[0].path} 
                    alt={project.title} 
                    className="h-full w-full object-cover" 
                    onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width%3D"100%25" height%3D"100%25"%3E%3Crect width%3D"100%25" height%3D"100%25" fill%3D"%23f0f0f0"%2F%3E%3Ctext x%3D"50%25" y%3D"50%25" fill%3D"%239e9e9e" font-family%3D"sans-serif" font-size%3D"16" font-weight%3D"bold" text-anchor%3D"middle" dy%3D".3em"%3EImage Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E'; }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-outline-variant">
                    <span className="material-symbols-outlined text-5xl">image</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-headline font-bold tracking-widest text-primary uppercase mb-2 block">{project.status}</span>
                <h3 className="text-xl font-headline font-bold text-on-surface leading-snug mb-3">{project.title}</h3>
                <p className="text-on-surface-variant text-sm line-clamp-3 mb-6">{project.details}</p>
              </div>
              <div className="mt-auto">
                <div className="w-full h-2 bg-secondary-container rounded-full overflow-hidden mb-3">
                  <div className="h-full signature-gradient" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-headline font-extrabold text-on-surface">{project.current_money.toLocaleString()} EGP</p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-headline">Raised of {project.target.toLocaleString()}</p>
                  </div>
                  <span className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-xs font-bold font-headline">{Math.round(progress)}%</span>
                </div>
              </div>
              {isPublicView && (
                <Link to={`/projects/${project.id}`} className="mt-6 text-center py-3 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors rounded-xl font-headline font-bold text-sm">
                  View & Donate
                </Link>
              )}
            </div>
          );
        })}

        {!isPublicView && currentPage === 1 && (
          <Link to="/projects/create" className="border-2 border-dashed border-outline-variant/30 rounded-3xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white transition-all h-[480px]">
            <div className="h-20 w-20 rounded-full bg-surface-container flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl text-outline-variant">add_circle</span>
            </div>
            <h3 className="text-xl font-headline font-bold text-on-surface mb-2">New Impact</h3>
            <p className="text-on-surface-variant text-sm max-w-[200px]">Launch a new crowdfunding campaign and change lives.</p>
          </Link>
        )}

        {safeProjects.length === 0 && (
          <div className="col-span-full py-16 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-5xl text-outline-variant">folder_open</span>
            </div>
            <h3 className="text-xl font-bold font-headline text-on-surface mb-2">{isPublicView ? "No active campaigns" : "No projects yet"}</h3>
            <p className="text-on-surface-variant max-w-sm">{isPublicView ? "This user hasn't launched any public campaigns yet." : "Start creating impactful projects today."}</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <span className="font-headline font-bold text-on-surface-variant text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}
