import { CurriculumVitae } from "../types/job-application-types";
import { cvCollection } from "./cv-collection";

/**
 * Events emitted by the CVHandler for UI reactivity.
 * Components can listen to these events to update their state when CV data changes.
 */
export type CVHandlerEvent = 
  | 'cvs-loaded'
  | 'cv-added' 
  | 'cv-updated'
  | 'cv-deleted'
  | 'cv-data-error';

/**
 * Singleton class that manages CV data persistence and file operations.
 * 
 * This class provides centralized management for CV collection with dedicated
 * asset handling for images and PDFs. It follows the same patterns as 
 * ApplicationHandler for consistency.
 * 
 * Design decisions:
 * - Singleton pattern ensures single source of truth for CV data
 * - EventTarget mixin enables reactive UI updates
 * - Dedicated asset directory structure for file organization
 * - Graceful error handling with fallback to in-memory data
 */
export class CVHandler extends EventTarget {
  private static instance: CVHandler | null = null;
  private cvs: CurriculumVitae[] = [];
  private readonly dataFilePath: string;
  private readonly assetsPath: string;
  private isInitialized: boolean = false;

  /**
   * Private constructor to enforce singleton pattern.
   * Configures file paths for CV data and assets.
   */
  private constructor() {
    super();
    this.dataFilePath = 'cv-collection.json';
    this.assetsPath = 'cv-assets';
  }

  /**
   * Gets the singleton instance of CVHandler.
   * Creates a new instance if none exists.
   */
  public static getInstance(): CVHandler {
    if (!CVHandler.instance) {
      CVHandler.instance = new CVHandler();
    }
    return CVHandler.instance;
  }  /**
   * Initializes the CV handler by loading data from the JSON file.
   * Falls back to placeholder data if file doesn't exist or is corrupted.
   * Should be called once when the application starts.
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Ensure CV assets directory structure exists
      if (window.electronAPI) {
        await window.electronAPI.ensureCVAssets();
      }

      await this.loadCVsFromFile();
      this.isInitialized = true;
      this.dispatchEvent(new CustomEvent('cvs-loaded'));
    } catch (error) {
      console.warn('Failed to load CVs from file, using fallback data:', error);
      // Fallback to placeholder data for development
      this.cvs = [...cvCollection];
      this.isInitialized = true;
      this.dispatchEvent(new CustomEvent('cv-data-error', { detail: error }));
    }
  }

  /**
   * Gets all CVs as a flat array.
   * Returns a copy to prevent external mutations.
   */
  public getAllCVs(): CurriculumVitae[] {
    return [...this.cvs];
  }

  /**
   * Gets a specific CV by its ID.
   */
  public getCVById(id: string): CurriculumVitae | undefined {
    return this.cvs.find(cv => cv.id === id);
  }

  /**
   * Adds a new CV to the collection.
   * Automatically persists to file and updates UI via events.
   */
  public async addCV(cv: CurriculumVitae): Promise<void> {
    // Ensure unique ID to prevent conflicts
    if (this.cvs.some(existingCV => existingCV.id === cv.id)) {
      throw new Error(`CV with ID ${cv.id} already exists`);
    }

    this.cvs.push(cv);
    
    try {
      await this.saveCVsToFile();
      this.dispatchEvent(new CustomEvent('cv-added', { detail: cv }));
    } catch (error) {
      // Rollback in-memory changes if persistence fails
      this.cvs = this.cvs.filter(existingCV => existingCV.id !== cv.id);
      throw error;
    }
  }

  /**
   * Updates an existing CV in the collection.
   * Preserves the original if update fails to maintain data integrity.
   */
  public async updateCV(updatedCV: CurriculumVitae): Promise<void> {
    const index = this.cvs.findIndex(cv => cv.id === updatedCV.id);
    if (index === -1) {
      throw new Error(`CV with ID ${updatedCV.id} not found`);
    }

    const originalCV = this.cvs[index];
    this.cvs[index] = updatedCV;

    try {
      await this.saveCVsToFile();
      this.dispatchEvent(new CustomEvent('cv-updated', { detail: updatedCV }));
    } catch (error) {
      // Rollback to original CV if persistence fails
      this.cvs[index] = originalCV;
      throw error;
    }
  }

  /**
   * Removes a CV from the collection by ID.
   * Also handles cleanup of associated asset files.
   */
  public async deleteCV(id: string): Promise<void> {
    const index = this.cvs.findIndex(cv => cv.id === id);
    if (index === -1) {
      throw new Error(`CV with ID ${id} not found`);
    }

    const deletedCV = this.cvs[index];
    this.cvs.splice(index, 1);

    try {
      await this.saveCVsToFile();
      // TODO: Implement asset cleanup for deleted CV files
      this.dispatchEvent(new CustomEvent('cv-deleted', { detail: deletedCV }));
    } catch (error) {
      // Rollback deletion if persistence fails
      this.cvs.splice(index, 0, deletedCV);
      throw error;
    }
  }
  /**
   * Saves an image file to the CV assets directory.
   * Generates unique filename and returns the asset path.
   * 
   * @param file - The image file to save
   * @returns Promise<string> - The saved asset path relative to user data
   */
  public async saveImageFromFile(file: File): Promise<string> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error(`Invalid file type: ${file.type}. Expected image file.`);
      }

      // Check if we're running in Electron environment
      if (!window.electronAPI) {
        throw new Error('Electron API not available - running in browser mode');
      }

      // Convert File to ArrayBuffer for IPC transmission
      const fileBuffer = await file.arrayBuffer();
      
      // Use IPC to save file and get standardized asset path
      const assetPath = await window.electronAPI.saveImageFile(file.name, fileBuffer);
      
      return assetPath; // Returns: 'cv-assets/images/filename_timestamp.ext'
    } catch (error) {
      throw new Error(`Failed to save image file: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * Saves a PDF file to the CV assets directory.
   * Generates unique filename and returns the asset path.
   * 
   * @param file - The PDF file to save
   * @returns Promise<string> - The saved asset path relative to user data
   */
  public async savePDFFromFile(file: File): Promise<string> {
    try {
      // Validate file type
      if (file.type !== 'application/pdf') {
        throw new Error(`Invalid file type: ${file.type}. Expected PDF file.`);
      }

      // Check if we're running in Electron environment
      if (!window.electronAPI) {
        throw new Error('Electron API not available - running in browser mode');
      }

      // Convert File to ArrayBuffer for IPC transmission
      const fileBuffer = await file.arrayBuffer();
      
      // Use IPC to save file and get standardized asset path
      const assetPath = await window.electronAPI.savePDFFile(file.name, fileBuffer);
      
      return assetPath; // Returns: 'cv-assets/pdfs/filename_timestamp.pdf'
    } catch (error) {
      throw new Error(`Failed to save PDF file: ${error instanceof Error ? error.message : error}`);
    }
  }
  /**
   * Captures an image from the clipboard and saves it as a CV asset.
   * Provides seamless integration for quick CV image updates.
   * 
   * @returns Promise<string> - The saved asset path
   */
  public async saveImageFromClipboard(): Promise<string> {
    // TODO: Implement clipboard image capture using Electron APIs
    // This will require additional IPC channels for clipboard operations
    // Convert clipboard data to file and save to assets directory
    // Return the asset path for storage in CV object
    throw new Error('Clipboard image saving not yet implemented');
  }
  /**
   * Helper method to create a CV with automatic file processing.
   * Handles file uploads and saves them to the assets directory before creating the CV.
   * Note: This method only processes files and creates the CV object. Call addCV() separately to save it.
   * 
   * @param cvData - Basic CV information
   * @param imageFile - Optional image file for preview
   * @param pdfFile - Optional PDF file for document
   * @returns Promise<CurriculumVitae> - The created CV with asset paths (not yet saved to collection)
   */
  public async createCVWithFiles(
    cvData: Omit<CurriculumVitae, 'imagePreviewPath' | 'pdfPath'>,
    imageFile?: File,
    pdfFile?: File
  ): Promise<CurriculumVitae> {
    try {
      // Process image file if provided
      let imagePreviewPath = '';
      if (imageFile) {
        imagePreviewPath = await this.saveImageFromFile(imageFile);
      }

      // Process PDF file if provided
      let pdfPath: string | undefined;
      if (pdfFile) {
        pdfPath = await this.savePDFFromFile(pdfFile);
      }      // Create the complete CV object
      const newCV: CurriculumVitae = {
        ...cvData,
        imagePreviewPath,
        pdfPath,
      };

      return newCV;
    } catch (error) {
      throw new Error(`Failed to create CV with files: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * Loads CVs from the JSON file via Electron IPC.
   */
  private async loadCVsFromFile(): Promise<void> {
    try {
      // Check if we're running in Electron environment
      if (!window.electronAPI) {
        throw new Error('Electron API not available - running in browser mode');
      }

      const data = await window.electronAPI.loadCVs();
      
      if (!Array.isArray(data)) {
        throw new Error('Data file does not contain a valid array of CVs');
      }
      
      this.cvs = data as CurriculumVitae[];
    } catch (error) {
      throw new Error(`Failed to load CVs from file: ${error}`);
    }
  }

  /**
   * Saves CVs to the JSON file via Electron IPC.
   */
  private async saveCVsToFile(): Promise<void> {
    try {
      // Check if we're running in Electron environment
      if (!window.electronAPI) {
        throw new Error('Electron API not available - running in browser mode');
      }

      await window.electronAPI.saveCVs(this.cvs);
    } catch (error) {
      throw new Error(`Failed to save CVs to file: ${error}`);
    }
  }
}

/**
 * Export a singleton instance for immediate use.
 * This maintains consistency with ApplicationHandler patterns.
 */
export const cvHandler = CVHandler.getInstance();
