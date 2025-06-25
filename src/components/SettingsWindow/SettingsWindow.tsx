import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSettings } from "./SettingsContext";
import SettingsHeader from "./SettingsHeader";
import SettingItem from "./SettingItem";
import ConfirmationDialog from "../General/ConfirmationDialog";
import { defaultStatusItems } from "../../types/status-types";

interface SettingsWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsWindow: React.FC<SettingsWindowProps> = ({ isOpen, onClose }) => {
  const { settings, updateSetting, resetToDefaults, isLoading, error } = useSettings();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Handler for setting changes with proper typing
  const handleSettingChange = async <K extends keyof typeof settings>(
    key: K,
    value: typeof settings[K]
  ) => {
    try {
      setIsSaving(true);
      await updateSetting(key, value);
    } catch (err) {
      console.error("Failed to update setting:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handler for reset to defaults
  const handleResetToDefaults = async () => {
    try {
      setIsSaving(true);
      await resetToDefaults();
      setShowResetDialog(false);
    } catch (err) {
      console.error("Failed to reset settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-2xl"
        >
          <div className="rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col mx-4 overflow-hidden bg-white">
            {/* Header */}
            <SettingsHeader 
              onClose={onClose}
              onReset={() => setShowResetDialog(true)}
              isSaving={isSaving}
              hasError={!!error}
            />

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-6 no-scrollbar">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500">Loading settings...</div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Application Behavior Section */}
                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                      Application Behavior
                    </h3>
                    <div className="space-y-4">
                      <SettingItem
                        type="toggle"
                        label="Auto-update old applications"
                        description="Automatically update old applications to 'No Response' status"
                        value={settings.autoUpdateEnabled}
                        onChange={(value: boolean) => handleSettingChange('autoUpdateEnabled', value)}
                        disabled={isSaving}
                      />
                      
                      <SettingItem
                        type="slider"
                        label="Auto-update interval"
                        description="Number of days before applications are auto-updated"
                        value={settings.autoUpdateInterval}
                        onChange={(value: number) => handleSettingChange('autoUpdateInterval', value)}
                        disabled={isSaving || !settings.autoUpdateEnabled}
                        min={1}
                        max={365}
                        unit="days"
                      />

                      <SettingItem
                        type="dropdown"
                        label="Default application status"
                        description="Default status for new job applications"
                        value={settings.defaultApplicationStatus}
                        onChange={(value: string) => handleSettingChange('defaultApplicationStatus', value)}
                        disabled={isSaving}
                        options={defaultStatusItems.map(status => ({
                          value: status.text,
                          label: status.text
                        }))}
                      />
                    </div>
                  </section>

                  {/* Data Management Section */}
                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                      Data Management
                    </h3>
                    <div className="space-y-4">
                      <SettingItem
                        type="toggle"
                        label="Enable data backup"
                        description="Automatically backup application data"
                        value={settings.dataBackupEnabled}
                        onChange={(value: boolean) => handleSettingChange('dataBackupEnabled', value)}
                        disabled={isSaving}
                      />

                      <SettingItem
                        type="toggle"
                        label="Confirm delete actions"
                        description="Show confirmation dialogs before deleting applications"
                        value={settings.confirmDeleteActions}
                        onChange={(value: boolean) => handleSettingChange('confirmDeleteActions', value)}
                        disabled={isSaving}
                      />
                    </div>
                  </section>

                  {/* Display Preferences Section */}
                  {/* <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                      Display Preferences
                    </h3>
                    <div className="space-y-4">
                      <SettingItem
                        type="dropdown"
                        label="Default sort field"
                        description="Default field to sort applications by"
                        value={settings.defaultSortPreference.field}
                        onChange={(value: string) => handleSettingChange('defaultSortPreference', {
                          ...settings.defaultSortPreference,
                          field: value as 'appliedDate' | 'company' | 'position'
                        })}
                        disabled={isSaving}
                        options={[
                          { value: 'appliedDate', label: 'Application Date' },
                          { value: 'company', label: 'Company Name' },
                          { value: 'position', label: 'Position Title' }
                        ]}
                      />

                      <SettingItem
                        type="dropdown"
                        label="Default sort order"
                        description="Default order to sort applications"
                        value={settings.defaultSortPreference.order}
                        onChange={(value: string) => handleSettingChange('defaultSortPreference', {
                          ...settings.defaultSortPreference,
                          order: value as 'asc' | 'desc'
                        })}
                        disabled={isSaving}
                        options={[
                          { value: 'desc', label: 'Newest first' },
                          { value: 'asc', label: 'Oldest first' }
                        ]}
                      />
                    </div>
                  </section> */}

                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="text-red-700 text-sm font-medium">
                        Settings Error
                      </div>
                      <div className="text-red-600 text-sm mt-1">{error}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Reset Confirmation Dialog */}
          <ConfirmationDialog
            isOpen={showResetDialog}
            title="Reset to Defaults"
            message="Are you sure you want to reset all settings to their default values? This action cannot be undone."
            onClose={() => setShowResetDialog(false)}
            primaryButton={{
              text: "Reset",
              onClick: handleResetToDefaults,
              disabled: isSaving,
              className: "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            }}
            secondaryButton={{
              text: "Cancel",
              onClick: () => setShowResetDialog(false)
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsWindow;
