import { useState } from "react";

/**
 * Configuration interface for the confirmation dialog.
 * Provides full control over dialog appearance and behavior.
 */
export interface DialogConfig {
  title: string;
  message?: string;
  children?: React.ReactNode;
  primaryButton: {
    text: string;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
  };
  secondaryButton: {
    text: string;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
  };
  onClose?: () => void;
}

/**
 * Generic confirmation dialog hook.
 * 
 * Design principles:
 * - Stateless: Each dialog call requires full configuration
 * - Instance-based: Multiple hooks per component for different dialog types
 * - Generic: No domain-specific logic or assumptions
 * - Simple: Minimal API surface focused on dialog state management
 * 
 * Usage:
 * ```tsx
 * const dialog = useConfirmationDialog();
 * 
 * // Show dialog
 * dialog.showDialog({
 *   title: "Delete Item",
 *   message: "Are you sure?",
 *   primaryButton: { text: "Cancel", onClick: dialog.hideDialog },
 *   secondaryButton: { text: "Delete", onClick: handleDelete }
 * });
 * 
 * // Render dialog
 * {dialog.config && (
 *   <ConfirmationDialog
 *     isOpen={dialog.isOpen}
 *     {...dialog.config}
 *     onClose={dialog.config.onClose || dialog.hideDialog}
 *   />
 * )}
 * ```
 * 
 * @returns Dialog control methods and configuration state
 */
export const useConfirmationDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<DialogConfig | null>(null);

  /**
   * Shows the confirmation dialog with the provided configuration.
   * Each call requires complete configuration (stateless approach).
   */
  const showDialog = (dialogConfig: DialogConfig) => {
    setConfig(dialogConfig);
    setIsOpen(true);
  };

  /**
   * Hides the dialog and clears configuration.
   */
  const hideDialog = () => {
    setIsOpen(false);
    setConfig(null);
  };

  return {
    isOpen,
    showDialog,
    hideDialog,
    config
  };
};
