import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  Edit3,
  Flag,
  MessageSquare,
  Reply,
  Send,
  Trash2,
  UserCircle2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import {
  createProjectComment,
  deleteProjectComment,
  getProjectComments,
  reportProjectComment,
  updateProjectComment,
} from '../api/comments';
import type { RootState } from '../store/store';
import type { ProjectComment } from '../types/comment';
import { Button } from './ui';

interface ProjectCommentsSectionProps {
  projectId: number;
}

interface CommentNode {
  comment: ProjectComment;
  replies: ProjectComment[];
}

const toComparableId = (value: number | string | null | undefined): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  return String(value);
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (!error || typeof error !== 'object') {
    return fallback;
  }

  const maybeResponse = (error as { response?: { data?: unknown } }).response;
  const data = maybeResponse?.data;

  if (!data || typeof data !== 'object') {
    return fallback;
  }

  if ('detail' in data && typeof data.detail === 'string') {
    return data.detail;
  }

  if ('content' in data && Array.isArray(data.content) && data.content.length > 0) {
    const firstError = data.content[0];
    if (typeof firstError === 'string') {
      return firstError;
    }
  }

  if ('parent' in data && Array.isArray(data.parent) && data.parent.length > 0) {
    const firstError = data.parent[0];
    if (typeof firstError === 'string') {
      return firstError;
    }
  }

  return fallback;
};

const buildCommentTree = (comments: ProjectComment[]): CommentNode[] => {
  const topLevel = comments.filter((comment) => comment.parent === null);

  return topLevel.map((comment) => ({
    comment,
    replies: comments.filter((reply) => reply.parent === comment.id),
  }));
};

const CommentRow = ({
  comment,
  isAuthenticated,
  isOwner,
  activeReplyTo,
  setActiveReplyTo,
  replyText,
  setReplyText,
  activeEditId,
  setActiveEditId,
  editText,
  setEditText,
  onSubmitReply,
  onStartEdit,
  onSubmitEdit,
  onDelete,
  onToggleReport,
  creatingReply,
  updatingComment,
  deletingComment,
  reportingComment,
  isReply,
}: {
  comment: ProjectComment;
  isAuthenticated: boolean;
  isOwner: boolean;
  activeReplyTo: number | null;
  setActiveReplyTo: (id: number | null) => void;
  replyText: string;
  setReplyText: (value: string) => void;
  activeEditId: number | null;
  setActiveEditId: (id: number | null) => void;
  editText: string;
  setEditText: (value: string) => void;
  onSubmitReply: (commentId: number) => void;
  onStartEdit: (comment: ProjectComment) => void;
  onSubmitEdit: (commentId: number) => void;
  onDelete: (commentId: number) => void;
  onToggleReport: (commentId: number) => void;
  creatingReply: boolean;
  updatingComment: boolean;
  deletingComment: boolean;
  reportingComment: boolean;
  isReply: boolean;
}) => {
  const isEditing = activeEditId === comment.id;
  const isReplying = activeReplyTo === comment.id;

  return (
    <div
      className={`flex gap-4 ${isReply ? 'pl-8 border-l-2 border-outline-variant/20' : ''}`}
    >
      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
        <UserCircle2 className="w-5 h-5 text-on-surface-variant" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
          <h4 className="font-headline font-bold text-sm text-on-surface">
            {comment.user_fullname}
          </h4>
          <span className="text-xs text-on-surface-variant">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </span>
          {comment.is_reported_by_me && (
            <span className="text-[10px] uppercase tracking-wider font-bold text-error">
              Reported
            </span>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3 mb-3">
            <textarea
              value={editText}
              onChange={(event) => setEditText(event.target.value)}
              className="w-full bg-surface-container-lowest border-none rounded-xl p-3 focus:ring-2 focus:ring-primary/40 min-h-[90px] text-sm outline-none"
              placeholder="Edit your comment..."
            />
            <div className="flex items-center gap-2">
              <Button
                type="button"
                className="!px-4 !py-2 !text-xs"
                onClick={() => onSubmitEdit(comment.id)}
                isLoading={updatingComment}
                disabled={editText.trim().length === 0}
              >
                Save
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="!px-4 !py-2 !text-xs"
                onClick={() => {
                  setActiveEditId(null);
                  setEditText('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant leading-relaxed mb-3 whitespace-pre-wrap">
            {comment.content}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {isAuthenticated && !isReply && (
            <button
              type="button"
              onClick={() => {
                if (isReplying) {
                  setActiveReplyTo(null);
                  setReplyText('');
                  return;
                }

                setActiveReplyTo(comment.id);
                setReplyText('');
              }}
              className="text-primary font-headline text-xs font-bold hover:underline inline-flex items-center gap-1"
            >
              <Reply className="w-3.5 h-3.5" />
              Reply
            </button>
          )}

          {isAuthenticated && isOwner && !isEditing && (
            <button
              type="button"
              onClick={() => onStartEdit(comment)}
              className="text-on-surface-variant font-headline text-xs font-bold hover:text-primary inline-flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </button>
          )}

          {isAuthenticated && isOwner && (
            <button
              type="button"
              onClick={() => onDelete(comment.id)}
              className="text-on-surface-variant font-headline text-xs font-bold inline-flex items-center gap-1 rounded-md px-1.5 py-1 -my-1 transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={deletingComment}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}

          {isAuthenticated && !isOwner && (
            <button
              type="button"
              onClick={() => onToggleReport(comment.id)}
              className={`font-headline text-xs font-bold inline-flex items-center gap-1 rounded-md px-1.5 py-1 -my-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                comment.is_reported_by_me
                  ? 'text-red-600 bg-red-50/70 hover:bg-red-100 hover:text-red-700'
                  : 'text-on-surface-variant hover:bg-red-50 hover:text-red-600 hover:shadow-sm'
              }`}
              disabled={reportingComment}
            >
              <Flag className="w-3.5 h-3.5" />
              {comment.is_reported_by_me ? 'Unreport' : 'Report'}
            </button>
          )}
        </div>

        {isReplying && (
          <div className="mt-4 bg-surface-container-lowest rounded-xl p-4">
            <textarea
              value={replyText}
              onChange={(event) => setReplyText(event.target.value)}
              className="w-full bg-surface-container-low border-none rounded-xl p-3 focus:ring-2 focus:ring-primary/40 min-h-[90px] text-sm outline-none"
              placeholder="Write your reply..."
            />
            <div className="mt-3 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                className="!px-4 !py-2 !text-xs"
                onClick={() => {
                  setActiveReplyTo(null);
                  setReplyText('');
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="!px-4 !py-2 !text-xs"
                onClick={() => onSubmitReply(comment.id)}
                isLoading={creatingReply}
                disabled={replyText.trim().length === 0}
              >
                Post Reply
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ProjectCommentsSection = ({
  projectId,
}: ProjectCommentsSectionProps) => {
  const queryClient = useQueryClient();
  const commentsQueryKey = ['project-comments', projectId] as const;

  const { user, isAuthenticated, isLoading: authLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  const [newCommentText, setNewCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [editText, setEditText] = useState('');
  const [activeReplyTo, setActiveReplyTo] = useState<number | null>(null);
  const [activeEditId, setActiveEditId] = useState<number | null>(null);
  const currentUserId = toComparableId(user?.id);

  const {
    data: comments = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: commentsQueryKey,
    queryFn: () => getProjectComments(projectId),
  });

  const createCommentMutation = useMutation({
    mutationFn: ({
      content,
      parent,
    }: {
      content: string;
      parent?: number;
    }) => createProjectComment(projectId, { content, parent }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: commentsQueryKey });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to post comment.'));
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      updateProjectComment(commentId, { content }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: commentsQueryKey });
      toast.success('Comment updated successfully.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update comment.'));
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteProjectComment(commentId),
    onSuccess: async (_data, deletedCommentId) => {
      queryClient.setQueryData<ProjectComment[]>(commentsQueryKey, (current = []) =>
        current.filter(
          (comment) =>
            comment.id !== deletedCommentId &&
            toComparableId(comment.parent) !== toComparableId(deletedCommentId),
        ),
      );
      await queryClient.invalidateQueries({ queryKey: commentsQueryKey });
      toast.success('Comment deleted.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete comment.'));
    },
  });

  const reportCommentMutation = useMutation({
    mutationFn: (commentId: number) => reportProjectComment(commentId),
    onSuccess: async (response, commentId) => {
      queryClient.setQueryData<ProjectComment[]>(commentsQueryKey, (current = []) =>
        current.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                is_reported_by_me: !comment.is_reported_by_me,
              }
            : comment,
        ),
      );
      await queryClient.invalidateQueries({ queryKey: commentsQueryKey });
      toast.success(response.detail);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to report comment.'));
    },
  });

  const commentTree = useMemo(() => buildCommentTree(comments), [comments]);

  const postNewComment = async () => {
    const content = newCommentText.trim();

    if (!content) {
      return;
    }

    await createCommentMutation.mutateAsync({ content });
    setNewCommentText('');
  };

  const postReply = async (parentCommentId: number) => {
    const content = replyText.trim();

    if (!content) {
      return;
    }

    await createCommentMutation.mutateAsync({ content, parent: parentCommentId });
    setReplyText('');
    setActiveReplyTo(null);
  };

  const startEdit = (comment: ProjectComment) => {
    setActiveEditId(comment.id);
    setEditText(comment.content);
    setActiveReplyTo(null);
    setReplyText('');
  };

  const submitEdit = async (commentId: number) => {
    const content = editText.trim();

    if (!content) {
      return;
    }

    await updateCommentMutation.mutateAsync({ commentId, content });
    setEditText('');
    setActiveEditId(null);
  };

  const removeComment = async (commentId: number) => {
    await deleteCommentMutation.mutateAsync(commentId);

    if (activeEditId === commentId) {
      setActiveEditId(null);
      setEditText('');
    }

    if (activeReplyTo === commentId) {
      setActiveReplyTo(null);
      setReplyText('');
    }
  };

  const toggleReportComment = async (commentId: number) => {
    await reportCommentMutation.mutateAsync(commentId);
  };

  if (isLoading) {
    return (
      <section className="bg-surface-container-low p-8 rounded-xl">
        <h3 className="text-xl font-bold font-headline mb-4">Community Voices</h3>
        <p className="text-sm text-on-surface-variant">Loading comments...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="bg-surface-container-low p-8 rounded-xl space-y-4">
        <h3 className="text-xl font-bold font-headline">Community Voices</h3>
        <div className="flex items-start gap-3 text-error">
          <AlertTriangle className="w-5 h-5 mt-0.5" />
          <p className="text-sm">Failed to load comments. Please try again.</p>
        </div>
        <Button type="button" className="!px-5 !py-2 !text-sm" onClick={() => refetch()}>
          Retry
        </Button>
      </section>
    );
  }

  return (
    <section className="bg-surface-container-low p-8 rounded-xl">
      <h3 className="text-xl font-bold font-headline mb-8">Community Voices</h3>

      <div className="mb-10">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
            <UserCircle2 className="w-5 h-5 text-on-surface-variant" />
          </div>

          <div className="flex-grow">
            {isAuthenticated ? (
              <>
                <textarea
                  className="w-full bg-surface-container-lowest border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/40 min-h-[100px] text-sm outline-none"
                  placeholder="Share your thoughts or ask a question..."
                  value={newCommentText}
                  onChange={(event) => setNewCommentText(event.target.value)}
                />
                <div className="mt-3 flex justify-end">
                  <Button
                    type="button"
                    className="!px-6 !py-2 !text-sm"
                    onClick={postNewComment}
                    isLoading={createCommentMutation.isPending}
                    disabled={newCommentText.trim().length === 0}
                  >
                    <Send className="w-3.5 h-3.5" />
                    Post Comment
                  </Button>
                </div>
              </>
            ) : (
              <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/20">
                <p className="text-sm text-on-surface-variant">
                  Sign in to join the conversation and post comments.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {commentTree.length === 0 && (
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20">
            <p className="text-sm text-on-surface-variant inline-flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Be the first to leave a comment on this project.
            </p>
          </div>
        )}

        {commentTree.map((node) => {
          const isOwner =
            currentUserId !== null &&
            currentUserId === toComparableId(node.comment.user);

          return (
            <div key={node.comment.id} className="space-y-5">
              <CommentRow
                comment={node.comment}
                isAuthenticated={isAuthenticated && !authLoading}
                isOwner={Boolean(isOwner)}
                activeReplyTo={activeReplyTo}
                setActiveReplyTo={setActiveReplyTo}
                replyText={replyText}
                setReplyText={setReplyText}
                activeEditId={activeEditId}
                setActiveEditId={setActiveEditId}
                editText={editText}
                setEditText={setEditText}
                onSubmitReply={postReply}
                onStartEdit={startEdit}
                onSubmitEdit={submitEdit}
                onDelete={removeComment}
                onToggleReport={toggleReportComment}
                creatingReply={createCommentMutation.isPending}
                updatingComment={updateCommentMutation.isPending}
                deletingComment={deleteCommentMutation.isPending}
                reportingComment={reportCommentMutation.isPending}
                isReply={false}
              />

              {node.replies.map((reply) => {
                const replyOwner =
                  currentUserId !== null &&
                  currentUserId === toComparableId(reply.user);

                return (
                  <CommentRow
                    key={reply.id}
                    comment={reply}
                    isAuthenticated={isAuthenticated && !authLoading}
                    isOwner={Boolean(replyOwner)}
                    activeReplyTo={activeReplyTo}
                    setActiveReplyTo={setActiveReplyTo}
                    replyText={replyText}
                    setReplyText={setReplyText}
                    activeEditId={activeEditId}
                    setActiveEditId={setActiveEditId}
                    editText={editText}
                    setEditText={setEditText}
                    onSubmitReply={postReply}
                    onStartEdit={startEdit}
                    onSubmitEdit={submitEdit}
                    onDelete={removeComment}
                    onToggleReport={toggleReportComment}
                    creatingReply={createCommentMutation.isPending}
                    updatingComment={updateCommentMutation.isPending}
                    deletingComment={deleteCommentMutation.isPending}
                    reportingComment={reportCommentMutation.isPending}
                    isReply
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectCommentsSection;