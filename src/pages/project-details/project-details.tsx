import { getProjectDetails } from "../../api/projects-details";
import { useState } from "react";
import { useParams,useNavigate } from 'react-router-dom';
import { LoadingState } from "../../components/ui/LoadingState";
import { useQuery } from '@tanstack/react-query';
import { ErrorState } from "../../components/ui/ErrorState";
import { ProjectImage } from "../../types/project-details";
import { SimilarProjects } from "../../components/SimilarProjects";
import { ProjectCommentsSection } from "../../components/ProjectCommentsSection";

export const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image_carousel_index, setImageCarouselIndex] = useState(0);
  const { data: projectData, isLoading: projectLoading, isError, error: projectError } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProjectDetails(id ? parseInt(id) : 39),
  });

  if (projectLoading) return <LoadingState fullPage />;
  if (isError) return <ErrorState onRetry={() => window.location.reload()} />;

  const stars = Math.round(projectData?.avg_rate || 1);
  const elements = [];
  for (let i = 0; i < 5; i++) {
    elements.push(
      <span key={i} className={i < stars ? "text-tertiary" : "text-surface-container-highest"}>
        ★
      </span>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 bg-surface">
      {/* Header Section */}
      <div className="mb-6">
        <span className="inline-block bg-primary-container text-on-primary-fixed text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider mb-3">
          {projectData?.category_name}
        </span>
        <h1 className="text-4xl font-headline font-bold text-on-surface mb-2">
          {projectData?.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-outline-variant">
          <div className="flex text-lg">{elements}</div>
         
          
        </div>
      </div>

      {/* Main Image Gallery */}
      <div className="relative w-full h-[500px] rounded-xl overflow-hidden mb-12 shadow-ambient bg-surface-container-highest">
  {projectData?.images_urls?.map((image: ProjectImage, index: number) => (
    <img
      key={image.id}
      src={image.path}
      alt={`Project ${index}`}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-0 ${
        index === image_carousel_index ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    />
  ))}

  {/* Pagination Bullets */}
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 px-4 py-2 glass-panel rounded-full">
    {projectData?.images_urls?.map((_, i) => (
      <button
        key={i}
        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
          i === image_carousel_index 
            ? "bg-primary w-6" 
            : "bg-white/60 hover:bg-white"
        }`}
        onClick={() => setImageCarouselIndex(i)}
      />
    ))}
  </div>
</div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Details & Comments */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-headline font-bold mb-4">Empowering the Heart of Egypt</h2>
            <div className="prose prose-neutral text-on-surface leading-relaxed space-y-4">
              <p>{projectData?.details}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-8">
              {projectData?.tags_names.map((tag: string) => (
                <span key={tag} className="bg-surface-container-high px-4 py-1 rounded-full text-sm font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </section>

          <ProjectCommentsSection projectId={projectData?.id} />
        </div>

        {/* Right Column: Donation Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-surface-container-lowest p-8 rounded-xl shadow-ambient border border-outline-variant/20">
            <div className="mb-6">
              <h3 className="text-3xl font-headline font-bold text-on-surface">
                EGP {projectData?.current_money?.toLocaleString()}
              </h3>
              <p className="text-outline-variant text-sm">raised of EGP {projectData?.target?.toLocaleString()} target</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-secondary-container rounded-full mb-2">
              <div 
                className="h-full signature-gradient rounded-full" 
                style={{ width: `${Math.min((projectData?.current_money / projectData?.target) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm font-bold mb-8">
              <span>{Math.round((projectData?.current_money / projectData?.target) * 100)}% FUNDED</span>
           
            </div>

            <button  onClick ={()=>navigate(`/projects/${projectData?.id}/donate`)} className="w-full signature-gradient text-white font-bold py-4 rounded-md shadow-lg hover:opacity-90 transition-opacity mb-8">
              Donate Now
            </button>

            <div className="space-y-4 border-t border-outline-variant/20 pt-6 text-sm">
              <div className="flex justify-between">
              </div>
              <div className="flex justify-between">
                <span className="text-outline-variant">Started</span>
                <span className="font-bold">{projectData?.start_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline-variant">Ends</span>
                <span className="font-bold">{projectData?.end_date}</span>
              </div>
            </div>

            {/* Creator Card */}
            <div className="mt-10 bg-surface-container-low p-4 rounded-md flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-full overflow-hidden">
                <img src="https://via.placeholder.com/150" alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs text-outline-variant uppercase font-bold">Creator</p>
                <p className="font-bold text-on-surface">{projectData?.user_fullname}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 border-t border-outline-variant/20 pt-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-headline font-bold">Similar Projects</h2>
          <button className="text-primary font-bold">Explore All</button>
        </div>
        <SimilarProjects projectId={projectData?.id} />
      </div>
    </div>
  );
};