/**
 * Application settings configuration interface.
 * Defines all user-configurable preferences for the job application manager.
 */
export interface SettingsConfig {
  // Auto-update behavior for old applications
  autoUpdateEnabled: boolean;
  autoUpdateInterval: number; // in days

  // Data management preferences
  dataBackupEnabled: boolean;
  confirmDeleteActions: boolean;

  // Default application behavior
  defaultApplicationStatus: string;
  defaultSortPreference: {
    field: 'appliedDate' | 'company' | 'position';
    order: 'asc' | 'desc';
  };

  // Theme preferences
  theme: 'light' | 'dark';
}

/**
 * Default settings configuration.
 * Provides sensible defaults for new installations and fallback values.
 */
export const defaultSettings: SettingsConfig = {
  autoUpdateEnabled: true,
  autoUpdateInterval: 30,
  dataBackupEnabled: true,
  defaultApplicationStatus: 'Applied',
  confirmDeleteActions: true,
  defaultSortPreference: {
    field: 'appliedDate',
    order: 'desc'
  },
  theme: 'light'
};

/**
 * Settings validation helper functions.
 */
export const validateSettings = (settings: Partial<SettingsConfig>): SettingsConfig => {
  return {
    autoUpdateEnabled: settings.autoUpdateEnabled ?? defaultSettings.autoUpdateEnabled,
    autoUpdateInterval: Math.max(1, Math.min(365, settings.autoUpdateInterval ?? defaultSettings.autoUpdateInterval)),
    dataBackupEnabled: settings.dataBackupEnabled ?? defaultSettings.dataBackupEnabled,
    defaultApplicationStatus: settings.defaultApplicationStatus ?? defaultSettings.defaultApplicationStatus,
    confirmDeleteActions: settings.confirmDeleteActions ?? defaultSettings.confirmDeleteActions,
    defaultSortPreference: {
      field: settings.defaultSortPreference?.field ?? defaultSettings.defaultSortPreference.field,
      order: settings.defaultSortPreference?.order ?? defaultSettings.defaultSortPreference.order
    },
    theme: settings.theme === 'dark' || settings.theme === 'light' ? settings.theme : defaultSettings.theme
  };
};
