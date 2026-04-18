import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-surface-container-lowest rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 pb-4">
              {title ? (
                <h2 className="text-2xl font-headline font-black text-on-surface tracking-tight">
                  {title}
                </h2>
              ) : (
                <div />
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            <div className="p-6 pt-2 overflow-y-auto no-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
