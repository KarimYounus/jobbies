import { JobApplication } from "../types/job-application-types";
import { defaultStatusItems, StatusItem } from "../types/status-types";
import { SortConfig } from "../types/sort-types";

/**
 * Events emitted by the CollectionHandler for UI reactivity.
 * Components can listen to these events to update their state when data changes.
 */
export type ApplicationHandlerEvent =
  | "applications-loaded"
  | "application-added"
  | "application-updated"
  | "application-deleted"
  | "applications-auto-updated"
  | "data-error";

/**
 * Singleton class that manages job application data persistence and operations.
 *
 * This class provides a centralized way to handle all CRUD operations on job applications
 * while maintaining data persistence to a JSON file. It uses an in-memory cache for
 * performance and emits events for UI reactivity.
 *
 * Design decisions:
 * - Singleton pattern ensures single source of truth for data
 * - EventTarget mixin enables reactive UI updates without tight coupling
 * - Separate private methods for file operations maintain clean separation of concerns
 * - Graceful error handling with fallback to in-memory data prevents app crashes
 */
export class ApplicationHandler extends EventTarget {
  private static instance: ApplicationHandler | null = null;
  private applications: JobApplication[] = [];
  private applicationsByStatus: Map<StatusItem, JobApplication[]> = new Map();
  private isInitialized: boolean = false;
  private autoUpdateEnabled: boolean = true;
  private autoUpdateInterval: number = 30; // Default to 30 days
  private defaultStatus: StatusItem = defaultStatusItems[0]; // Default to first status

  /**
   * Private constructor to enforce singleton pattern.
   * The data file path is configurable to support different environments (dev/prod).
   */
  private constructor() {
    super();
  }

  /**
   * Gets the singleton instance of CollectionHandler.
   * Creates a new instance if none exists.
   */
  public static getInstance(): ApplicationHandler {
    if (!ApplicationHandler.instance) {
      ApplicationHandler.instance = new ApplicationHandler();
    }
    return ApplicationHandler.instance;
  }

  /**
   * Initializes the collection handler by loading data from the JSON file.
   * Falls back to placeholder data if file doesn't exist or is corrupted.
   * Should be called once when the application starts.
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }    try {
      await this.loadApplicationsFromFile();
      
      this.isInitialized = true;
      this.dispatchEvent(new CustomEvent("applications-loaded"));
      console.log("Applications loaded successfully from file.");

      console.log("Applications by status:", this.getApplicationsByStatus());
    } catch (error) {
      console.warn(
        "Failed to load applications from file", error);
      this.isInitialized = false;
      this.dispatchEvent(new CustomEvent("data-error", { detail: error }));
    }
  }

  /**
   * Generates a unique ID for a new job application.
   * Uses UUID v4 for guaranteed uniqueness across sessions.
   */
  private generateUniqueId(): string {
    // Simple UUID v4 implementation
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  /**
   * Formats salary input to ensure consistent display with £ prefix and comma separations.
   * Handles various input formats gracefully and returns formatted string or empty string.
   */
  private formatSalary(salary: string | undefined): string {
    if (!salary || salary.trim() === "") {
      return "";
    }

    // Remove existing £ symbol, spaces, and commas to get raw number
    const cleanSalary = salary.replace(/[£\s,]/g, "");

    // Check if it's a valid number
    const numericSalary = parseFloat(cleanSalary);
    if (isNaN(numericSalary) || numericSalary < 0) {
      return salary; // Return original if not a valid positive number
    }

    // Format with commas and £ prefix
    const formattedNumber = Math.round(numericSalary).toLocaleString("en-GB");
    return `£${formattedNumber}`;
  }

  /**
   * Creates a new job application object with required fields and auto-generated ID.
   * Useful for initializing forms or creating templates.
   */
  public createNewApplication(
    overrides: Partial<JobApplication> = {}
  ): JobApplication {
    const defaultApplication: JobApplication = {
      id: this.generateUniqueId(),
      company: "",
      position: "",
      status: this.defaultStatus,
      appliedDate: new Date().toISOString().split("T")[0],
      description: "",
      salary: "",
      location: "",
      notes: "",
      link: "",
      questions: [],
      ...overrides,
    };

    return defaultApplication;
  }

  /**
   * Gets all applications grouped by status.
   * This is the primary method for UI components to access organized data.
   */
  public getApplicationsByStatus(sortConfig?: SortConfig): Map<StatusItem, JobApplication[]> {
    if (!sortConfig) {
      return new Map(this.applicationsByStatus); // Return copy to prevent external mutations
    }

    const sortedByStatus = new Map<StatusItem, JobApplication[]>();
    
    for (const [status, applications] of this.applicationsByStatus) {
      const sortedApps = this.sortApplications(applications, sortConfig);
      sortedByStatus.set(status, sortedApps);
    }
    
    return sortedByStatus;
  }

  /**
   * Gets all applications as a flat array.
   * Useful for operations that need to work with all applications regardless of status.
   */
  public getAllApplications(): JobApplication[] {
    return [...this.applications]; // Return copy to prevent external mutations
  }

  /**
   * Gets a specific application by its ID.
   */
  public getApplicationById(id: string): JobApplication | undefined {
    return this.applications.find((app) => app.id === id);
  }

  /**
   * Sort utility function for job applications.
   * Handles date and company name sorting with configurable order.
   * 
   * Design decisions:
   * - Immutable sorting (creates new array) to maintain React optimization
   * - Case-insensitive company comparison for better UX
   * - Robust date parsing with fallback handling
   */
  private sortApplications(
    applications: JobApplication[], 
    config: SortConfig
  ): JobApplication[] {
    return [...applications].sort((a, b) => {
      let comparison = 0;
      
      switch (config.field) {
        case 'date':
          const dateA = new Date(a.appliedDate);
          const dateB = new Date(b.appliedDate);
          comparison = dateA.getTime() - dateB.getTime();
          break;
        case 'company':
          comparison = a.company.toLowerCase().localeCompare(b.company.toLowerCase());
          break;
        case 'position':
          comparison = a.position.toLowerCase().localeCompare(b.position.toLowerCase());
          break;
      }
      
      return config.order === 'desc' ? -comparison : comparison;
    });
  }

  /**
   * Adds a new job application to the collection.
   * Automatically generates ID if not provided and persists to file.
   * Formats salary input for consistent display.
   */
  public async addApplication(
    application: Omit<JobApplication, "id"> | JobApplication
  ): Promise<JobApplication> {
    // Auto-generate ID if not provided
    const applicationWithId: JobApplication =
      "id" in application && application.id
        ? (application as JobApplication)
        : { ...application, id: this.generateUniqueId() };

    // Format salary before saving
    if (applicationWithId.salary) {
      applicationWithId.salary = this.formatSalary(applicationWithId.salary);
    }

    // Ensure unique ID to prevent conflicts
    if (this.applications.some((app) => app.id === applicationWithId.id)) {
      throw new Error(
        `Application with ID ${applicationWithId.id} already exists`
      );
    }

    this.applications.push(applicationWithId);
    this.rebuildStatusGroups();

    try {
      await this.saveApplicationsToFile();
      this.dispatchEvent(
        new CustomEvent("application-added", { detail: applicationWithId })
      );
      return applicationWithId;
    } catch (error) {
      // Rollback in-memory changes if persistence fails
      this.applications = this.applications.filter(
        (app) => app.id !== applicationWithId.id
      );
      this.rebuildStatusGroups();
      throw error;
    }
  }
  /**
   * Updates an existing application in the collection.
   * Preserves the original if update fails to maintain data integrity.
   * Formats salary input for consistent display.
   */
  public async updateApplication(
    updatedApplication: JobApplication
  ): Promise<void> {
    const index = this.applications.findIndex(
      (app) => app.id === updatedApplication.id
    );
    if (index === -1) {
      throw new Error(`Application with ID ${updatedApplication.id} not found`);
    }

    // Format salary before saving
    if (updatedApplication.salary) {
      updatedApplication.salary = this.formatSalary(updatedApplication.salary);
    }

    const originalApplication = this.applications[index];
    this.applications[index] = updatedApplication;
    this.rebuildStatusGroups();

    try {
      await this.saveApplicationsToFile();
      this.dispatchEvent(
        new CustomEvent("application-updated", { detail: updatedApplication })
      );
    } catch (error) {
      // Rollback to original application if persistence fails
      this.applications[index] = originalApplication;
      this.rebuildStatusGroups();
      throw error;
    }
  }

  /**
   * Removes an application from the collection by ID.
   */
  public async deleteApplication(id: string): Promise<void> {
    const index = this.applications.findIndex((app) => app.id === id);
    if (index === -1) {
      throw new Error(`Application with ID ${id} not found`);
    }

    const deletedApplication = this.applications[index];
    this.applications.splice(index, 1);
    this.rebuildStatusGroups();

    try {
      await this.saveApplicationsToFile();
      this.dispatchEvent(
        new CustomEvent("application-deleted", { detail: deletedApplication })
      );
    } catch (error) {
      // Rollback deletion if persistence fails
      this.applications.splice(index, 0, deletedApplication);
      this.rebuildStatusGroups();
      throw error;
    }
  }

  /**
   * Rebuilds the status-grouped map from the current applications array.
   */
  private rebuildStatusGroups(): void {
    this.applicationsByStatus.clear();

    // Pre-populate with default status items to maintain order
    defaultStatusItems.forEach((status) => {
      this.applicationsByStatus.set(status, []);
    });

    this.applications.forEach((app) => {
      // Find matching status item by text field
      const matchingStatus = defaultStatusItems.find(
        (defaultStatus) => defaultStatus.text === app.status.text
      );

      if (!matchingStatus) {
        console.warn(
          `Status "${app.status.text}" not found in default statuses, skipping application:`,
          app.status
        );
        return;
      }

      // Use the reference from defaultStatusItems as the key
      this.applicationsByStatus.get(matchingStatus)!.push(app);
    });
  }

  /**
   * Loads applications from the JSON file via Electron IPC.
   */
  private async loadApplicationsFromFile(): Promise<void> {
    try {
      // Check if we're running in an Electron environment
      if (!window.electronAPI) {
        throw new Error("Electron API not available - running in browser mode");
      }

      const data = await window.electronAPI.loadApplications();

      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid data format from file");
      }

      this.applications = data as JobApplication[];
      this.rebuildStatusGroups();
    } catch (error) {
      throw new Error(`Failed to load applications from file: ${error}`);
    }
  }

  /**
   * Saves applications to the JSON file via Electron IPC.
   */
  private async saveApplicationsToFile(): Promise<void> {
    try {
      if (!window.electronAPI) {
        throw new Error("Electron API not available - running in browser mode");
      }
      await window.electronAPI.saveApplications(this.applications);
    } catch (error) {
      throw new Error(`Failed to save applications to file: ${error}`);
    }
  }

  /**
   * Automatically updates applications older than configured interval to 'No Response' status.
   * Only updates applications in 'applied' or 'in progress' states to avoid overwriting
   * final statuses like 'rejected' or 'offered'.
   * 
   * Design decisions:
   * - Configurable threshold based on settings
   * - Only updates non-final statuses to preserve user decisions
   * - Bulk update with single event emission for efficiency
   * - No file save to avoid performance impact during initialization
   */
  private async updateOldApplicationsStatus(): Promise<void> {
    // Skip if auto-update is disabled
    if (!this.autoUpdateEnabled) {
      return;
    }

    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - this.autoUpdateInterval);
    
    // Find 'No Response' status from defaults
    const noResponseStatus = defaultStatusItems[4] // No Response is the 5th item
    
    if (!noResponseStatus) {
      console.warn('No Response status not found in default statuses');
      return;
    }
    
    // Define statuses that should be auto-updated (not final states)
    const updatableStatusTexts = ['Applied', 'Assessment Stage'];
    const updatedApplications: Array<{company: string, position: string}> = [];
    
    this.applications.forEach(app => {
      const appliedDate = new Date(app.appliedDate);
      const isOld = appliedDate < thresholdDate;
      const isUpdatable = updatableStatusTexts.some(
        statusText => app.status.text.toLowerCase().includes(statusText.toLowerCase())
      );
      
      if (isOld && isUpdatable) {
        app.status = noResponseStatus;
        updatedApplications.push({
          company: app.company,
          position: app.position
        });
      }
    });
    
    if (updatedApplications.length > 0) {
      this.rebuildStatusGroups();
      console.log(`Auto-updated ${updatedApplications.length} old applications to 'No Response' status`);
      
      // Emit update event with detailed application info
      this.dispatchEvent(
        new CustomEvent("applications-auto-updated", { 
          detail: { 
            count: updatedApplications.length,
            applications: updatedApplications
          } 
        })
      );

      // Save the updated applications to file
      await this.saveApplicationsToFile().catch(error => {
        console.error('Failed to save auto-updated applications:', error);
      });
    }
  }

  /**
   * Manually triggers the automatic status update for old applications.
   * Useful for scheduled updates or user-triggered maintenance.
   * Persists changes to file unlike the initialization auto-update.
   */
  public async updateOldApplications(): Promise<number> {
    await this.updateOldApplicationsStatus();
    
    // Calculate how many were updated by checking for recent status changes
    const updatedCount = this.applications.filter(app => 
      app.status.text.toLowerCase().includes('no response')
    ).length;
    
    if (updatedCount > 0) {
      try {
        await this.saveApplicationsToFile();
        console.log(`Manually updated and saved ${updatedCount} old applications`);
      } catch (error) {
        console.error('Failed to save after manual update:', error);
        throw error;
      }
    }
    
    return updatedCount;
  }

  /**
   * Updates the auto-update configuration based on settings.
   * This method should be called when settings change to update behavior.
   */
  public updateAutoUpdateConfig(enabled: boolean, intervalDays: number): void {
    this.autoUpdateEnabled = enabled;
    this.autoUpdateInterval = intervalDays;
    console.log(`Auto-update enabled: ${this.autoUpdateEnabled}, Interval: ${this.autoUpdateInterval} days`);
  }

  /**
   * Sets the default status for new applications based on settings.
   */
  public updateDefaultStatus(statusText: string): void {
    const status = defaultStatusItems.find(item => item.text === statusText);
    if (status) {
      this.defaultStatus = status;
    }
  }

  /**
   * Triggers auto-update based on current settings.
   * This should be called when settings are updated to apply the new configuration.
   */
  public async triggerAutoUpdateFromSettings(): Promise<void> {
    if (this.autoUpdateEnabled) {
      console.log('Triggering auto-update from settings change');
      await this.updateOldApplicationsStatus();
    }
  }

  /**
   * Manual trigger for auto-update - useful for testing and manual maintenance
   * Returns the number of applications that were updated
   */
  public async manualAutoUpdate(): Promise<{ count: number; applications: Array<{ company: string; position: string }> }> {
    const initialApplications = this.applications.map(app => ({ ...app }));
    
    await this.updateOldApplicationsStatus();
    
    // Compare to see what changed
    const updatedApplications: Array<{ company: string; position: string }> = [];
    this.applications.forEach(app => {
      const original = initialApplications.find(orig => orig.id === app.id);
      if (original && original.status.text !== app.status.text && app.status.text.toLowerCase().includes('no response')) {
        updatedApplications.push({
          company: app.company,
          position: app.position
        });
      }
    });
    
    return {
      count: updatedApplications.length,
      applications: updatedApplications
    };
  }
}

/**
 * Export a singleton instance for immediate use.
 * This maintains backward compatibility with the existing export pattern.
 */
const applicationHandler = ApplicationHandler.getInstance();

/**
 * Backward compatibility export.
 * This allows existing code to continue working while we transition to the new class-based approach.
 */
export const applicationsByStatus = applicationHandler.getApplicationsByStatus();

/**
 * Export the singleton instance for use throughout the application.
 */
export { applicationHandler };
