import { useState, useEffect, useCallback } from "react";
import { JobApplication } from "../types/job-application-types";
import { StatusItem } from "../types/status-types";
import { applicationHandler } from "../data/ApplicationHandler";
import { validateRequiredFields, detectApplicationChanges } from "../utils/applicationValidation";

/**
 * Hook configuration options
 */
interface UseApplicationPersistenceOptions {
  initialApplication: JobApplication | null;
  isNewApplication?: boolean;
  onSave?: (application: JobApplication) => void;
  onDelete?: () => void;
  onStatusChange?: (application: JobApplication) => void;
}

/**
 * Hook return interface
 */
interface UseApplicationPersistenceReturn {
  // Current state
  application: JobApplication | null;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  error: string | null;
  validationErrors: string[];
  
  // Operations
  updateField: (field: keyof JobApplication, value: any) => void;
  save: () => Promise<boolean>;
  delete: () => Promise<boolean>;
  updateStatus: (status: StatusItem) => Promise<boolean>;
  discardChanges: () => void;
  
  // Utility
  clearError: () => void;
  reset: () => void;
  canSave: boolean;
}

/**
 * Custom hook for managing JobApplication persistence operations.
 * 
 * Design decisions:
 * - Separates persistence logic from UI components
 * - Handles both create and update scenarios
 * - Provides comprehensive error handling and validation
 * - Maintains change tracking for unsaved changes detection
 * - Returns boolean success indicators for operations
 * 
 * @param options - Configuration options for the hook
 * @returns Hook interface with state and operations
 */
export const useApplicationPersistence = (
  options: UseApplicationPersistenceOptions
): UseApplicationPersistenceReturn => {
  const {
    initialApplication,
    isNewApplication = false,
    onSave,
    onDelete,
    onStatusChange
  } = options;

  // Internal state management
  const [application, setApplication] = useState<JobApplication | null>(initialApplication);
  const [initialState, setInitialState] = useState<JobApplication | null>(initialApplication);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Update state when initial application changes
  useEffect(() => {
    setApplication(initialApplication);
    setInitialState(initialApplication);
    setHasUnsavedChanges(false);
    setError(null);
    setValidationErrors([]);
  }, [initialApplication]);

  // Computed property for save availability
  const canSave = Boolean(application && !isLoading);

  /**
   * Updates a specific field in the application and tracks changes
   */
  const updateField = useCallback((field: keyof JobApplication, value: any) => {
    setApplication((prev) => {
      if (!prev) return null;

      const updated = { ...prev, [field]: value };
      
      // Update change tracking using utility function
      setHasUnsavedChanges(detectApplicationChanges(updated, initialState));
      
      return updated;
    });
  }, [initialState]);

  /**
   * Validates the current application and updates validation errors
   * @returns true if validation passes, false otherwise
   */
  const validateApplication = useCallback((): boolean => {
    if (!application) {
      setValidationErrors([]);
      return false;
    }

    const missingFields = validateRequiredFields(application);
    setValidationErrors(missingFields);
    return missingFields.length === 0;
  }, [application]);

  /**
   * Saves the current application (create or update)
   * @returns Promise<boolean> - true if save was successful
   */
  const save = useCallback(async (): Promise<boolean> => {
    if (!application) return false;

    // Validate before saving
    if (!validateApplication()) {
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      let savedApplication: JobApplication;

      if (isNewApplication) {
        // Creating a new application
        savedApplication = await applicationHandler.addApplication(application);
      } else {
        // Updating existing application
        await applicationHandler.updateApplication(application);
        savedApplication = application;
      }

      // Update internal state after successful save
      setApplication(savedApplication);
      setInitialState(savedApplication);
      setHasUnsavedChanges(false);
      setValidationErrors([]);

      // Call success callback
      onSave?.(savedApplication);

      return true;
    } catch (err) {
      const errorMessage = `Failed to save: ${
        err instanceof Error ? err.message : "Unknown error"
      }`;
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [application, isNewApplication, validateApplication, onSave]);

  /**
   * Deletes the current application
   * @returns Promise<boolean> - true if delete was successful
   */
  const deleteApplication = useCallback(async (): Promise<boolean> => {
    if (!application) return false;

    try {
      setIsLoading(true);
      setError(null);

      await applicationHandler.deleteApplication(application.id);

      // Call success callback
      onDelete?.();

      return true;
    } catch (err) {
      const errorMessage = `Failed to delete: ${
        err instanceof Error ? err.message : "Unknown error"
      }`;
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [application, onDelete]);

  /**
   * Updates the application status with immediate persistence
   * @param status - New status to apply
   * @returns Promise<boolean> - true if update was successful
   */
  const updateStatus = useCallback(async (status: StatusItem): Promise<boolean> => {
    if (!application || isNewApplication) return false;

    try {
      setIsLoading(true);
      setError(null);

      const updatedApplication = { ...application, status };
      await applicationHandler.updateApplication(updatedApplication);

      // Update local state
      setApplication(updatedApplication);
      
      // Note: We don't update initialState here since status changes
      // are considered immediate saves, not part of form editing
      
      // Call success callback
      onStatusChange?.(updatedApplication);

      return true;
    } catch (err) {
      const errorMessage = `Failed to update status: ${
        err instanceof Error ? err.message : "Unknown error"
      }`;
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [application, isNewApplication, onStatusChange]);

  /**
   * Discards current changes and reverts to initial state
   */
  const discardChanges = useCallback(() => {
    setApplication(initialState);
    setHasUnsavedChanges(false);
    setError(null);
    setValidationErrors([]);
  }, [initialState]);

  /**
   * Clears the current error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Resets the hook to its initial state
   */
  const reset = useCallback(() => {
    setApplication(initialApplication);
    setInitialState(initialApplication);
    setHasUnsavedChanges(false);
    setIsLoading(false);
    setError(null);
    setValidationErrors([]);
  }, [initialApplication]);

  return {
    // State
    application,
    hasUnsavedChanges,
    isLoading,
    error,
    validationErrors,
    
    // Operations
    updateField,
    save,
    delete: deleteApplication,
    updateStatus,
    discardChanges,
    
    // Utility
    clearError,
    reset,
    canSave
  };
};
