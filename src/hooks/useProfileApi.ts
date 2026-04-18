import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import type { UserProfile, UpdateProfileData, ProjectItem, DonationItem } from '../types/profile';

// GET /api/users/me/
export const useProfile = () => {
  return useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await api.get('/users/me/');
      return data;
    },
  });
};

// PATCH /api/users/me/
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updateData: UpdateProfileData) => {
   
      if (updateData.profile_pic instanceof File) {
        const formData = new FormData();
        Object.entries(updateData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });
        const { data } = await api.patch('/users/me/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
      }
      const { data } = await api.patch('/users/me/', updateData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// DELETE /api/users/me/
export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: async (password: string) => {
      const { data } = await api.delete('/users/me/', { data: { password } });
      return data;
    },
  });
};

// GET /api/users/me/projects/
export const useMyProjects = () => {
  return useQuery<ProjectItem[]>({
    queryKey: ['myProjects'],
    queryFn: async () => {
      const { data } = await api.get('/users/me/projects/');
      return data;
    },
  });
};

// GET /api/users/me/donations/
export const useMyDonations = () => {
  return useQuery<DonationItem[]>({
    queryKey: ['myDonations'],
    queryFn: async () => {
      const { data } = await api.get('/users/me/donations/');
      return data;
    },
  });
};

// GET /api/users/:id/
export const usePublicProfile = (id: number) => {
  return useQuery<UserProfile>({
    queryKey: ['publicProfile', id],
    queryFn: async () => {
      const { data } = await api.get(`/users/${id}/`);
      return data;
    },
    enabled: !!id,
  });
};

// GET /api/users/:id/projects/
export const usePublicProjects = (id: number) => {
  return useQuery<ProjectItem[]>({
    queryKey: ['publicProjects', id],
    queryFn: async () => {
      const { data } = await api.get(`/users/${id}/projects/`);
      return data;
    },
    enabled: !!id,
  });
};
