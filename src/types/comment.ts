export interface ProjectComment {
  id: number;
  project: number;
  user: number | string;
  user_fullname: string;
  user_profile_pic: string | null;
  parent: number | null;
  content: string;
  is_reported_by_me: boolean;
  created_at: string;
}

export interface CreateProjectCommentPayload {
  content: string;
  parent?: number;
}

export interface UpdateProjectCommentPayload {
  content: string;
}

export interface CommentReportResponse {
  detail: string;
}
