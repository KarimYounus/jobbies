import { DialogConfig } from "../hooks/useConfirmationDialog";

/**
 * Dialog configuration factory utilities.
 * 
 * Design decisions:
 * - Factory functions for consistent dialog configurations
 * - Parameterized for flexibility while maintaining consistency
 * - Centralized styling classes for maintainability
 * - Clear naming conventions for different dialog types
 */

// Consistent button styling classes
const BUTTON_STYLES = {
  primary: "bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors font-medium",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors font-medium",
  danger: "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium",
  warning: "bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors font-medium",
} as const;

/**
 * Creates a confirmation dialog for unsaved changes.
 * 
 * @param onSave - Function to call when user chooses to save
 * @param onDiscard - Function to call when user chooses to discard changes
 * @param isSaving - Whether a save operation is in progress
 * @returns Dialog configuration object
 */
export const createUnsavedChangesDialog = (
  onSave: () => void,
  onDiscard: () => void,
  isSaving: boolean = false
): DialogConfig => ({
  title: "Unsaved Changes",
  message: "You have unsaved changes. Would you like to save before closing?",
  primaryButton: {
    text: "Save & Close",
    onClick: onSave,
    disabled: isSaving,
    className: BUTTON_STYLES.primary
  },
  secondaryButton: {
    text: "Discard Changes",
    onClick: onDiscard,
    className: BUTTON_STYLES.warning
  }
});

/**
 * Creates a confirmation dialog for delete operations.
 * 
 * @param itemName - Name of the item being deleted (e.g., "application", "CV")
 * @param onConfirm - Function to call when user confirms deletion
 * @param onCancel - Function to call when user cancels deletion
 * @param customMessage - Optional custom message (defaults to generic delete message)
 * @returns Dialog configuration object
 */
export const createDeleteConfirmationDialog = (
  itemName: string,
  onConfirm: () => void,
  onCancel: () => void,
  customMessage?: string
): DialogConfig => ({
  title: `Delete ${itemName}`,
  message: customMessage || `Are you sure you want to delete this ${itemName.toLowerCase()}? This action cannot be undone.`,
  primaryButton: {
    text: "Cancel",
    onClick: onCancel,
    className: BUTTON_STYLES.secondary
  },
  secondaryButton: {
    text: "Delete",
    onClick: onConfirm,
    className: BUTTON_STYLES.danger
  }
});

/**
 * Creates a validation error dialog for missing required fields.
 * 
 * @param missingFields - Array of missing field names
 * @param onContinueEditing - Function to call when user chooses to continue editing
 * @param onCancel - Optional function to call when user cancels (defaults to continue editing)
 * @returns Dialog configuration object
 */
export const createValidationErrorDialog = (
  missingFields: string[],
  onContinueEditing: () => void,
  onCancel?: () => void
): DialogConfig => ({
  title: "Missing Required Fields",
  primaryButton: {
    text: "Continue Editing",
    onClick: onContinueEditing,
    className: BUTTON_STYLES.primary
  },
  secondaryButton: {
    text: "Cancel",
    onClick: onCancel || onContinueEditing,
    className: BUTTON_STYLES.secondary
  },
  children: (
    <div className="space-y-2">
      <p className="text-gray-600 text-sm">
        The following fields are required:
      </p>
      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
        {missingFields.map((field) => (
          <li key={field}>{field}</li>
        ))}
      </ul>
      <p className="text-gray-600 text-sm mt-3">
        Please complete these fields before saving.
      </p>
    </div>
  )
});

/**
 * Creates a confirmation dialog for resetting settings to defaults.
 * 
 * @param onReset - Function to call when user confirms reset
 * @param onCancel - Function to call when user cancels reset
 * @param isSaving - Whether a reset operation is in progress
 * @returns Dialog configuration object
 */
export const createResetSettingsDialog = (
  onReset: () => void,
  onCancel: () => void,
  isSaving: boolean = false
): DialogConfig => ({
  title: "Reset to Defaults",
  message: "Are you sure you want to reset all settings to their default values? This action cannot be undone.",
  primaryButton: {
    text: "Reset",
    onClick: onReset,
    disabled: isSaving,
    className: BUTTON_STYLES.danger
  },
  secondaryButton: {
    text: "Cancel",
    onClick: onCancel,
    className: BUTTON_STYLES.secondary
  }
});

/**
 * Creates a generic confirmation dialog.
 * Use this for custom scenarios not covered by the specific factory functions.
 * 
 * @param config - Basic dialog configuration
 * @returns Dialog configuration object with consistent styling
 */
export const createGenericConfirmationDialog = (config: {
  title: string;
  message: string;
  primaryText: string;
  onPrimary: () => void;
  secondaryText: string;
  onSecondary: () => void;
  primaryStyle?: keyof typeof BUTTON_STYLES;
  secondaryStyle?: keyof typeof BUTTON_STYLES;
  primaryDisabled?: boolean;
  secondaryDisabled?: boolean;
}): DialogConfig => ({
  title: config.title,
  message: config.message,
  primaryButton: {
    text: config.primaryText,
    onClick: config.onPrimary,
    disabled: config.primaryDisabled,
    className: BUTTON_STYLES[config.primaryStyle || 'primary']
  },
  secondaryButton: {
    text: config.secondaryText,
    onClick: config.onSecondary,
    disabled: config.secondaryDisabled,
    className: BUTTON_STYLES[config.secondaryStyle || 'secondary']
  }
});

/**
 * Export button styles for consistency in custom dialogs
 */
export { BUTTON_STYLES };
