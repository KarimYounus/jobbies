import React, { useEffect, createContext, useState } from "react";
import Header from "./Header";
import ViewContent from "./ViewContent/ViewContent";
import EditContent from "./EditContent/EditContent";
import ConfirmationDialog from "../General/ConfirmationDialog";
import { motion, AnimatePresence } from "framer-motion";
import { JobApplication } from "../../types/job-application-types";
import { collectionHandler } from "../../data/CollectionHandler";
import { StatusItem } from "../../types/status-types";

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
  if (!job) return null;
  const [jobApplication, setJobApplication] = useState<JobApplication | null>(
    job
  );
  const [isEditing, setIsEditing] = useState(createNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialog state management
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
    useState(false);
  const [showRequiredFieldsDialog, setShowRequiredFieldsDialog] =
    useState(false);

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

  // Helper function to check for required fields
  const validateRequiredFields = (
    application: JobApplication | null
  ): string[] => {
    if (!application) return [];

    const missingFields: string[] = [];
    if (!application.company?.trim()) missingFields.push("Company Name");
    if (!application.position?.trim()) missingFields.push("Position Title");

    return missingFields;
  };

  // Helper function to detect changes
  const detectChanges = (
    current: JobApplication | null,
    initial: JobApplication | null
  ): boolean => {
    if (!current || !initial) return false;

    // Compare key fields that indicate meaningful changes
    return (
      current.company !== initial.company ||
      current.position !== initial.position ||
      current.description !== initial.description ||
      current.salary !== initial.salary ||
      current.location !== initial.location ||
      current.notes !== initial.notes ||
      current.link !== initial.link ||
      JSON.stringify(current.questions) !== JSON.stringify(initial.questions) ||
      current.status.text !== initial.status.text
    );
  };

  // Field update method for application data edits
  // This method updates a specific field in the job application state and tracks changes
  const updateField = (field: keyof JobApplication, value: any) => {
    setJobApplication((prev) => {
      if (!prev) return null;

      const updated = { ...prev, [field]: value };

      // Update change tracking
      setHasUnsavedChanges(detectChanges(updated, initialJobState));

      return updated;
    });
  };

  // Enhanced close handler with unsaved changes detection
  const handleCloseWithConfirmation = () => {
    if (isEditing && hasUnsavedChanges) {
      setShowUnsavedChangesDialog(true);
    } else {
      onClose();
    }
  };

  // Handle forced close (discard changes)
  const handleDiscardChanges = () => {
    setShowUnsavedChangesDialog(false);
    setHasUnsavedChanges(false);
    onClose();
  };

  // Separate handler for status changes
  // This method handles status changes and saves the updated application immediately
  const handleStatusChange = async (newStatus: StatusItem) => {
    if (!jobApplication || createNew) return; // Don't auto-save status changes for new applications

    try {
      const updatedJob = { ...jobApplication, status: newStatus };

      // Save immediately via CollectionHandler
      await collectionHandler.updateApplication(updatedJob);

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
      setShowRequiredFieldsDialog(true);
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      if (createNew) {
        // Creating a new application - use addApplication
        const savedApplication = await collectionHandler.addApplication(
          jobApplication
        );
        setJobApplication(savedApplication);
        setInitialJobState(savedApplication);
      } else {
        // Updating existing application - use updateApplication
        await collectionHandler.updateApplication(jobApplication);
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
    setShowUnsavedChangesDialog(false);
    await handleSave();
    if (!error) {
      onClose();
    }
  };

  // Delete operation
  const handleDeleteAndClose = async () => {
    if (!jobApplication) return;

    try {
      await collectionHandler.deleteApplication(jobApplication.id);
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col mx-4">
              {" "}
              {jobApplication && (
                <Header
                  onClose={handleCloseWithConfirmation}
                  onSave={handleSave}
                  onDelete={handleDeleteAndClose}
                />
              )}
              <div className="flex-grow overflow-y-auto">
                {isEditing ? <EditContent /> : <ViewContent />}
              </div>
            </div>{" "}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unsaved Changes Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showUnsavedChangesDialog}
        title="Unsaved Changes"
        message="You have unsaved changes. Would you like to save before closing?"
        onClose={() => setShowUnsavedChangesDialog(false)}
        primaryButton={{
          text: "Save & Close",
          onClick: handleSaveAndClose,
          disabled: isSaving,
        }}
        secondaryButton={{
          text: "Discard Changes",
          onClick: handleDiscardChanges,
          className:
            "bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors font-medium",
        }}
      />

      {/* Required Fields Validation Dialog */}
      <ConfirmationDialog
        isOpen={showRequiredFieldsDialog}
        title="Missing Required Fields"
        onClose={() => setShowRequiredFieldsDialog(false)}
        primaryButton={{
          text: "Continue Editing",
          onClick: () => setShowRequiredFieldsDialog(false),
        }}
        secondaryButton={{
          text: "Cancel",
          onClick: () => setShowRequiredFieldsDialog(false),
        }}
      >
        <div className="space-y-2">
          <p className="text-gray-600 text-sm">
            The following fields are required:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {validateRequiredFields(jobApplication).map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
          <p className="text-gray-600 text-sm mt-3">
            Please complete these fields before saving.
          </p>
        </div>
      </ConfirmationDialog>
    </ApplicationWindowContext.Provider>
  );
};

export default ApplicationWindow;
