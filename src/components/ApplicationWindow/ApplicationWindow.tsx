import React, { createContext, useState } from "react";
import Header from "./Header";
import ViewContent from "./ViewContent/ViewContent";
import EditContent from "./EditContent/EditContent";
import ConfirmationDialog from "../General/ConfirmationDialog";
import { motion, AnimatePresence } from "framer-motion";
import { JobApplication } from "../../types/job-application-types";
import { StatusItem } from "../../types/status-types";
import { useSettings } from "../SettingsWindow/SettingsContext";
import { useConfirmationDialog } from "../../hooks/useConfirmationDialog";
import { useApplicationPersistence } from "../../hooks/useApplicationPersistence";
import {
  createUnsavedChangesDialog,
  createDeleteConfirmationDialog,
  createValidationErrorDialog,
} from "../../utils/dialogConfigs";

interface ApplicationWindowProps {
  jobApplication: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
  createNew?: boolean; // indicates this is a new application
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
  createNew = false,
}) => {
  if (!job) {
    console.warn("No job application provided to ApplicationWindow");
    return null;
  }
  const { settings } = useSettings();

  // Dialog hooks - each handles a specific dialog type
  const unsavedChangesDialog = useConfirmationDialog();
  const deleteDialog = useConfirmationDialog();
  const validationDialog = useConfirmationDialog();

  // Persistence hook - handles all data operations
  const persistence = useApplicationPersistence({
    initialApplication: job,
    isNewApplication: createNew,
    onSave: (_savedApplication) => {
      // UI-specific post-save actions
      setIsEditing(false);
    },
    onDelete: () => {
      // Navigate away after successful deletion
      onClose();
    },
    onStatusChange: (updatedApplication) => {
      // Optional: Handle status change success
      console.log("Status updated:", updatedApplication.status);
    }
  });

  // UI-specific state that doesn't belong in the persistence hook
  const [isEditing, setIsEditing] = useState(createNew);

  // Enhanced close handler with unsaved changes detection
  const handleCloseWithConfirmation = () => {
    if (isEditing && persistence.hasUnsavedChanges) {
      const dialogConfig = createUnsavedChangesDialog(
        handleSaveAndClose,
        handleDiscardChanges,
        persistence.isLoading
      );
      unsavedChangesDialog.showDialog(dialogConfig);
    } else {
      onClose();
    }
  };

  // Handle forced close (discard changes)
  const handleDiscardChanges = () => {
    unsavedChangesDialog.hideDialog();
    persistence.discardChanges();
    onClose();
  };

  // Status change handler using the persistence hook
  const handleStatusChange = async (newStatus: StatusItem) => {
    await persistence.updateStatus(newStatus);
  };

  // Save handler with validation dialog integration
  const handleSave = async () => {
    const success = await persistence.save();
    
    if (!success && persistence.validationErrors.length > 0) {
      const dialogConfig = createValidationErrorDialog(
        persistence.validationErrors,
        validationDialog.hideDialog
      );
      validationDialog.showDialog(dialogConfig);
    }
  };

  // Save and close handler for unsaved changes dialog
  const handleSaveAndClose = async () => {
    unsavedChangesDialog.hideDialog();
    await handleSave();
    if (!persistence.error) {
      onClose();
    }
  };

  // Delete operation with confirmation handling
  const handleDeleteWithConfirmation = async () => {
    // Check if confirmation is required from settings
    if (settings.confirmDeleteActions) {
      const dialogConfig = createDeleteConfirmationDialog(
        "Application",
        handleDeleteAndClose,
        deleteDialog.hideDialog
      );
      deleteDialog.showDialog(dialogConfig);
    } else {
      // Delete immediately without confirmation
      await handleDeleteAndClose();
    }
  };

  // Handle delete operation
  const handleDeleteAndClose = async () => {
    await persistence.delete();
    // Note: onClose is called via the persistence hook's onDelete callback
  };

  return (
    <ApplicationWindowContext.Provider
      value={{
        jobApplication: persistence.application,
        setJobApplication: (_job: JobApplication) => {
          // This is now handled by the persistence hook
          // We can either remove this or use it for specific cases
          console.warn("setJobApplication called - consider using persistence.updateField instead");
        },
        isEditing,
        setIsEditing,
        updateField: persistence.updateField,
        onStatusChange: handleStatusChange,
        isSaving: persistence.isLoading,
        error: persistence.error,
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-2xl"
          >
            <div className="rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col mx-4 overflow-hidden">
              {persistence.application && (
                <Header
                  onClose={handleCloseWithConfirmation}
                  onSave={handleSave}
                  onDelete={handleDeleteWithConfirmation}
                />
              )}
              <div className="flex-grow overflow-y-auto bg-white rounded-b-lg pt-0 -mt-[17vh] no-scrollbar">
                <div className="pt-[17vh] relative">
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.div
                        key="edit"
                        initial={{ opacity: 1, x: 500 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -500 }}
                        transition={{ duration: 0.3, ease: [0.85, 0, 0.15, 1] }}
                      >
                        <EditContent />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="view"
                        initial={{ opacity: 1, x: 500 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -500 }}
                        transition={{ duration: 0.3, ease: [0.85, 0, 0.15, 1] }}
                      >
                        <ViewContent />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog Components */}
      {unsavedChangesDialog.config && (
        <ConfirmationDialog
          isOpen={unsavedChangesDialog.isOpen}
          {...unsavedChangesDialog.config}
          onClose={
            unsavedChangesDialog.config.onClose ||
            unsavedChangesDialog.hideDialog
          }
        />
      )}

      {deleteDialog.config && (
        <ConfirmationDialog
          isOpen={deleteDialog.isOpen}
          {...deleteDialog.config}
          onClose={deleteDialog.config.onClose || deleteDialog.hideDialog}
        />
      )}

      {validationDialog.config && (
        <ConfirmationDialog
          isOpen={validationDialog.isOpen}
          {...validationDialog.config}
          onClose={
            validationDialog.config.onClose || validationDialog.hideDialog
          }
        />
      )}
    </ApplicationWindowContext.Provider>
  );
};

export default ApplicationWindow;
