import React from "react";
import Icon from "@mdi/react";
import { mdiClose, mdiRestore, mdiLoading, mdiCogOutline } from "@mdi/js";
import AnimatedButton from "../General/AnimatedButton";
import { motion } from "framer-motion";

interface SettingsHeaderProps {
  onClose: () => void;
  onReset: () => void;
  isSaving: boolean;
  hasError: boolean;
}

/**
 * Settings window header component.
 * Provides title, close action, and reset functionality.
 *
 * Design decisions:
 * - Consistent styling with ApplicationWindow header
 * - Visual feedback for saving state and errors
 * - Clear action buttons with icons for better UX
 */
const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  onClose,
  onReset,
  isSaving,
  hasError,
}) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
      {/* Title Section */}
      <div className="flex items-center space-x-3">
        <motion.div
          className="p-2 bg-teal-100/50 rounded-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon path={mdiCogOutline} size={1.5} className="text-gray-600" />
        </motion.div>
        <h2 className="text-xl font-semibold text-gray-800">Settings</h2>

        {/* Status Indicators */}
        {isSaving && (
          <div className="flex items-center space-x-2 text-blue-600">
            <Icon path={mdiLoading} size={0.8} className="animate-spin" />
            <span className="text-sm">Saving...</span>
          </div>
        )}

        {hasError && (
          <div className="text-red-600 text-sm font-medium">Error occurred</div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        {/* Reset to Defaults Button */}
        <AnimatedButton
          onClick={onReset}
          className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-800 hover:bg-orange-300 rounded-md transition-colors"
          icon={mdiRestore}
          caption="Reset Settings"
          disabled={isSaving}
        />

        {/* Close Button */}
        <AnimatedButton
          onClick={onClose}
          className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-800 hover:bg-red-100 rounded-full transition-colors"
          icon={mdiClose}
          caption="Close"
        />
      </div>
    </div>
  );
};

export default SettingsHeader;
