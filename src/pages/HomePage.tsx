import React, { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getHomepageData } from '../api/home';
import { getProjects } from '../api/projects';
import { ProjectCard } from '../components/ProjectCard';
import { LoadingState, ErrorState } from '../components/ui';
import { SearchBar } from '../components/ui/SearchBar';
import { FeaturedHero } from '../components/FeaturedHero';
import { CategoryGallery } from '../components/CategoryGallery';
import { FilterChips } from '../components/ui/FilterChips';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 🌏 URL-Driven Discovery State
  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('c') ? Number(searchParams.get('c')) : null;

  const {
    data: homeData,
    isLoading: homeLoading,
    isError: homeError,
  } = useQuery({
    queryKey: ['homepage'],
    queryFn: getHomepageData,
  });

  const isFiltering = searchQuery.length > 0 || selectedCategory !== null;

  const { 
    data: searchResults, 
    isLoading: searchLoading, 
    isError: searchError 
  } = useQuery({
    queryKey: ['projects', 'search', searchQuery, selectedCategory],
    queryFn: () => getProjects(searchQuery, selectedCategory),
    enabled: isFiltering,
  });

  const handleSearch = useCallback((query: string) => {
    setSearchParams((prev) => {
      if (query) prev.set('q', query);
      else prev.delete('q');
      return prev;
    });
  }, [setSearchParams]);

  const handleCategorySelect = useCallback((id: number | null) => {
    setSearchParams((prev) => {
      if (id) {
        prev.set('c', id.toString());
      } else {
        prev.delete('c');
      }
      return prev;
    });
  }, [setSearchParams]);

  const activeCategoryName = useMemo(() => {
    return selectedCategory 
      ? homeData?.categories?.find(c => c.id === selectedCategory)?.name 
      : null;
  }, [selectedCategory, homeData?.categories]);

  if (homeLoading) return <LoadingState fullPage />;
  if (homeError) return <ErrorState onRetry={() => window.location.reload()} />;

  // 🏗️ Discovery Logic: Use search results if filtering, otherwise show latest
  const displayProjects = isFiltering ? (searchResults?.results || []) : (homeData?.latest || []);
  const displayTitle = isFiltering 
    ? (activeCategoryName || `Results for "${searchQuery}"`)
    : "Latest Opportunities";

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 pb-32 overflow-hidden">
      {/* 🚀 Hero Section (Always Visible) */}
      <div className="animate-in fade-in duration-700">
        <FeaturedHero projects={homeData?.featured || []} />
        <CategoryGallery 
          categories={homeData?.categories || []} 
          onSelect={handleCategorySelect} 
        />
      </div>

      {/* 🔍 Discovery & Exploration Section */}
      <section className="mt-12 space-y-16">
        {/* 🏆 Featured / Top Rated Section (Only visible when NOT filtering to avoid clutter) */}
        {!isFiltering && homeData?.top_rated && homeData.top_rated.length > 0 && (
          <section className="px-4 pb-12 animate-in fade-in duration-700 delay-500">
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

        {/* Search Bar & Title */}
        <div className="text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter leading-tight italic">
             {isFiltering ? "Discover Your Impact" : "Explore Egyptian Innovations"}
          </h2>
          <SearchBar value={searchQuery} onSearch={handleSearch} />
        </div>

        {/* Dynamic Discovery Grid (Unified "Latest" + Search) */}
        <section className="bg-surface-container-low -mx-4 md:-mx-8 px-4 md:px-8 py-20 rounded-[4rem] transition-all duration-700 min-h-[600px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-6">
               <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tighter">
                {searchLoading ? 'Searching Oasis...' : displayTitle}
              </h2>
              {isFiltering && (
                 <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                   Filtered
                 </span>
              )}
            </div>
            <div className="hidden md:block h-px flex-1 bg-outline-variant/20 mx-10" />
            <span className="text-primary font-bold">
              {isFiltering ? `${displayProjects.length} Matches` : "New Initiatives"}
            </span>
          </div>

          {/* Active Chips Integration */}
          <FilterChips 
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            categories={homeData?.categories || []}
            onClearSearch={() => handleSearch('')}
            onClearCategory={() => handleCategorySelect(null)}
          />

          {/* Results Grid / Loading State / Error State */}
          {searchLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-surface-container-high/50 rounded-[2.5rem] skeleton" />
                ))}
            </div>
          ) : searchError ? (
            <ErrorState title="Search Failed" message="The water is low. Check your connection to the Oasis." onRetry={() => window.location.reload()} />
          ) : displayProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {displayProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
             /* Empty State Handle */
             <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 animate-in zoom-in-95 duration-500">
                <div className="w-32 h-32 bg-surface-container-high rounded-full flex items-center justify-center text-6xl shadow-inner">🏜️</div>
                <div className="space-y-4">
                   <h3 className="text-3xl font-bold font-headline tracking-tight">No Oasis Found</h3>
                   <p className="text-on-surface-variant max-w-md mx-auto leading-relaxed">
                     We couldn't find any projects matching your criteria. Try widening your search or exploring another category.
                   </p>
                </div>
                <button 
                  onClick={() => { handleSearch(''); handleCategorySelect(null); }}
                  className="signature-gradient text-on-primary px-10 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition-transform"
                >
                  Clear All Filters
                </button>
              </div>
          )}
        </section>
      </section>
    </div>
  );
};

export default HomePage;
