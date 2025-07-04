import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import { promises as fs } from "fs";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: 910,
    height: 1080,
    transparent: false,
    icon: path.join(process.env.VITE_PUBLIC, "Iocn.png"),
    title: "Jobbies",
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

function setupApplicationHandlerIPC() {
  // Job Application IPC Handlers

  // Define the data file path inside the app's user data directory
  const getDataFilePath = () => {
    const userDataPath = app.getPath("userData");
    return path.join(userDataPath, "job-applications.json");
  };

  // IPC Handler: Load applications from the JSON file
  ipcMain.handle("load-applications", async (): Promise<any[]> => {
    try {
      const filePath = getDataFilePath();
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      // Case: File not found or empty
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return []; // Return empty array if file does not exist
      }
      // Case: Other read errors
      console.error("Failed to load applications:", error);
      throw error;
    }
  });

  // IPC Handler: Save applications to the JSON file
  ipcMain.handle(
    "save-applications",
    async (_event, applications: any[]): Promise<void> => {
      try {
        const filePath = getDataFilePath();
        const data = JSON.stringify(applications, null, 2);
        await fs.writeFile(filePath, data, "utf-8"); // Will create the file if it doesn't exist
      } catch (error) {
        console.error("Failed to save applications:", error);
        throw error;
      }
    }
  );
  // IPC Handler: Check if the data file exists
  ipcMain.handle("check-data-file", async (): Promise<boolean> => {
    try {
      const filePath = getDataFilePath();
      await fs.access(filePath);
      return true; // File exists
    } catch (error) {
      // If the file does not exist, return false
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return false;
      }
      // For other errors, log and rethrow
      console.error("Error checking data file:", error);
      throw error;
    }
  });
}

function setupCVHandlerIPC() {
  // CV Collection IPC Handlers
  const getCVDataFilePath = () => {
    const userDataPath = app.getPath("userData");
    return path.join(userDataPath, "cv-collection.json");
  };

  // IPC Handler: Load CVs from the JSON file
  ipcMain.handle("load-cvs", async (): Promise<any[]> => {
    try {
      const filePath = getCVDataFilePath();
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      // Case: File not found or empty
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return []; // Return empty array if file does not exist
      }
      // Case: Other read errors
      console.error("Failed to load CVs:", error);
      throw error;
    }
  });

  // IPC Handler: Save CVs to the JSON file
  ipcMain.handle("save-cvs", async (_event, cvs: any[]): Promise<void> => {
    try {
      const filePath = getCVDataFilePath();

      // Ensure the directory exists before writing
      await fs.mkdir(path.dirname(filePath), { recursive: true });

      const data = JSON.stringify(cvs, null, 2);
      await fs.writeFile(filePath, data, "utf-8");
    } catch (error) {
      console.error("Failed to save CVs:", error);
      throw error;
    }
  });
  // IPC Handler: Check if the CV data file exists
  ipcMain.handle("check-cv-data-file", async (): Promise<boolean> => {
    try {
      const filePath = getCVDataFilePath();
      await fs.access(filePath);
      return true; // File exists
    } catch (error) {
      // If the file does not exist, return false
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return false;
      }
      // For other errors, log and rethrow
      console.error("Error checking CV data file:", error);
      throw error;
    }
  });

  // CV Asset Management IPC Handlers
  const getCVAssetsPath = (subdir: string = "") => {
    const userDataPath = app.getPath("userData");
    return path.join(userDataPath, "cv-assets", subdir);
  };

  const generateUniqueFilename = (originalName: string): string => {
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `${baseName}_${timestamp}_${randomSuffix}${extension}`;
  };

  // IPC Handler: Ensure CV assets directory structure exists
  ipcMain.handle("ensure-cv-assets", async (): Promise<void> => {
    try {
      const imagesPath = getCVAssetsPath("images");
      const pdfsPath = getCVAssetsPath("pdfs");

      await fs.mkdir(imagesPath, { recursive: true });
      await fs.mkdir(pdfsPath, { recursive: true });
    } catch (error) {
      console.error("Failed to create CV assets directories:", error);
      throw error;
    }
  });
  // IPC Handler: Save image file to cv-assets/images/
  ipcMain.handle(
    "save-cv-image",
    async (_, fileName: string, fileBuffer: ArrayBuffer): Promise<string> => {
      try {
        // Ensure assets directory exists
        const imagesPath = getCVAssetsPath("images");
        await fs.mkdir(imagesPath, { recursive: true });

        // Generate unique filename to prevent conflicts
        const uniqueName = generateUniqueFilename(fileName);
        const targetPath = getCVAssetsPath(path.join("images", uniqueName));

        // Write file to cv-assets/images/
        await fs.writeFile(targetPath, Buffer.from(fileBuffer));

        // Return path relative to userData for storage in CV object
        return path.join("cv-assets", "images", uniqueName);
      } catch (error) {
        console.error("Failed to save CV image:", error);
        throw new Error(`Failed to save image: ${error}`);
      }
    }
  );

  // IPC Handler: Save PDF file to cv-assets/pdfs/
  ipcMain.handle(
    "save-cv-pdf",
    async (_, fileName: string, fileBuffer: ArrayBuffer): Promise<string> => {
      try {
        // Ensure assets directory exists
        const pdfsPath = getCVAssetsPath("pdfs");
        await fs.mkdir(pdfsPath, { recursive: true });

        // Generate unique filename to prevent conflicts
        const uniqueName = generateUniqueFilename(fileName);
        const targetPath = getCVAssetsPath(path.join("pdfs", uniqueName));

        // Write file to cv-assets/pdfs/
        await fs.writeFile(targetPath, Buffer.from(fileBuffer));

        // Return path relative to userData for storage in CV object
        return path.join("cv-assets", "pdfs", uniqueName);
      } catch (error) {
        console.error("Failed to save CV PDF:", error);
        throw new Error(`Failed to save PDF: ${error}`);
      }
    }
  );

  // IPC Handler: Get image data URL from CV assets path
  ipcMain.handle(
    "get-cv-image-url",
    async (_, imagePath: string): Promise<string | null> => {
      try {
        // Convert relative path to absolute path in userData
        const fullPath = getCVAssetsPath(
          imagePath.replace(/^cv-assets[\/\\]/, "")
        );

        // Check if file exists
        await fs.access(fullPath);

        // Read file and convert to data URL
        const fileBuffer = await fs.readFile(fullPath);
        const ext = path.extname(fullPath).toLowerCase();

        // Determine MIME type based on extension
        let mimeType = "image/jpeg"; // default
        if (ext === ".png") mimeType = "image/png";
        else if (ext === ".gif") mimeType = "image/gif";
        else if (ext === ".webp") mimeType = "image/webp";

        // Convert to base64 data URL
        const base64Data = fileBuffer.toString("base64");
        return `data:${mimeType};base64,${base64Data}`;
      } catch (error) {
        console.error("Failed to load CV image:", error);
        return null; // Return null if image not found/accessible
      }
    }
  );
}

/**
 * Sets up IPC handlers for settings data operations.
 * Handles loading and saving application settings to a JSON file.
 */
function setupSettingsIPC() {
  // Settings IPC Handlers

  // Define the settings file path inside the app's user data directory
  const getSettingsFilePath = () => {
    const userDataPath = app.getPath("userData");
    return path.join(userDataPath, "app-settings.json");
  };

  // IPC Handler: Load settings from the JSON file
  ipcMain.handle("load-settings", async (): Promise<any> => {
    try {
      const filePath = getSettingsFilePath();
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      // Case: File not found or empty
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return {}; // Return empty object if file does not exist
      }
      // Case: Other read errors
      console.error("Failed to load settings:", error);
      throw error;
    }
  });

  // IPC Handler: Save settings to the JSON file
  ipcMain.handle(
    "save-settings",
    async (_, settings: any): Promise<void> => {
      try {
        const filePath = getSettingsFilePath();
        const data = JSON.stringify(settings, null, 2);
        await fs.writeFile(filePath, data, "utf-8");
        console.log("Settings saved successfully to:", filePath);
      } catch (error) {
        console.error("Failed to save settings:", error);
        throw error;
      }
    }
  );
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  createWindow();
  setupApplicationHandlerIPC();
  setupCVHandlerIPC();
  setupSettingsIPC();
});
