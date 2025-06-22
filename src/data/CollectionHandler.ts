import { JobApplication } from "../types/job-application-types";
import { applicationCollection } from "./application-collection";

/**
 * Events emitted by the CollectionHandler for UI reactivity.
 * Components can listen to these events to update their state when data changes.
 */
export type CollectionHandlerEvent = 
  | 'applications-loaded'
  | 'application-added' 
  | 'application-updated'
  | 'application-deleted'
  | 'data-error';

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
export class CollectionHandler extends EventTarget {
  private static instance: CollectionHandler | null = null;
  private applications: JobApplication[] = [];
  private applicationsByStatus: Map<string, JobApplication[]> = new Map();
  private readonly dataFilePath: string;
  private isInitialized: boolean = false;

  /**
   * Private constructor to enforce singleton pattern.
   * The data file path is configurable to support different environments (dev/prod).
   */
  private constructor(dataFilePath: string = 'job-applications.json') {
    super();
    this.dataFilePath = dataFilePath;
  }

  /**
   * Gets the singleton instance of CollectionHandler.
   * Creates a new instance if none exists.
   */
  public static getInstance(dataFilePath?: string): CollectionHandler {
    if (!CollectionHandler.instance) {
      CollectionHandler.instance = new CollectionHandler(dataFilePath);
    }
    return CollectionHandler.instance;
  }

  /**
   * Initializes the collection handler by loading data from the JSON file.
   * Falls back to placeholder data if file doesn't exist or is corrupted.
   * Should be called once when the application starts.
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      await this.loadApplicationsFromFile();
      this.isInitialized = true;
      this.dispatchEvent(new CustomEvent('applications-loaded'));
      console.log('Applications loaded successfully from file.');

      console.log('Applications by status:', this.getApplicationsByStatus());
    } catch (error) {
      console.warn('Failed to load applications from file, using fallback data:', error);
      // Fallback to placeholder data for development
      this.applications = [...applicationCollection];
      this.rebuildStatusGroups();
      this.isInitialized = true;
      this.dispatchEvent(new CustomEvent('data-error', { detail: error }));
    }
  }

  /**
   * Gets all applications grouped by status.
   * This is the primary method for UI components to access organized data.
   */
  public getApplicationsByStatus(): Map<string, JobApplication[]> {
    return new Map(this.applicationsByStatus); // Return copy to prevent external mutations
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
    return this.applications.find(app => app.id === id);
  }

  /**
   * Adds a new job application to the collection.
   * Automatically persists to file and updates UI via events.
   */
  public async addApplication(application: JobApplication): Promise<void> {
    // Ensure unique ID to prevent conflicts
    if (this.applications.some(app => app.id === application.id)) {
      throw new Error(`Application with ID ${application.id} already exists`);
    }

    this.applications.push(application);
    this.rebuildStatusGroups();
    
    try {
      await this.saveApplicationsToFile();
      this.dispatchEvent(new CustomEvent('application-added', { detail: application }));
    } catch (error) {
      // Rollback in-memory changes if persistence fails
      this.applications = this.applications.filter(app => app.id !== application.id);
      this.rebuildStatusGroups();
      throw error;
    }
  }

  /**
   * Updates an existing application in the collection.
   * Preserves the original if update fails to maintain data integrity.
   */
  public async updateApplication(updatedApplication: JobApplication): Promise<void> {
    const index = this.applications.findIndex(app => app.id === updatedApplication.id);
    if (index === -1) {
      throw new Error(`Application with ID ${updatedApplication.id} not found`);
    }

    const originalApplication = this.applications[index];
    this.applications[index] = updatedApplication;
    this.rebuildStatusGroups();

    try {
      await this.saveApplicationsToFile();
      this.dispatchEvent(new CustomEvent('application-updated', { detail: updatedApplication }));
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
    const index = this.applications.findIndex(app => app.id === id);
    if (index === -1) {
      throw new Error(`Application with ID ${id} not found`);
    }

    const deletedApplication = this.applications[index];
    this.applications.splice(index, 1);
    this.rebuildStatusGroups();

    try {
      await this.saveApplicationsToFile();
      this.dispatchEvent(new CustomEvent('application-deleted', { detail: deletedApplication }));
    } catch (error) {
      // Rollback deletion if persistence fails
      this.applications.splice(index, 0, deletedApplication);
      this.rebuildStatusGroups();
      throw error;
    }
  }

  /**
   * Rebuilds the status-grouped map from the current applications array.
   * This private method maintains the grouped data structure efficiency.
   */
  private rebuildStatusGroups(): void {
    this.applicationsByStatus.clear();
    
    this.applications.forEach(app => {
      const status = app.status.text;
      
      if (!this.applicationsByStatus.has(status)) {
        this.applicationsByStatus.set(status, []);
      }
      
      this.applicationsByStatus.get(status)!.push(app);
    });
  }

  /**
   * Loads applications from the JSON file via Electron IPC.
   */
  private async loadApplicationsFromFile(): Promise<void> {

    try {
      // Check if we're running in an Electron environment
      if (!window.electronAPI) {
        throw new Error('Electron API not available - running in browser mode');
      }

      const data = await window.electronAPI.loadApplications();

      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format from file');
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
        throw new Error('Electron API not available - running in browser mode');
      }
      await window.electronAPI.saveApplications(this.applications);
    } catch (error) {
      throw new Error(`Failed to save applications to file: ${error}`);
    }
  }
}

/**
 * Export a singleton instance for immediate use.
 * This maintains backward compatibility with the existing export pattern.
 */
const collectionHandler = CollectionHandler.getInstance();

/**
 * Backward compatibility export.
 * This allows existing code to continue working while we transition to the new class-based approach.
 */
export const applicationsByStatus = collectionHandler.getApplicationsByStatus();

/**
 * Export the singleton instance for use throughout the application.
 */
export { collectionHandler };
