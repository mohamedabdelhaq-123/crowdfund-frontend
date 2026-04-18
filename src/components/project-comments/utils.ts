import type { ProjectComment } from "../../types/comment";

interface CommentNode {
  comment: ProjectComment;
  replies: ProjectComment[];
}

const getFirstListError = (value: unknown): string | null => {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  return typeof value[0] === "string" ? value[0] : null;
};

export const toComparableId = (
  value: number | string | null | undefined,
): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  return String(value);
};

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (!error || typeof error !== "object") {
    return fallback;
  }

  const maybeResponse = (error as { response?: { data?: unknown } }).response;
  const data = maybeResponse?.data;

  if (!data || typeof data !== "object") {
    return fallback;
  }

  if ("detail" in data && typeof data.detail === "string") {
    return data.detail;
  }

  if ("content" in data) {
    const contentError = getFirstListError(data.content);
    if (contentError) {
      return contentError;
    }
  }

  if ("parent" in data) {
    const parentError = getFirstListError(data.parent);
    if (parentError) {
      return parentError;
    }
  }

  return fallback;
};

export const buildCommentTree = (comments: ProjectComment[]): CommentNode[] => {
  const topLevel = comments.filter((comment) => comment.parent === null);

  return topLevel.map((comment) => ({
    comment,
    replies: comments.filter((reply) => reply.parent === comment.id),
  }));
};
