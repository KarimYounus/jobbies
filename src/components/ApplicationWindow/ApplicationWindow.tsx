import React, { useEffect, createContext, useState } from "react";
import Header from "./Header";
import ViewContent from "./ViewContent/ViewContent";
import EditContent from "./EditContent/EditContent";
import ConfirmationDialog from "../General/ConfirmationDialog";
import { motion, AnimatePresence } from "framer-motion";
import { JobApplication } from "../../types/job-application-types";
import { applicationHandler } from "../../data/ApplicationHandler";
import { StatusItem } from "../../types/status-types";
import { useSettings } from "../SettingsWindow/SettingsContext";
import { useConfirmationDialog } from "../../hooks/useConfirmationDialog";
import {
  validateRequiredFields,
  detectApplicationChanges,
} from "../../utils/applicationValidation";
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

  const [jobApplication, setJobApplication] = useState<JobApplication | null>(
    job
  );
  const [isEditing, setIsEditing] = useState(createNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State to track unsaved changes and initial job state
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialJobState, setInitialJobState] = useState<JobApplication | null>(
    job
  );

  useEffect(() => {
    setJobApplication(job);
    setInitialJobState(job);
    setHasUnsavedChanges(false);
  }, [job]);

  // Field update method for application data edits
  // This method updates a specific field in the job application state and tracks changes
  const updateField = (field: keyof JobApplication, value: any) => {
    setJobApplication((prev) => {
      if (!prev) return null;

      const updated = { ...prev, [field]: value };

      // Update change tracking using utility function
      setHasUnsavedChanges(detectApplicationChanges(updated, initialJobState));

      return updated;
    });
  };

  // Enhanced close handler with unsaved changes detection
  const handleCloseWithConfirmation = () => {
    if (isEditing && hasUnsavedChanges) {
      const dialogConfig = createUnsavedChangesDialog(
        handleSaveAndClose,
        handleDiscardChanges,
        isSaving
      );
      unsavedChangesDialog.showDialog(dialogConfig);
    } else {
      onClose();
    }
  };

  // Handle forced close (discard changes)
  const handleDiscardChanges = () => {
    unsavedChangesDialog.hideDialog();
    setHasUnsavedChanges(false);
    onClose();
  };

  // Separate handler for status changes
  // This method handles status changes and saves the updated application immediately
  const handleStatusChange = async (newStatus: StatusItem) => {
    if (!jobApplication || createNew) return; // Don't auto-save status changes for new applications

    try {
      const updatedJob = { ...jobApplication, status: newStatus }; // Save immediately via ApplicationHandler
      await applicationHandler.updateApplication(updatedJob);

      // Update local state
      setJobApplication(updatedJob);
    } catch (err) {
      setError(
        `Failed to update status: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  }; // Explicit save for form edits (EditContent) with validation
  const handleSave = async () => {
    if (!jobApplication) return;

    // Check required fields first
    const missingFields = validateRequiredFields(jobApplication);
    if (missingFields.length > 0) {
      const dialogConfig = createValidationErrorDialog(
        missingFields,
        validationDialog.hideDialog
      );
      validationDialog.showDialog(dialogConfig);
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      if (createNew) {
        // Creating a new application - use addApplication
        const savedApplication = await applicationHandler.addApplication(
          jobApplication
        );
        setJobApplication(savedApplication);
        setInitialJobState(savedApplication);
      } else {
        // Updating existing application - use updateApplication
        await applicationHandler.updateApplication(jobApplication);
        setInitialJobState(jobApplication);
      }

      setHasUnsavedChanges(false);
      setIsEditing(false);
    } catch (err) {
      setError(
        `Failed to save: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Save and close handler for unsaved changes dialog
  const handleSaveAndClose = async () => {
    unsavedChangesDialog.hideDialog();
    await handleSave();
    if (!error) {
      onClose();
    }
  };

  // Delete operation
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

  // Handle delete and close
  const handleDeleteAndClose = async () => {
    if (!jobApplication) return;
    try {
      await applicationHandler.deleteApplication(jobApplication.id);
      onClose(); // Close window after successful deletion
    } catch (err) {
      setError(
        `Failed to delete: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
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
        error,
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
              {jobApplication && (
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
