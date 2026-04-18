import api from './client';
import { ProjectDetails,ProjectImage } from '../types/project-details';

export const getProjectDetails = async (id: number): Promise<ProjectDetails> => {
  const response = await api.get<ProjectDetails>(`/projects/${id}/`);
  return response.data;
};

export const createProject = async (payload: FormData): Promise<ProjectDetails> => {
  const response = await api.post<ProjectDetails>('/projects/',payload);
  return response.data;
};
export const updateProject = async (project_id:number,payload: FormData):Promise<ProjectDetails> =>{
  const response = await api.post<ProjectDetails>(`/projects/${project_id}`,payload);
  return response.data;
}

export const cancelProject = async(project_id:number):Promise<ProjectDetails> =>{
  const response = await api.post<ProjectDetails>(`/projects/${project_id}/`);
  return response.data;
}

export const addImagesToProject = async (project_id: number, payload: FormData): Promise<ProjectImage[]> => {
    const response = await api.post<ProjectImage[]>(`/projects/${project_id}/images/`,payload);
  return response.data;
};

export const removeImageFromProject = async (project_id: number, image_id: number): Promise<ProjectImage[]> => {
    const response = await api.delete<ProjectImage[]>(`/projects/${project_id}/images/${image_id}/`);
  return response.data;
};



