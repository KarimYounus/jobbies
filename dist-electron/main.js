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
function setupFileSystemIPC() {
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
  setupFileSystemIPC();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
