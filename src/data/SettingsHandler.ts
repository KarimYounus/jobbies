import { SettingsConfig, defaultSettings, validateSettings } from "../types/settings-types";

/**
 * Events emitted by the SettingsHandler for UI reactivity.
 * Components can listen to these events to update their state when settings change.
 */
export type SettingsHandlerEvent =
  | "settings-loaded"
  | "settings-updated"
  | "settings-error";

/**
 * Singleton class that manages application settings persistence and operations.
 *
 * This class provides a centralized way to handle settings CRUD operations
 * while maintaining data persistence to a JSON file. It uses an in-memory cache for
 * performance and emits events for UI reactivity.
 *
 * Design decisions:
 * - Singleton pattern ensures single source of truth for settings
 * - EventTarget mixin enables reactive UI updates without tight coupling
 * - Validation layer ensures settings integrity and safe defaults
 * - Graceful error handling with fallback to default settings
 */
export class SettingsHandler extends EventTarget {
  private static instance: SettingsHandler | null = null;
  private settings: SettingsConfig = { ...defaultSettings };
  private isInitialized: boolean = false;

  /**
   * Private constructor to enforce singleton pattern.
   */
  private constructor() {
    super();
  }

  /**
   * Gets the singleton instance of SettingsHandler.
   * Creates a new instance if none exists.
   */
  public static getInstance(): SettingsHandler {
    if (!SettingsHandler.instance) {
      SettingsHandler.instance = new SettingsHandler();
    }
    return SettingsHandler.instance;
  }

  /**
   * Initializes the settings handler by loading data from the JSON file.
   * Falls back to default settings if file doesn't exist or is corrupted.
   * Should be called once when the application starts.
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      await this.loadSettingsFromFile();
      this.isInitialized = true;
      this.dispatchEvent(new CustomEvent("settings-loaded"));
      console.log("Settings loaded successfully from file.");
    } catch (error) {
      console.warn(
        "Failed to load settings from file, using default settings:",
        error
      );
      
      // Fallback to default settings
      this.settings = { ...defaultSettings };
      this.isInitialized = true;
      this.dispatchEvent(new CustomEvent("settings-error", { detail: error }));
    }
  }

  /**
   * Gets the current settings configuration.
   * Returns a copy to prevent external mutations.
   */
  public getSettings(): SettingsConfig {
    return { ...this.settings };
  }

  /**
   * Gets a specific setting value by key.
   */
  public getSetting<K extends keyof SettingsConfig>(key: K): SettingsConfig[K] {
    return this.settings[key];
  }

  /**
   * Updates a single setting and persists the change.
   */
  public async updateSetting<K extends keyof SettingsConfig>(
    key: K,
    value: SettingsConfig[K]
  ): Promise<void> {
    const oldSettings = { ...this.settings };
    
    // Update the setting
    this.settings[key] = value;
    
    // Validate the updated settings
    this.settings = validateSettings(this.settings);

    try {
      await this.saveSettingsToFile();
      this.dispatchEvent(
        new CustomEvent("settings-updated", { 
          detail: { key, oldValue: oldSettings[key], newValue: value }
        })
      );
    } catch (error) {
      // Rollback on failure
      this.settings = oldSettings;
      throw error;
    }
  }

  /**
   * Updates multiple settings at once and persists the changes.
   */
  public async updateSettings(updates: Partial<SettingsConfig>): Promise<void> {
    const oldSettings = { ...this.settings };
    
    // Apply updates
    Object.assign(this.settings, updates);
    
    // Validate the updated settings
    this.settings = validateSettings(this.settings);

    try {
      await this.saveSettingsToFile();
      this.dispatchEvent(
        new CustomEvent("settings-updated", { 
          detail: { updates, oldSettings }
        })
      );
    } catch (error) {
      // Rollback on failure
      this.settings = oldSettings;
      throw error;
    }
  }

  /**
   * Resets all settings to their default values.
   */
  public async resetToDefaults(): Promise<void> {
    const oldSettings = { ...this.settings };
    this.settings = { ...defaultSettings };

    try {
      await this.saveSettingsToFile();
      this.dispatchEvent(
        new CustomEvent("settings-updated", { 
          detail: { reset: true, oldSettings }
        })
      );
    } catch (error) {
      // Rollback on failure
      this.settings = oldSettings;
      throw error;
    }
  }

  /**
   * Loads settings from the JSON file via Electron IPC.
   */
  private async loadSettingsFromFile(): Promise<void> {
    try {
      // Check if we're running in an Electron environment
      if (!window.electronAPI) {
        throw new Error("Electron API not available - running in browser mode");
      }

      const data = await window.electronAPI.loadSettings();
      
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid settings data format from file");
      }

      // Validate and merge with defaults
      this.settings = validateSettings(data as Partial<SettingsConfig>);
    } catch (error) {
      throw new Error(`Failed to load settings from file: ${error}`);
    }
  }

  /**
   * Saves settings to the JSON file via Electron IPC.
   */
  private async saveSettingsToFile(): Promise<void> {
    try {
      if (!window.electronAPI) {
        throw new Error("Electron API not available - running in browser mode");
      }
      
      await window.electronAPI.saveSettings(this.settings);
    } catch (error) {
      throw new Error(`Failed to save settings to file: ${error}`);
    }
  }
}

/**
 * Export a singleton instance for immediate use.
 * This maintains consistency with ApplicationHandler patterns.
 */
export const settingsHandler = SettingsHandler.getInstance();
