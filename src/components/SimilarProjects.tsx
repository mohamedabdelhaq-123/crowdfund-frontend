
import { useQuery } from '@tanstack/react-query';
import { getSimilarProjects } from '../api/projects';
import { ProjectCard } from './ProjectCard';
import { LoadingState } from './ui';

interface SimilarProjectsProps {
  projectId: number;
}

export const SimilarProjects = ({ projectId }: SimilarProjectsProps) => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', projectId, 'similar'],
    queryFn: () => getSimilarProjects(projectId),
  });

  if (isLoading) return <LoadingState />;

  if (!projects || projects.length === 0) return null;

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-black font-headline tracking-tighter">
        Similar Projects
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};
