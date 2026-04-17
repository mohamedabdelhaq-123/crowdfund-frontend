import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getHomepageData } from '../api/home';
import { ProjectCard } from '../components/ProjectCard';
import { LoadingState, ErrorState } from '../components/ui';

const HomePage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['homepage'],
    queryFn: getHomepageData,
  });

  if (isLoading) return <LoadingState fullPage />;

  if (isError) {
    return (
      <ErrorState
        message="We couldn't fetch the latest projects from our servers."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-16 space-y-24">
      {data?.featured && data.featured.length > 0 && (
        <section>
          <div className="mb-12">
            <span className="text-primary font-headline font-bold tracking-[0.2em] uppercase text-xs">
              Editor's Choice
            </span>
            <h2 className="text-5xl font-black font-headline tracking-tighter mt-4">
              Featured Campaigns
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {data.featured.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {data?.top_rated && data.top_rated.length > 0 && (
        <section>
          <div className="mb-12">
            <h2 className="text-4xl font-black font-headline tracking-tighter">
              Top Rated Impact
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {data.top_rated.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {data?.latest && data.latest.length > 0 && (
        <section className="bg-surface-container-low -mx-4 md:-mx-8 px-4 md:px-8 py-20 rounded-[3rem]">
          <div className="mb-12">
            <h2 className="text-4xl font-black font-headline tracking-tighter">
              Latest Opportunities
            </h2>
            <p className="text-on-surface-variant mt-2 max-w-md font-body">
              Be the first to fuel these community-led visions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {data.latest.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
