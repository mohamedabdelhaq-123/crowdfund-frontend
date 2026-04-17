import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHome?: boolean;
}

export const ErrorState = ({
  title = 'Oasis Temporarily Hidden',
  message = 'We encountered a technical issue. Please try again.',
  onRetry,
  showHome = true,
}: ErrorStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center text-error mb-8">
        <AlertCircle size={32} />
      </div>

      <h1 className="font-headline text-3xl font-black mb-4">{title}</h1>

      <p className="text-on-surface-variant max-w-md mb-10 font-body">
        {message}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        {onRetry && (
          <Button onClick={onRetry} variant="primary" className="gap-2 px-10">
            <RefreshCcw size={18} />
            Try Again
          </Button>
        )}

        {showHome && (
          <Button
            onClick={() => navigate('/')}
            variant="secondary"
            className="gap-2 px-10"
          >
            <Home size={18} />
            Back to Home
          </Button>
        )}
      </div>
    </div>
  );
};
