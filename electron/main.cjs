const { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain, net } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;
let tray = null;

// CORS 우회용 실시간 웹 크롤링 IPC 핸들러
ipcMain.handle('fetch-url', async (event, targetUrl) => {
  return new Promise((resolve, reject) => {
    try {
      const request = net.request({
        method: 'GET',
        url: targetUrl,
      });

      request.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      let responseData = '';

      request.on('response', (response) => {
        response.on('data', (chunk) => {
          responseData += chunk.toString();
        });

        response.on('end', () => {
          resolve({ status: response.statusCode, data: responseData });
        });
      });

      request.on('error', (error) => {
        resolve({ status: 500, error: error.message });
      });

      request.end();
    } catch (err) {
      resolve({ status: 500, error: err.message });
    }
  });
});

function createWindow() {
  const iconPath = path.join(__dirname, '../public/favicon.svg');
  const windowOptions = {
    width: 1300,
    height: 880,
    minWidth: 1024,
    minHeight: 700,
    title: '컬처팝 8Days (CulturePop) - 영남권 문화생활 캘린더',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
  };

  if (fs.existsSync(iconPath)) {
    windowOptions.icon = iconPath;
  }

  mainWindow = new BrowserWindow(windowOptions);

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;

  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
