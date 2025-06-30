import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CurriculumVitae } from "../../types/job-application-types";
import { cvHandler } from "../../data/CVHandler";
import CVCard from "../ApplicationWindow/EditContent/CV/CVCard";
import AnimatedButton from "../General/AnimatedButton";
import { mdiClose, mdiTextBoxPlus, mdiTextBoxOutline } from "@mdi/js";
import Icon from "@mdi/react";

interface CVCollectionWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const CVCollectionWindow: React.FC<CVCollectionWindowProps> = ({
  isOpen,
  onClose,
}) => {
  const [cvCollection, setCvCollection] = useState<CurriculumVitae[]>([]);
  const [selectedCV, setSelectedCV] = useState<CurriculumVitae | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize CV collection from CVHandler
  useEffect(() => {
    const initializeCVs = async () => {
      try {
        await cvHandler.initialize();
        setCvCollection(cvHandler.getAllCVs());
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to initialize CVs:", err);
        setError("Failed to load CV collection");
        setIsLoading(false);
      }
    };

    // Event listeners for CV data changes
    const handleCVChange = () => {
      setCvCollection(cvHandler.getAllCVs());
    };

    cvHandler.addEventListener("cv-added", handleCVChange);
    cvHandler.addEventListener("cv-updated", handleCVChange);
    cvHandler.addEventListener("cv-deleted", handleCVChange);
    cvHandler.addEventListener("cvs-loaded", handleCVChange);

    if (isOpen) {
      initializeCVs();
    }

    // Cleanup event listeners on unmount
    return () => {
      cvHandler.removeEventListener("cv-added", handleCVChange);
      cvHandler.removeEventListener("cv-updated", handleCVChange);
      cvHandler.removeEventListener("cv-deleted", handleCVChange);
      cvHandler.removeEventListener("cvs-loaded", handleCVChange);
    };
  }, [isOpen]);

  const handleCVSelect = (cv: CurriculumVitae) => {
    setSelectedCV(selectedCV?.id === cv.id ? null : cv);
  };

  const handleCVDelete = (deletedCV: CurriculumVitae) => {
    // Remove from local state
    setCvCollection(prev => prev.filter(cv => cv.id !== deletedCV.id));
    
    // Clear selection if the deleted CV was selected
    if (selectedCV?.id === deletedCV.id) {
      setSelectedCV(null);
    }
  };

  const handleClose = () => {
    setSelectedCV(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleClose}
      >
        <motion.div
          className="bg-white rounded-lg shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.85, 0, 0.15, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-6 border-b"
            style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="flex items-center space-x-3">
              <motion.div
                className="p-2 bg-teal-100 rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                >
                <Icon
                  path={mdiTextBoxOutline}
                  size={1.5}
                  className="text-teal-600"
                />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800">
                CV Collection
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <AnimatedButton
                icon={mdiTextBoxPlus}
                caption="Add New CV"
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                iconClassName="text-white"
                onClick={() => {
                  // TODO: Implement add new CV functionality
                  console.log("Add new CV clicked");
                }}
              />
              <AnimatedButton
                icon={mdiClose}
                caption="Close"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                iconClassName="text-gray-600 hover:text-gray-800"
                onClick={handleClose}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  className="flex flex-col items-center space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                  <p className="text-gray-500">Loading CV collection...</p>
                </motion.div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-red-500 text-lg">{error}</p>
                  <p className="text-gray-500 mt-2">
                    Please try refreshing or contact support
                  </p>
                </motion.div>
              </div>
            ) : cvCollection.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No CVs Found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Get started by creating your first CV
                  </p>
                  <AnimatedButton
                    icon={mdiTextBoxPlus}
                    caption="Create Your First CV"
                    className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                    iconClassName="text-white"
                    onClick={() => {
                      // TODO: Implement add new CV functionality
                      console.log("Create first CV clicked");
                    }}
                  />
                </motion.div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Your CVs ({cvCollection.length})
                  </h3>
                  {selectedCV && (
                    <motion.div
                      className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      Selected: {selectedCV.name}
                    </motion.div>
                  )}
                </div>

                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, staggerChildren: 0.1 }}
                >
                  {cvCollection.map((cv, index) => (
                    <motion.div
                      key={cv.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <CVCard
                        cv={cv}
                        onSelect={handleCVSelect}
                        isSelected={selectedCV?.id === cv.id}
                        enlarged={true}
                        onDelete={handleCVDelete}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Selected CV Details */}
                {selectedCV && (
                  <motion.div
                    className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      CV Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Name
                        </label>
                        <p className="text-gray-900">{selectedCV.name}</p>
                      </div>
                      {selectedCV.date && (
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Date
                          </label>
                          <p className="text-gray-900">
                            {new Date(selectedCV.date).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {selectedCV.notes && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Notes
                          </label>
                          <p className="text-gray-900">{selectedCV.notes}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CVCollectionWindow;
