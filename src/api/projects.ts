import api from './client';
import { Project } from '../types/project';

export const getProjects = async (search?: string, category?: number | null): Promise<Project[]> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category.toString());

  const response = await api.get<Project[]>(`/projects/?${params.toString()}`);
  return response.data;
};

export const getSimilarProjects = async (id: number): Promise<Project[]> => {
  const response = await api.get<Project[]>(`/projects/${id}/simi/`);
  return response.data;
};
