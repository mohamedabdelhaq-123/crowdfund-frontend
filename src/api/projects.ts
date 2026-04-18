import api from './client';
import { Project, PaginatedResponse } from '../types/project';

export const getProjects = async (search?: string, category?: number | null): Promise<PaginatedResponse<Project>> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category.toString());

  const response = await api.get<PaginatedResponse<Project>>(`/projects/?${params.toString()}`);
  return response.data;
};

export const getSimilarProjects = async (id: number): Promise<PaginatedResponse<Project>> => {
  const response = await api.get<PaginatedResponse<Project>>(`/projects/${id}/similar/`);
  return response.data;
};
