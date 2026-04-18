import api from './client';
import { Project } from '../types/project';


export const donateToProject = async (project_id: number): Promise<Project> => {
  const response = await api.get<Project>(`/donations/${project_id}/`);
  return response.data;
};
