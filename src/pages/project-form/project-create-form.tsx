import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, ProjectFormData } from '../../validation/projectSchema';
import { createProject } from '../../api/projects-details';
import {getCategories} from '../../api/category';
import { useQuery } from '@tanstack/react-query';
import { LoadingState } from '../../components/ui';
import { Category } from '../../types/project';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export const ProjectCreatePage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const navigate = useNavigate();
  const { data: categoriesData, isLoading: categoriesLoading, isError, error: projectError } = useQuery({
      queryKey: ['categories'],
      queryFn: () => getCategories(),
    });
  if (categoriesLoading) return <LoadingState fullPage />;
  const onSubmit = async (data: ProjectFormData) => {
     console.log('Form submitted:', data); // 👈 check if this even fires
  console.log('Form errors:', errors);  // 👈 check if validation is blocking
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('details', data.details);
    formData.append('target', String(data.target));
    formData.append('start_date', data.start_date);
    formData.append('end_date', data.end_date);
    formData.append('category', String(data.category));
  
    data.tags?.split(',')
    .map(t => t.trim())
    .filter(Boolean)
    .forEach(tag => formData.append('tags', tag));
    imageFiles.forEach(img => formData.append('images', img));
    console.log('Prepared FormData:', formData); // 👈 check FormData contents before sending
    try {
      const res = await createProject(formData);
      toast.success("Project created successfully!");
      if (res && res.id) {
        navigate(`/projects/${res.id}`);
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error("Failed to create project.");
    }
  };

  const inputClass = (error: any) => `
    w-full px-4 py-3 rounded-md bg-surface-container-low border transition-all focus:outline-none
    ${error ? 'border-red-500' : 'border-outline-variant/30 focus:border-primary'}
  `;
  const onError = (errors: any) => {
  console.log('validation errors:', errors);
};

  return (
    <div className="min-h-screen bg-surface py-12 px-6">
      <div className="max-w-3xl mx-auto bg-surface-container-lowest rounded-xl shadow-ambient p-10 border border-outline-variant/10">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-headline font-bold text-on-surface">Launch a Project</h1>
          <p className="text-outline-variant mt-2">Share your mission with the OasisFund community</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8">

          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-on-surface">Project Title</label>
              <input {...register('title')} className={inputClass(errors.title)} placeholder="e.g. Solar Pumping for Nile Farmers" />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-on-surface">Category</label>
              <select
                {...register('category', { valueAsNumber: true })}
                className={inputClass(errors.category)}
                defaultValue=""
              >
                <option value="" disabled>Select a category</option>
                {categoriesData?.results?.map((cat: Category) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
            </div>

          </div>

          {/* Details */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-on-surface">Project Details</label>
            <textarea {...register('details')} rows={5} className={inputClass(errors.details)} placeholder="Describe the impact of your project..." />
            {errors.details && <p className="text-red-500 text-xs">{errors.details.message}</p>}
          </div>

          {/* Funding & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-on-surface">Target (EGP)</label>
              <input type="number" {...register('target', { valueAsNumber: true })} className={inputClass(errors.target)} placeholder="2000000" />
              {errors.target && <p className="text-red-500 text-xs">{errors.target.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-on-surface">Start Date</label>
              <input type="date" {...register('start_date')} className={inputClass(errors.start_date)} />
              {errors.start_date && <p className="text-red-500 text-xs">{errors.start_date.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-on-surface">End Date</label>
              <input type="date" {...register('end_date')} className={inputClass(errors.end_date)} />
              {errors.end_date && <p className="text-red-500 text-xs">{errors.end_date.message}</p>}
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-on-surface">Tags</label>
              <input
                type="text"
                {...register('tags')}
                className={inputClass(false)}
                placeholder="e.g. water, solar, egypt"
              />
              <p className="text-xs text-outline-variant">Separate tags with commas</p>
          </div>
          {/* Media Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-on-surface">Project Gallery</label>
            <div className="border-2 border-dashed border-outline-variant/30 rounded-md p-8 text-center bg-surface-container-low hover:border-primary transition-colors cursor-pointer relative group">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      if (e.target.files) {
                        setImageFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                      }
                    }}
                  />
                  <span className="material-symbols-outlined text-4xl text-outline-variant mb-2 group-hover:text-primary transition-colors">cloud_upload</span>
                  <p className="text-outline-variant font-medium text-sm group-hover:text-primary transition-colors">Click to upload or drag and drop project images</p>
            </div>
            
            {/* Image Previews */}
            {imageFiles.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {imageFiles.map((file, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden h-24 border border-outline-variant/20 shadow-sm">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <button
                        type="button"
                        onClick={() => setImageFiles(files => files.filter((_, i) => i !== index))}
                        className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-transform hover:scale-110 shadow-lg"
                      >
                        <span className="material-symbols-outlined text-sm block">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full signature-gradient text-white font-bold py-5 rounded-md shadow-lg hover:opacity-95 transition-all uppercase tracking-widest text-lg"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
};