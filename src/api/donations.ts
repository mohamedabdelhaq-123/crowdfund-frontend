import api from './client';
import { Project } from '../types/project';


export const donateToProject = async (project_id: number, amount: number): Promise<Project> => {
  const response = await api.post<Project>(`/donations/${project_id}/`, { amount });
  return response.data;
};
