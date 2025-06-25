import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mdiClockOutline, mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import Icon from "@mdi/react";

interface UpdatedApplication {
  company: string;
  position: string;
}

interface AutoUpdatePopupProps {
  isVisible: boolean;
  count: number;
  applications?: UpdatedApplication[];
  onClose: () => void;
}

export const AutoUpdatePopup: React.FC<AutoUpdatePopupProps> = ({
  isVisible,
  count,
  applications = [],
  onClose,
}) => {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Auto-dismiss after 4 seconds (only in summary view)
  useEffect(() => {
    if (isVisible && !showDetails) {
      const id = setTimeout(() => {
        onClose();
      }, 4000);
      setTimeoutId(id);

      return () => {
        if (id) clearTimeout(id);
      };
    }
  }, [isVisible, showDetails, onClose]);

  // Clear timeout on manual close
  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  // Reset detail view when popup closes
  useEffect(() => {
    if (!isVisible) {
      setShowDetails(false);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{
            duration: 0.3,
            ease: [0.85, 0, 0.15, 1],
          }}
        >
          <motion.div
            className="bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-lg rounded-lg shadow-xl p-4 max-w-sm cursor-pointer"
            onClick={showDetails ? onClose : () => setShowDetails(true)}
            whileHover={{ scale: 1.1, x: -5, y: -5 }}
            whileTap={{ scale: 0.98 }}
            layout
          >
            {!showDetails ? (
              // Summary View
              <>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Icon
                      path={mdiClockOutline}
                      size={1.2}
                      className="text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm">
                      Auto-Update Complete
                    </h3>
                    <p className="text-white/90 text-xs mt-1">
                      {count === 1 
                        ? `1 application updated to "No Response"`
                        : `${count} applications updated to "No Response"`
                      }
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Icon
                      path={mdiChevronRight}
                      size={0.8}
                      className="text-white/60"
                    />
                  </div>
                </div>
                
                {/* Progress bar for auto-dismiss */}
                <motion.div 
                  className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="h-full bg-white/60 rounded-full"
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 4, ease: "linear" }}
                  />
                </motion.div>
              </>
            ) : (
              // Detailed View
              <>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex-shrink-0">
                    <Icon
                      path={mdiChevronLeft}
                      size={0.8}
                      className="text-white/60"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm">
                      Updated Applications
                    </h3>
                    <p className="text-white/90 text-xs">
                      Click to close
                    </p>
                  </div>
                </div>
                
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {applications.map((app, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/10 rounded p-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <p className="text-white font-medium text-xs">
                        {app.company}
                      </p>
                      <p className="text-white/80 text-xs">
                        {app.position}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
