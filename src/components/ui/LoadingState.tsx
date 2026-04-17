import { motion } from 'framer-motion';

interface LoadingStateProps {
  fullPage?: boolean;
}

export const LoadingState = ({ fullPage = false }: LoadingStateProps) => {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center gap-4 ${fullPage ? 'min-h-[80vh]' : 'py-20'}`}
    >
      <div className="w-48 h-[2px] bg-surface-container-high relative overflow-hidden">
        <motion.div
          className="absolute inset-0 signature-gradient"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'easeInOut',
          }}
        />
      </div>
      <span className="font-headline text-[10px] font-bold tracking-[0.3em] uppercase text-primary animate-pulse">
        Synchronizing Oasis
      </span>
    </div>
  );
};
