import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { promises } from "fs";
import path from "node:path";
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 800,
    transparent: false,
    icon: path.join(process.env.VITE_PUBLIC, "Iocn.png"),
    title: "Jobbies",
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
function setupApplicationHandlerIPC() {
  const getDataFilePath = () => {
    const userDataPath = app.getPath("userData");
    return path.join(userDataPath, "job-applications.json");
  };
  ipcMain.handle("load-applications", async () => {
    try {
      const filePath = getDataFilePath();
      const data = await promises.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }
      console.error("Failed to load applications:", error);
      throw error;
    }
  });
  ipcMain.handle(
    "save-applications",
    async (event, applications) => {
      try {
        const filePath = getDataFilePath();
        const data = JSON.stringify(applications, null, 2);
        await promises.writeFile(filePath, data, "utf-8");
      } catch (error) {
        console.error("Failed to save applications:", error);
        throw error;
      }
    }
  );
  ipcMain.handle("check-data-file", async () => {
    try {
      const filePath = getDataFilePath();
      await promises.access(filePath);
      return true;
    } catch (error) {
      if (error.code === "ENOENT") {
        return false;
      }
      console.error("Error checking data file:", error);
      throw error;
    }
  });
}
function setupCVHandlerIPC() {
  const getCVDataFilePath = () => {
    const userDataPath = app.getPath("userData");
    return path.join(userDataPath, "cv-collection.json");
  };
  ipcMain.handle("load-cvs", async () => {
    try {
      const filePath = getCVDataFilePath();
      const data = await promises.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }
      console.error("Failed to load CVs:", error);
      throw error;
    }
  });
  ipcMain.handle("save-cvs", async (event, cvs) => {
    try {
      const filePath = getCVDataFilePath();
      await promises.mkdir(path.dirname(filePath), { recursive: true });
      const data = JSON.stringify(cvs, null, 2);
      await promises.writeFile(filePath, data, "utf-8");
    } catch (error) {
      console.error("Failed to save CVs:", error);
      throw error;
    }
  });
  ipcMain.handle("check-cv-data-file", async () => {
    try {
      const filePath = getCVDataFilePath();
      await promises.access(filePath);
      return true;
    } catch (error) {
      if (error.code === "ENOENT") {
        return false;
      }
      console.error("Error checking CV data file:", error);
      throw error;
    }
  });
  const getCVAssetsPath = (subdir = "") => {
    const userDataPath = app.getPath("userData");
    return path.join(userDataPath, "cv-assets", subdir);
  };
  const generateUniqueFilename = (originalName) => {
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `${baseName}_${timestamp}_${randomSuffix}${extension}`;
  };
  ipcMain.handle("ensure-cv-assets", async () => {
    try {
      const imagesPath = getCVAssetsPath("images");
      const pdfsPath = getCVAssetsPath("pdfs");
      await promises.mkdir(imagesPath, { recursive: true });
      await promises.mkdir(pdfsPath, { recursive: true });
    } catch (error) {
      console.error("Failed to create CV assets directories:", error);
      throw error;
    }
  });
  ipcMain.handle(
    "save-cv-image",
    async (_, fileName, fileBuffer) => {
      try {
        const imagesPath = getCVAssetsPath("images");
        await promises.mkdir(imagesPath, { recursive: true });
        const uniqueName = generateUniqueFilename(fileName);
        const targetPath = getCVAssetsPath(path.join("images", uniqueName));
        await promises.writeFile(targetPath, Buffer.from(fileBuffer));
        return path.join("cv-assets", "images", uniqueName);
      } catch (error) {
        console.error("Failed to save CV image:", error);
        throw new Error(`Failed to save image: ${error}`);
      }
    }
  );
  ipcMain.handle(
    "save-cv-pdf",
    async (_, fileName, fileBuffer) => {
      try {
        const pdfsPath = getCVAssetsPath("pdfs");
        await promises.mkdir(pdfsPath, { recursive: true });
        const uniqueName = generateUniqueFilename(fileName);
        const targetPath = getCVAssetsPath(path.join("pdfs", uniqueName));
        await promises.writeFile(targetPath, Buffer.from(fileBuffer));
        return path.join("cv-assets", "pdfs", uniqueName);
      } catch (error) {
        console.error("Failed to save CV PDF:", error);
        throw new Error(`Failed to save PDF: ${error}`);
      }
    }
  );
  ipcMain.handle(
    "get-cv-image-url",
    async (_, imagePath) => {
      try {
        const fullPath = getCVAssetsPath(
          imagePath.replace(/^cv-assets[\/\\]/, "")
        );
        await promises.access(fullPath);
        const fileBuffer = await promises.readFile(fullPath);
        const ext = path.extname(fullPath).toLowerCase();
        let mimeType = "image/jpeg";
        if (ext === ".png") mimeType = "image/png";
        else if (ext === ".gif") mimeType = "image/gif";
        else if (ext === ".webp") mimeType = "image/webp";
        const base64Data = fileBuffer.toString("base64");
        return `data:${mimeType};base64,${base64Data}`;
      } catch (error) {
        console.error("Failed to load CV image:", error);
        return null;
      }
    }
  );
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  createWindow();
  setupApplicationHandlerIPC();
  setupCVHandlerIPC();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
