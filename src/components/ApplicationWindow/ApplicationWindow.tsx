import React, { useEffect, createContext, useState } from "react";
import Header from "./Header";
import ViewContent from "./ViewContent/ViewContent";
import EditContent from "./EditContent/EditContent";
import { motion, AnimatePresence } from "framer-motion";
import { JobApplication } from "../../types/job-application-types";
import { collectionHandler } from "../../data/CollectionHandler";
import { StatusItem } from "../../types/status-types";

interface ApplicationWindowProps {
  jobApplication: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
  createNew?: boolean; // Renamed from edit, indicates this is a new application
}

interface ApplicationWindowContextType {
  jobApplication?: JobApplication | null; 
  setJobApplication: (job: JobApplication) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  onStatusChange?: (newStatus: StatusItem) => void;
  updateField: (field: keyof JobApplication, value: any) => void;
  isSaving?: boolean; 
  error?: string | null; 
}

export const ApplicationWindowContext =
  createContext<ApplicationWindowContextType>({
    jobApplication: null,
    setJobApplication: () => {},
    isEditing: false,
    setIsEditing: () => {},
    updateField: () => {},
  });

const ApplicationWindow: React.FC<ApplicationWindowProps> = ({
  jobApplication: job,
  isOpen,
  onClose,
  createNew = false, // Renamed from edit
}) => {
  if (!job) return null;
  const [jobApplication, setJobApplication] = useState<JobApplication | null>(job);
  const [isEditing, setIsEditing] = useState(createNew); // Set initial editing state based on createNew flag
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setJobApplication(job);
  }, [job]);

  // Field update method for application data edits
  // This method updates a specific field in the job application state
  const updateField = (field: keyof JobApplication, value: any) => {
    setJobApplication(prev => prev ? { ...prev, [field]: value } : null);
  };
  // Separate handler for status changes
  // This method handles status changes and saves the updated application immediately
  // Only works for existing applications, not new ones being created
  const handleStatusChange = async (newStatus: StatusItem) => {
    if (!jobApplication || createNew) return; // Don't auto-save status changes for new applications

    try {
      const updatedJob = { ...jobApplication, status: newStatus };
      
      // Save immediately via CollectionHandler
      await collectionHandler.updateApplication(updatedJob);
      
      // Update local state
      setJobApplication(updatedJob);
    } catch (err) {
      setError(`Failed to update status: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  // Explicit save for form edits (EditContent)
  const handleSave = async () => {
    if (!jobApplication) return;

    try {
      setIsSaving(true);
      setError(null);

      if (createNew) {
        // Creating a new application - use addApplication
        const savedApplication = await collectionHandler.addApplication(jobApplication);
        setJobApplication(savedApplication);
      } else {
        // Updating existing application - use updateApplication  
        await collectionHandler.updateApplication(jobApplication);
      }
      
      setIsEditing(false);
    } catch (err) {
      setError(`Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete operation
  const handleDeleteAndClose = async () => {
    if (!jobApplication) return;

    try {
      await collectionHandler.deleteApplication(jobApplication.id);
      onClose(); // Close window after successful deletion
    } catch (err) {
      setError(`Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  return (
    <ApplicationWindowContext.Provider
      value={{ 
        jobApplication, 
        setJobApplication, 
        isEditing, 
        setIsEditing,
        updateField,
        onStatusChange: handleStatusChange,
        isSaving,
        error
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col mx-4">
              {jobApplication && (
                <Header
                  onClose={onClose}
                  onSave={handleSave}
                  onDelete={handleDeleteAndClose}
                />
              )}
              <div className="flex-grow overflow-y-auto">
                {isEditing ? (
                  <EditContent />
                ) : (
                  <ViewContent />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ApplicationWindowContext.Provider>
  );
};

export default ApplicationWindow;
