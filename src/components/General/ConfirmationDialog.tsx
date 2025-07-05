// src/components/ConfirmationDialog.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message?: string;
  children?: React.ReactNode; // For custom content instead of message
  onClose: () => void;
  
  // Primary button (usually confirm/save action)
  primaryButton: {
    text: string;
    onClick: () => void;
    className?: string; // Default will be provided
    disabled?: boolean;
  };
  
  // Secondary button (usually cancel action)
  secondaryButton: {
    text: string;
    onClick: () => void;
    className?: string; // Default will be provided
    disabled?: boolean;
  };
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  children,
  onClose,
  primaryButton,
  secondaryButton
}) => {
  // Handle escape key to close dialog
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Default button styles that match your app's theme
  const defaultPrimaryClassName = "bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors font-medium";
  const defaultSecondaryClassName = "bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors font-medium";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-lg"
          onClick={onClose} // Close when clicking backdrop
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 font-ivysoft"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking dialog content
          >
            {/* Title */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            </div>

            {/* Content */}
            <div className="mb-6">
              {children ? (
                children
              ) : (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={secondaryButton.onClick}
                disabled={secondaryButton.disabled}
                className={secondaryButton.className || defaultSecondaryClassName}
              >
                {secondaryButton.text}
              </button>
              <button
                onClick={primaryButton.onClick}
                disabled={primaryButton.disabled}
                className={primaryButton.className || defaultPrimaryClassName}
              >
                {primaryButton.text}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationDialog;