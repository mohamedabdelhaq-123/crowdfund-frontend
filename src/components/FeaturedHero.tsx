import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { Project } from '../types/project';
import { Button } from './ui/Button';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface FeaturedHeroProps {
  projects: Project[];
}

export const FeaturedHero = ({ projects }: FeaturedHeroProps) => {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="relative w-full h-[500px] md:h-[650px] rounded-[3rem] overflow-hidden shadow-ambient mb-16">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="h-full w-full"
      >
        {projects.map((project) => (
          <SwiperSlide key={project.id}>
            <div className="relative w-full h-full flex items-center">
              {/* Background with overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={project.uploaded_image_url || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200'}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200'
                  }}
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>

              {/* Content */}
              <div className="relative z-10 max-w-4xl px-8 md:px-20 text-white space-y-4 md:space-y-6">
                <span className="bg-primary/90 backdrop-blur px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white inline-block">
                  Featured Project
                </span>
                
                <h2 className="text-4xl md:text-7xl font-black font-headline leading-tight tracking-tighter">
                  {project.title}
                </h2>
                
                <p className="text-lg md:text-xl text-white/90 max-w-2xl font-body leading-relaxed line-clamp-3">
                  {project.details}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button variant="primary" className="px-10 py-4 text-lg">
                    Support This Project
                  </Button>
                  <Button variant="secondary" className="bg-white/10 backdrop-blur text-white border border-white/20 hover:bg-white/20 px-10 py-4 text-lg">
                    Read Story
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
