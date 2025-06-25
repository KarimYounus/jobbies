import { useEffect } from "react";
import { applicationHandler } from "../data/ApplicationHandler";
import { SettingsConfig } from "../types/settings-types";
import { SortConfig } from "../types/sort-types";

/**
 * Custom hook for integrating settings with the ApplicationHandler.
 * 
 * Handles:
 * - Auto-update configuration updates
 * - Default status updates
 * - Auto-update triggering when settings change
 * - Default sort preference application
 */
export const useSettingsIntegration = (
  settings: SettingsConfig | null,
  sortConfig: SortConfig | null,
  setSortConfig: (config: SortConfig) => void
) => {
  useEffect(() => {
    const applySettings = async () => {
      if (!settings) return;

      console.log('Updating ApplicationHandler with settings:', settings);
      
      // Update auto-update configuration
      applicationHandler.updateAutoUpdateConfig(
        settings.autoUpdateEnabled,
        settings.autoUpdateInterval
      );

      // Update default status for new applications
      applicationHandler.updateDefaultStatus(settings.defaultApplicationStatus);

      // Trigger auto-update if enabled
      try {
        await applicationHandler.triggerAutoUpdateFromSettings();
      } catch (error) {
        console.error('Failed to trigger auto-update from settings:', error);
      }

      // Apply default sort preference if no sort config is set
      if (!sortConfig && settings.defaultSortPreference) {
        const fieldMapping: Record<string, 'date' | 'company' | 'position'> = {
          'appliedDate': 'date',
          'company': 'company',
          'position': 'position'
        };

        const mappedField = fieldMapping[settings.defaultSortPreference.field] || 'date';
        
        console.log('Applying default sort preference:', {
          original: settings.defaultSortPreference,
          mapped: { field: mappedField, order: settings.defaultSortPreference.order }
        });
        
        setSortConfig({
          field: mappedField,
          order: settings.defaultSortPreference.order
        });
      }
    };

    applySettings();
  }, [settings, sortConfig, setSortConfig]);
};
