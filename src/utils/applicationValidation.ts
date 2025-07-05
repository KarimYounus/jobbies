import { JobApplication } from "../types/job-application-types";

/**
 * Utility functions for JobApplication validation and change detection.
 * 
 * Design decisions:
 * - Pure functions for testability and reusability
 * - Specific error messages for better UX
 * - Efficient change detection avoiding deep object comparison
 */

/**
 * Validates required fields in a job application.
 * 
 * @param application - The job application to validate
 * @returns Array of missing field names (empty if all required fields are present)
 */
export const validateRequiredFields = (
  application: JobApplication | null
): string[] => {
  if (!application) return [];

  const missingFields: string[] = [];
  
  // Check required fields with trimmed values to catch whitespace-only entries
  if (!application.company?.trim()) {
    missingFields.push("Company Name");
  }
  
  if (!application.position?.trim()) {
    missingFields.push("Position Title");
  }

  return missingFields;
};

/**
 * Detects if a job application has been modified compared to its initial state.
 * 
 * Design decisions:
 * - Uses shallow comparison for performance
 * - JSON.stringify for complex objects (questions array)
 * - Compares meaningful fields only (excludes id, dates that shouldn't trigger "changes")
 * 
 * @param current - Current application state
 * @param initial - Initial application state to compare against
 * @returns true if changes detected, false otherwise
 */
export const detectApplicationChanges = (
  current: JobApplication | null,
  initial: JobApplication | null
): boolean => {
  // Handle null states
  if (!current || !initial) return false;

  // Compare all editable fields that constitute meaningful changes
  return (
    current.company !== initial.company ||
    current.position !== initial.position ||
    current.description !== initial.description ||
    current.salary !== initial.salary ||
    current.location !== initial.location ||
    current.notes !== initial.notes ||
    current.link !== initial.link ||
    current.appliedVia !== initial.appliedVia ||
    current.coverLetter !== initial.coverLetter ||
    // Status comparison - compare the text identifier
    current.status.text !== initial.status.text ||
    // CV comparison - check if CV was changed (compare by id if exists)
    (current.cv?.id !== initial.cv?.id) ||
    // Questions array comparison - deep comparison needed
    JSON.stringify(current.questions || []) !== JSON.stringify(initial.questions || [])
  );
};

/**
 * Creates a validation result object with detailed information.
 * Useful for more complex validation scenarios.
 * 
 * @param application - The job application to validate
 * @returns Validation result object
 */
export interface ValidationResult {
  isValid: boolean;
  missingRequiredFields: string[];
  warnings: string[];
}

export const validateApplication = (
  application: JobApplication | null
): ValidationResult => {
  const missingRequiredFields = validateRequiredFields(application);
  const warnings: string[] = [];
  
  // Add warnings for commonly missed fields
  if (application) {
    if (!application.salary?.trim()) {
      warnings.push("Salary information is missing");
    }
    
    if (!application.location?.trim()) {
      warnings.push("Location information is missing");
    }
    
    if (!application.link?.trim()) {
      warnings.push("Job posting link is missing");
    }
  }
  
  return {
    isValid: missingRequiredFields.length === 0,
    missingRequiredFields,
    warnings
  };
};
