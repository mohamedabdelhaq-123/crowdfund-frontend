import api from './client';
import { Category, PaginatedResponse } from '../types/project';

export const getCategories = async (): Promise<PaginatedResponse<Category>> => {
  const response = await api.get<PaginatedResponse<Category>>('projects/categories/');
  return response.data;
};