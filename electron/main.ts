import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { promises as fs } from "fs";
import path from "node:path";

const require = createRequire(import.meta.url);
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
    width: 800,
    height: 800,
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

function setupFileSystemIPC() {
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
    async (event, applications: any[]): Promise<void> => {
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
  setupFileSystemIPC();
});
