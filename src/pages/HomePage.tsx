import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { getHomepageData } from '../api/home';
import { getProjects } from '../api/projects';
import { ProjectCard } from '../components/ProjectCard';
import { LoadingState, ErrorState } from '../components/ui';
import { SearchBar } from '../components/ui/SearchBar';
import { CategoryPills } from '../components/ui/CategoryPills';

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

  if (homeLoading) return <LoadingState fullPage />;
  if (homeError) return <ErrorState onRetry={() => window.location.reload()} />;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-12 space-y-16 overflow-hidden">
      <section className="text-center space-y-8 py-10">
        <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter leading-tight">
          Empower the next <br />{' '}
          <span className="text-primary italic">Egyptian</span> success story.
        </h1>
        <SearchBar onSearch={setSearchQuery} />
        <div className="max-w-4xl mx-auto pt-4">
          <CategoryPills
            categories={homeData?.categories || []}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </section>

      {isFiltering ? (
        <section className="min-h-[50vh]">
          <h2 className="text-3xl font-black font-headline tracking-tighter mb-10">
            {searchLoading
              ? 'Searching...'
              : `Results for "${searchQuery || 'Category'}"`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {searchResults?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      ) : (
        <div className="space-y-24">
          {homeData?.featured && homeData.featured.length > 0 && (
            <section className="relative w-full">
              <h2 className="text-4xl font-black font-headline tracking-tighter mb-10">
                Featured Campaigns
              </h2>

              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={40}
                slidesPerView={1}
                breakpoints={{
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                className="pb-16 !px-2"
              >
                {homeData.featured.map((p) => (
                  <SwiperSlide key={p.id} className="h-auto">
                    <ProjectCard project={p} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </section>
          )}

          {homeData?.latest && homeData.latest.length > 0 && (
            <section className="bg-surface-container-low -mx-4 md:-mx-8 px-4 md:px-8 py-20 rounded-[3rem]">
              <h2 className="text-4xl font-black font-headline tracking-tighter mb-10">
                Latest Opportunities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {homeData.latest.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
