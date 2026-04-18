import api from "./client";
import type {
  CommentReportResponse,
  CreateProjectCommentPayload,
  ProjectComment,
  UpdateProjectCommentPayload,
} from "../types/comment";

export const getProjectComments = async (
  projectId: number,
): Promise<ProjectComment[]> => {
  const response = await api.get<ProjectComment[]>(
    `/projects/${projectId}/comments/`,
  );
  return response.data;
};

export const createProjectComment = async (
  projectId: number,
  payload: CreateProjectCommentPayload,
): Promise<ProjectComment> => {
  const response = await api.post<ProjectComment>(
    `/projects/${projectId}/comments/`,
    payload,
  );
  return response.data;
};

export const updateProjectComment = async (
  commentId: number,
  payload: UpdateProjectCommentPayload,
): Promise<ProjectComment> => {
  const response = await api.patch<ProjectComment>(
    `/projects/comments/${commentId}/`,
    payload,
  );
  return response.data;
};

export const deleteProjectComment = async (
  commentId: number,
): Promise<void> => {
  await api.delete(`/projects/comments/${commentId}/`);
};

export const reportProjectComment = async (
  commentId: number,
): Promise<CommentReportResponse> => {
  const response = await api.post<CommentReportResponse>(
    `/projects/comments/${commentId}/report/`,
  );
  return response.data;
};
