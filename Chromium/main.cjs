const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

app.name = "Browse The Web";
app.setName("Browse The Web");

let mainWindow;
let cppProcess;
let goProcess;
let cppRouteQueue = [];
let cppBuffer = "";
const downloads = [];
const rendererUrl = "http://127.0.0.1:5173";
const rendererFile = path.join(__dirname, "../dist/index.html");
const packagedResourcePath = (relativePath) =>
  app.isPackaged
    ? path.join(
        process.resourcesPath,
        `app-${process.arch}.asar.unpacked`,
        relativePath,
      )
    : path.join(__dirname, "..", relativePath);

function launchCPPEngine() {
  const cppBinaryPath = packagedResourcePath("CPPEngine/optimizer");
  cppProcess = spawn(cppBinaryPath);
  cppProcess.on("error", (error) => {
    console.error(`C++ Core Engine failed to start: ${error.message}`);
  });
  cppProcess.stdout.on("data", (data) => {
    cppBuffer += data.toString();
    const lines = cppBuffer.split("\n");
    cppBuffer = lines.pop() || "";
    for (const line of lines) {
      if (!line.trim()) continue;
      const pending = cppRouteQueue.shift();
      if (pending) pending(JSON.parse(line));
    }
  });
  cppProcess.stderr.on("data", (data) => {
    console.warn(`C++ Core Engine Warning: ${data.toString()}`);
  });
}

function launchGoEngine() {
  const goBinaryPath = packagedResourcePath("GoEngine/engine");
  goProcess = spawn(goBinaryPath);
  goProcess.on("error", (error) => {
    console.error(`Go history engine failed to start: ${error.message}`);
  });
  goProcess.stdout.on("data", (data) => {
    console.log(`Go history: ${data.toString().trim()}`);
  });
  goProcess.stderr.on("data", (data) => {
    console.warn(`Go history warning: ${data.toString()}`);
  });
}

function routeWithCpp(url) {
  return new Promise((resolve, reject) => {
    if (!cppProcess || cppProcess.killed) {
      reject(new Error("C++ URL validator is unavailable"));
      return;
    }
    cppRouteQueue.push(resolve);
    cppProcess.stdin.write(`ROUTE\t${url}\n`);
  });
}

function recordVisitWithGo(url) {
  if (goProcess && !goProcess.killed) goProcess.stdin.write(`VISIT\t${url}\n`);
}

function registerDownloadTracking() {
  ipcMain.handle("downloads:get-all", () => downloads);
  session.defaultSession.on("will-download", (_event, item) => {
    const download = {
      id: `${Date.now()}-${downloads.length}`,
      filename: item.getFilename(),
      state: "downloading",
    };
    downloads.unshift(download);
    mainWindow?.webContents.send("downloads-updated", downloads);
    item.on("updated", (_event, state) => {
      download.state = state;
      mainWindow?.webContents.send("downloads-updated", downloads);
    });
    item.once("done", (_event, state) => {
      download.state = state;
      download.path = state === "completed" ? item.getSavePath() : undefined;
      mainWindow?.webContents.send("downloads-updated", downloads);
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1020,
    height: 740,
    title: "Browse The Web",
    icon: app.isPackaged
      ? path.join(process.resourcesPath, "icon.icns")
      : path.join(__dirname, "../src/images/Logo.icns"),
    backgroundColor: "#1d1f23",
    show: false,
    titleBarStyle: "default",
    titleBarOverlay: false,
    darkTheme: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  loadRendererWhenReady();
  mainWindow.webContents.on("page-title-updated", (event) => {
    event.preventDefault();
    mainWindow.setTitle("Browse The Web");
  });
  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

async function loadRendererWhenReady(attempt = 1) {
  if (!mainWindow) return;

  if (app.isPackaged) {
    await mainWindow.loadFile(rendererFile);
    return;
  }

  try {
    const response = await fetch(rendererUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await mainWindow.loadURL(rendererUrl);
  } catch (error) {
    if (attempt >= 30) {
      console.error(`Unable to connect to Vite at ${rendererUrl}: ${error.message}`);
      return;
    }
    setTimeout(() => loadRendererWhenReady(attempt + 1), 500);
  }
}

app.whenReady().then(() => {
  const chromeVersion = process.versions.chrome;
  session.defaultSession.setUserAgent(
    `Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0_0) AppleWebKit/537.36 ` +
      `(KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36`,
  );
  launchCPPEngine();
  launchGoEngine();
  registerDownloadTracking();
  ipcMain.handle("browser:route-url", async (_event, url) => {
    const response = await routeWithCpp(url);
    recordVisitWithGo(response.url);
    return response.url;
  });
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (cppProcess) cppProcess.kill();
  if (goProcess) goProcess.kill();
  if (process.platform !== "darwin") app.quit();
});
