import { AlertTriangle, MessageSquare } from 'lucide-react';
import { Button } from '../ui';

export const CommentsLoadingState = () => {
  return (
    <section className="bg-surface-container-low p-8 rounded-xl">
      <h3 className="text-xl font-bold font-headline mb-4">Community Voices</h3>
      <p className="text-sm text-on-surface-variant">Loading comments...</p>
    </section>
  );
};

interface CommentsErrorStateProps {
  onRetry: () => void;
}

export const CommentsErrorState = ({ onRetry }: CommentsErrorStateProps) => {
  return (
    <section className="bg-surface-container-low p-8 rounded-xl space-y-4">
      <h3 className="text-xl font-bold font-headline">Community Voices</h3>
      <div className="flex items-start gap-3 text-error">
        <AlertTriangle className="w-5 h-5 mt-0.5" />
        <p className="text-sm">Failed to load comments. Please try again.</p>
      </div>
      <Button type="button" className="!px-5 !py-2 !text-sm" onClick={onRetry}>
        Retry
      </Button>
    </section>
  );
};

export const CommentsEmptyState = () => {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20">
      <p className="text-sm text-on-surface-variant inline-flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        Be the first to leave a comment on this project.
      </p>
    </div>
  );
};
