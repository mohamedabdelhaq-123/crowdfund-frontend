import { formatDistanceToNow } from 'date-fns';
import { Edit3, Flag, Reply, Trash2 } from 'lucide-react';
import type { ProjectComment } from '../../types/comment';
import { Button } from '../ui';

export interface CommentRowState {
  activeReplyTo: number | null;
  replyText: string;
  activeEditId: number | null;
  editText: string;
}

export interface CommentRowActions {
  setActiveReplyTo: (id: number | null) => void;
  setReplyText: (value: string) => void;
  setActiveEditId: (id: number | null) => void;
  setEditText: (value: string) => void;
  onSubmitReply: (commentId: number) => void;
  onStartEdit: (comment: ProjectComment) => void;
  onSubmitEdit: (commentId: number) => void;
  onDelete: (commentId: number) => void;
  onToggleReport: (commentId: number) => void;
}

export interface CommentRowPending {
  creatingReply: boolean;
  updatingComment: boolean;
  deletingComment: boolean;
  reportingComment: boolean;
}

interface CommentRowProps {
  comment: ProjectComment;
  isAuthenticated: boolean;
  isOwner: boolean;
  isReply: boolean;
  state: CommentRowState;
  actions: CommentRowActions;
  pending: CommentRowPending;
}

export const CommentRow = ({
  comment,
  isAuthenticated,
  isOwner,
  isReply,
  state,
  actions,
  pending,
}: CommentRowProps) => {
  const isEditing = state.activeEditId === comment.id;
  const isReplying = state.activeReplyTo === comment.id;

  return (
    <div
      className={`flex gap-4 ${isReply ? 'pl-8 border-l-2 border-outline-variant/20' : ''}`}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden bg-primary flex items-center justify-center flex-shrink-0 shadow-sm border border-outline-variant/10">
        {comment.user_profile_pic ? (
          <img 
            src={comment.user_profile_pic} 
            alt={comment.user_fullname} 
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <span className="text-sm font-black text-on-primary font-headline">
            {comment.user_fullname?.[0]?.toUpperCase()}
          </span>
        )}
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
              value={state.editText}
              onChange={(event) => actions.setEditText(event.target.value)}
              className="w-full bg-surface-container-lowest border-none rounded-xl p-3 focus:ring-2 focus:ring-primary/40 min-h-[90px] text-sm outline-none"
              placeholder="Edit your comment..."
            />
            <div className="flex items-center gap-2">
              <Button
                type="button"
                className="!px-4 !py-2 !text-xs hover:!scale-100 active:!scale-100 hover:!shadow-none hover:brightness-110"
                onClick={() => actions.onSubmitEdit(comment.id)}
                isLoading={pending.updatingComment}
                disabled={state.editText.trim().length === 0}
              >
                Save
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="!px-4 !py-2 !text-xs"
                onClick={() => {
                  actions.setActiveEditId(null);
                  actions.setEditText('');
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
                  actions.setActiveReplyTo(null);
                  actions.setReplyText('');
                  return;
                }

                actions.setActiveReplyTo(comment.id);
                actions.setReplyText('');
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
              onClick={() => actions.onStartEdit(comment)}
              className="text-on-surface-variant font-headline text-xs font-bold hover:text-primary inline-flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </button>
          )}

          {isAuthenticated && isOwner && (
            <button
              type="button"
              onClick={() => actions.onDelete(comment.id)}
              className="text-on-surface-variant font-headline text-xs font-bold inline-flex items-center gap-1 transition-colors duration-150 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={pending.deletingComment}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}

          {isAuthenticated && !isOwner && (
            <button
              type="button"
              onClick={() => actions.onToggleReport(comment.id)}
              className={`font-headline text-xs font-bold inline-flex items-center gap-1 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
                comment.is_reported_by_me
                  ? 'text-red-600/90 hover:text-red-700'
                  : 'text-on-surface-variant hover:text-red-600'
              }`}
              disabled={pending.reportingComment}
            >
              <Flag className="w-3.5 h-3.5" />
              {comment.is_reported_by_me ? 'Unreport' : 'Report'}
            </button>
          )}
        </div>

        {isReplying && (
          <div className="mt-4 bg-surface-container-lowest rounded-xl p-4">
            <textarea
              value={state.replyText}
              onChange={(event) => actions.setReplyText(event.target.value)}
              className="w-full bg-surface-container-low border-none rounded-xl p-3 focus:ring-2 focus:ring-primary/40 min-h-[90px] text-sm outline-none"
              placeholder="Write your reply..."
            />
            <div className="mt-3 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                className="!px-4 !py-2 !text-xs"
                onClick={() => {
                  actions.setActiveReplyTo(null);
                  actions.setReplyText('');
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                  className="!px-4 !py-2 !text-xs hover:!scale-100 active:!scale-100 hover:!shadow-none hover:brightness-110"
                onClick={() => actions.onSubmitReply(comment.id)}
                isLoading={pending.creatingReply}
                disabled={state.replyText.trim().length === 0}
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
