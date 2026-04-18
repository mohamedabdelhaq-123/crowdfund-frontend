import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ProjectItem } from '../../types/profile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelProject } from '../../api/projects-details';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 6;

export default function MyProjectsTab({ projects, isPublicView }: { projects: ProjectItem[] | undefined, isPublicView?: boolean }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [projectToCancel, setProjectToCancel] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: cancelProject,
    onSuccess: () => {
      toast.success('Project cancelled successfully.');
      queryClient.invalidateQueries({ queryKey: ['myProjects'] });
      setProjectToCancel(null);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.error || 'Failed to cancel project.';
      toast.error(msg);
      setProjectToCancel(null);
    }
  });

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
              <div className="mt-6 flex gap-2">
                <Link to={`/projects/${project.id}`} className="flex-1 px-2 text-center py-3 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors rounded-xl font-headline font-bold text-sm">
                  {isPublicView ? 'View & Donate' : 'View Details'}
                </Link>
                {!isPublicView && project.status !== 'cancelled' && (
                  <button 
                    onClick={() => setProjectToCancel(project.id)}
                    className="px-4 py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors rounded-xl font-headline font-bold text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {!isPublicView && currentPage === 1 && (
          <Link to="/start-a-project" className="border-2 border-dashed border-outline-variant/30 rounded-3xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white transition-all h-[480px]">
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

      {/* Cancel Confirmation Modal */}
      {projectToCancel !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-in text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-6 mx-auto border-4 border-red-100">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <h3 className="text-2xl font-black font-headline text-on-surface mb-3">Cancel Campaign?</h3>
            <p className="text-on-surface-variant mb-10 text-sm max-w-[280px] mx-auto leading-relaxed">
              Are you completely sure? This action cannot be undone and will permanently halt this project.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setProjectToCancel(null)}
                className="flex-1 py-4 rounded-xl font-bold font-headline hover:bg-surface-container-high transition-colors border-2 border-transparent text-on-surface-variant"
              >
                Keep it
              </button>
              <button
                onClick={() => cancelMutation.mutate(projectToCancel)}
                disabled={cancelMutation.isPending}
                className="flex-1 py-4 rounded-xl bg-red-600 text-white font-bold font-headline hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
