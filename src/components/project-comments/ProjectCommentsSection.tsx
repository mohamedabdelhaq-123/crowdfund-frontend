import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  createProjectComment,
  deleteProjectComment,
  getProjectComments,
  reportProjectComment,
  updateProjectComment,
} from '../../api/comments';
import type { RootState } from '../../store/store';
import type { ProjectComment } from '../../types/comment';
import {
  CommentRow,
  type CommentRowActions,
  type CommentRowPending,
  type CommentRowState,
} from './CommentRow';
import { CommentComposer } from './CommentComposer';
import {
  CommentsEmptyState,
  CommentsErrorState,
  CommentsLoadingState,
} from './CommentStates';
import { buildCommentTree, getErrorMessage, toComparableId } from './utils';

interface ProjectCommentsSectionProps {
  projectId: number;
}

interface CreateCommentInput {
  content: string;
  parent?: number;
}

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
  const canInteract = isAuthenticated && !authLoading;

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
    }: CreateCommentInput) => createProjectComment(projectId, { content, parent }),
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

  const clearReplyState = () => {
    setActiveReplyTo(null);
    setReplyText('');
  };

  const clearEditState = () => {
    setActiveEditId(null);
    setEditText('');
  };

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
    clearReplyState();
  };

  const startEdit = (comment: ProjectComment) => {
    setActiveEditId(comment.id);
    setEditText(comment.content);
    clearReplyState();
  };

  const submitEdit = async (commentId: number) => {
    const content = editText.trim();

    if (!content) {
      return;
    }

    await updateCommentMutation.mutateAsync({ commentId, content });
    clearEditState();
  };

  const removeComment = async (commentId: number) => {
    await deleteCommentMutation.mutateAsync(commentId);

    if (activeEditId === commentId) {
      clearEditState();
    }

    if (activeReplyTo === commentId) {
      clearReplyState();
    }
  };

  const toggleReportComment = async (commentId: number) => {
    await reportCommentMutation.mutateAsync(commentId);
  };

  const rowState: CommentRowState = {
    activeReplyTo,
    replyText,
    activeEditId,
    editText,
  };

  const rowActions: CommentRowActions = {
    setActiveReplyTo,
    setReplyText,
    setActiveEditId,
    setEditText,
    onSubmitReply: postReply,
    onStartEdit: startEdit,
    onSubmitEdit: submitEdit,
    onDelete: removeComment,
    onToggleReport: toggleReportComment,
  };

  const rowPending: CommentRowPending = {
    creatingReply: createCommentMutation.isPending,
    updatingComment: updateCommentMutation.isPending,
    deletingComment: deleteCommentMutation.isPending,
    reportingComment: reportCommentMutation.isPending,
  };

  const isCommentOwner = (comment: ProjectComment) => {
    return currentUserId !== null && currentUserId === toComparableId(comment.user);
  };

  if (isLoading) {
    return <CommentsLoadingState />;
  }

  if (isError) {
    return (
      <CommentsErrorState
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <section className="bg-surface-container-low p-8 rounded-xl">
      <h3 className="text-xl font-bold font-headline mb-8">Community Voices</h3>

      <CommentComposer
        isAuthenticated={isAuthenticated}
        text={newCommentText}
        setText={setNewCommentText}
        onSubmit={postNewComment}
        isSubmitting={createCommentMutation.isPending}
      />

      <div className="space-y-8">
        {commentTree.length === 0 && <CommentsEmptyState />}

        {commentTree.map((node) => {
          return (
            <div key={node.comment.id} className="space-y-5">
              <CommentRow
                comment={node.comment}
                isAuthenticated={canInteract}
                isOwner={isCommentOwner(node.comment)}
                state={rowState}
                actions={rowActions}
                pending={rowPending}
                isReply={false}
              />

              {node.replies.map((reply) => {
                return (
                  <CommentRow
                    key={reply.id}
                    comment={reply}
                    isAuthenticated={canInteract}
                    isOwner={isCommentOwner(reply)}
                    state={rowState}
                    actions={rowActions}
                    pending={rowPending}
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