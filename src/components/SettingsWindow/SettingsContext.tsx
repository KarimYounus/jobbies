import React, { createContext, useContext, useEffect, useState } from "react";
import { SettingsConfig } from "../../types/settings-types";
import { settingsHandler } from "../../data/SettingsHandler";

/**
 * Settings context interface for providing settings state and operations
 * throughout the application component tree.
 */
interface SettingsContextType {
  settings: SettingsConfig;
  updateSetting: <K extends keyof SettingsConfig>(
    key: K,
    value: SettingsConfig[K]
  ) => Promise<void>;
  updateSettings: (updates: Partial<SettingsConfig>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Settings context for sharing settings state across components.
 */
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/**
 * Settings context provider component.
 * Manages settings state and provides reactive updates to child components.
 * 
 * Design decisions:
 * - Initializes settings handler on mount
 * - Listens to settings handler events for reactive updates
 * - Provides centralized error handling for settings operations
 * - Maintains loading state during settings operations
 */
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<SettingsConfig>(
    settingsHandler.getSettings()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize settings and set up event listeners
  useEffect(() => {
    const initializeSettings = async () => {
      try {
        await settingsHandler.initialize();
        setSettings(settingsHandler.getSettings());
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load settings"
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Event handlers for reactive updates
    const handleSettingsLoaded = () => {
      setSettings(settingsHandler.getSettings());
      setIsLoading(false);
      setError(null);
    };

    const handleSettingsUpdated = () => {
      setSettings(settingsHandler.getSettings());
      setError(null);
    };

    const handleSettingsError = (event: Event) => {
      const customEvent = event as CustomEvent;
      setError(
        customEvent.detail instanceof Error
          ? customEvent.detail.message
          : "Settings error occurred"
      );
      setIsLoading(false);
    };

    // Register event listeners
    settingsHandler.addEventListener("settings-loaded", handleSettingsLoaded);
    settingsHandler.addEventListener("settings-updated", handleSettingsUpdated);
    settingsHandler.addEventListener("settings-error", handleSettingsError);

    initializeSettings();

    // Cleanup event listeners
    return () => {
      settingsHandler.removeEventListener("settings-loaded", handleSettingsLoaded);
      settingsHandler.removeEventListener("settings-updated", handleSettingsUpdated);
      settingsHandler.removeEventListener("settings-error", handleSettingsError);
    };
  }, []);

  // Wrapper functions that handle loading state and errors
  const updateSetting = async <K extends keyof SettingsConfig>(
    key: K,
    value: SettingsConfig[K]
  ) => {
    try {
      setError(null);
      await settingsHandler.updateSetting(key, value);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update setting"
      );
      throw err;
    }
  };

  const updateSettings = async (updates: Partial<SettingsConfig>) => {
    try {
      setError(null);
      await settingsHandler.updateSettings(updates);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update settings"
      );
      throw err;
    }
  };

  const resetToDefaults = async () => {
    try {
      setError(null);
      await settingsHandler.resetToDefaults();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reset settings"
      );
      throw err;
    }
  };

  const contextValue: SettingsContextType = {
    settings,
    updateSetting,
    updateSettings,
    resetToDefaults,
    isLoading,
    error,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

/**
 * Custom hook for consuming settings context.
 * Provides type-safe access to settings state and operations.
 * 
 * @throws Error if used outside of SettingsProvider
 */
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
