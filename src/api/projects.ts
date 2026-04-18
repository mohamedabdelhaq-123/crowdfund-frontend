import api from './client';
import { Project, PaginatedResponse } from '../types/project';

export const getProjects = async (search?: string, category?: number | null, page: number = 1): Promise<PaginatedResponse<Project>> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category.toString());
  if (page > 1) params.append('page', page.toString());

  // Correctly hit the specialized Search API endpoint
  const response = await api.get<PaginatedResponse<Project> | Project[]>(`/projects/search/?${params.toString()}`);
  const data = response.data;

  // 🛡️ Normalization Layer: Handles both paginated objects and simple arrays 
  // to prevent grid crashes on either backend configuration.
  if (Array.isArray(data)) {
    return {
      count: data.length,
      next: null,
      previous: null,
      results: data,
    };
  }
  
  return data;
};

export const getSimilarProjects = async (id: number): Promise<PaginatedResponse<Project>> => {
  const response = await api.get<PaginatedResponse<Project>>(`/projects/${id}/similar/`);
  return response.data;
};
