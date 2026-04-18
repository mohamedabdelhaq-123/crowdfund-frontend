import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { FeaturedHero } from '../components/FeaturedHero';
import { CategoryGallery } from '../components/CategoryGallery';
import { getHomepageData } from '../api/home';
import { getProjects } from '../api/projects';
import { ProjectCard } from '../components/ProjectCard';
import { LoadingState, ErrorState } from '../components/ui';
import { SearchBar } from '../components/ui/SearchBar';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const {
    data: homeData,
    isLoading: homeLoading,
    isError: homeError,
  } = useQuery({
    queryKey: ['homepage'],
    queryFn: getHomepageData,
  });

  const isFiltering = searchQuery.length > 0 || selectedCategory !== null;

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['projects', 'search', searchQuery, selectedCategory],
    queryFn: () => getProjects(searchQuery, selectedCategory),
    enabled: isFiltering,
  });

  const activeCategoryName = selectedCategory 
    ? homeData?.categories?.find(c => c.id === selectedCategory)?.name 
    : null;

  if (homeLoading) return <LoadingState fullPage />;
  if (homeError) return <ErrorState onRetry={() => window.location.reload()} />;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 pb-32 overflow-hidden">
      {/* 🚀 Hero Section (Design Reference Match) */}
      {!isFiltering && (
        <>
          <FeaturedHero projects={homeData?.featured || []} />
          <CategoryGallery 
            categories={homeData?.categories || []} 
            onSelect={setSelectedCategory} 
          />
        </>
      )}

      {/* 🔍 Exploration & Discovery */}
      <section className={`transition-all duration-700 ${isFiltering ? 'mt-12' : 'mt-0'}`}>
        {!isFiltering && (
          <div className="text-center space-y-8 mb-16">
            <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tighter leading-tight">
              Explore <span className="text-primary italic">Egyptian</span> innovations
            </h2>
            <SearchBar onSearch={setSearchQuery} />
          </div>
        )}

        {isFiltering ? (
          <section className="min-h-[50vh]">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tighter">
                {searchLoading
                  ? 'Searching...'
                  : `Results for "${activeCategoryName || searchQuery || 'Projects'}"`}
              </h2>
              <button 
                onClick={() => {setSearchQuery(''); setSelectedCategory(null);}}
                className="text-primary font-bold hover:underline underline-offset-4"
              >
                Clear Filters
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {searchResults?.results?.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {!searchLoading && (!searchResults?.results || searchResults.results.length === 0) && (
              <ErrorState 
                title="No Oasis Found" 
                message="We couldn't find any projects matching your search." 
                showHome={false} 
              />
            )}
          </section>
        ) : (
          <div className="space-y-32">
            {/* 🆕 Latest Section */}
            {homeData?.latest && homeData.latest.length > 0 && (
              <section className="bg-surface-container-low -mx-4 md:-mx-8 px-4 md:px-8 py-20 rounded-[4rem]">
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tighter">
                    Latest Opportunities
                  </h2>
                  <div className="hidden md:block h-px flex-1 bg-outline-variant/20 mx-10" />
                  <span className="text-primary font-bold">New Initiatives</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {homeData.latest.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </section>
            )}

            {/* 🔥 Top Rated Section */}
            {homeData?.top_rated && homeData.top_rated.length > 0 && (
              <section className="px-4">
                <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tighter mb-12">
                  Top Rated Impacts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {homeData.top_rated.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
