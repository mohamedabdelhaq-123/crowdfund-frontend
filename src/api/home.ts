import api from './client';
import { HomepageData } from '../types/project';

export const getHomepageData = async (): Promise<HomepageData> => {
  const response = await api.get<HomepageData>('/projects/home/');
  return response.data;
};
