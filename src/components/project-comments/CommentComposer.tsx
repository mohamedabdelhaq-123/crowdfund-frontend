import { Send, UserCircle2 } from 'lucide-react';
import { Button } from '../ui';

interface CommentComposerProps {
  isAuthenticated: boolean;
  text: string;
  setText: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const CommentComposer = ({
  isAuthenticated,
  text,
  setText,
  onSubmit,
  isSubmitting,
}: CommentComposerProps) => {
  return (
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
                value={text}
                onChange={(event) => setText(event.target.value)}
              />
              <div className="mt-3 flex justify-end">
                <Button
                  type="button"
                  className="!px-6 !py-2 !text-sm"
                  onClick={onSubmit}
                  isLoading={isSubmitting}
                  disabled={text.trim().length === 0}
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
  );
};
