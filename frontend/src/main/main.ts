/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, desktopCapturer, screen } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fs from 'fs';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// New IPC handler for screen capture
ipcMain.handle('capture-screen-snip', async () => {
  if (!mainWindow) {
    return null;
  }

  const currentDisplay = screen.getDisplayMatching(mainWindow.getBounds());
  let mainWindowWasMinimized = false;

  if (mainWindow.isMinimizable() && !mainWindow.isMinimized()) {
    mainWindow.minimize();
    mainWindowWasMinimized = true;
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: {
        width: Math.floor(currentDisplay.size.width * currentDisplay.scaleFactor),
        height: Math.floor(currentDisplay.size.height * currentDisplay.scaleFactor)
      },
      fetchWindowIcons: false,
    });

    let targetSource = sources.find(source => source.display_id === String(currentDisplay.id));

    if (!targetSource && sources.length > 0) {
      console.warn(`Could not find screen source for display ID ${currentDisplay.id}. Falling back to the first available source.`);
      targetSource = sources[0];
    }
    
    if (!targetSource) {
      console.error('No screen source found after attempting to match current display.');
      if (mainWindowWasMinimized && mainWindow && !mainWindow.isDestroyed() && mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      return null;
    }

    return new Promise((resolvePromise) => {
      let resolved = false;

      const selectorWindow = new BrowserWindow({
        x: currentDisplay.bounds.x,
        y: currentDisplay.bounds.y,
        width: currentDisplay.bounds.width,
        height: currentDisplay.bounds.height,
        transparent: true,
        backgroundColor: '#00000000',
        frame: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
        show: false,
      });

      selectorWindow.webContents.once('dom-ready', () => {
        if (!selectorWindow.isDestroyed()) {
          selectorWindow.show();
          selectorWindow.focus(); 
        }
      });
      
      const cleanupAndResolve = (value: any) => {
        if (resolved) return;
        resolved = true;

        if (selectorWindow && !selectorWindow.isDestroyed()) {
          selectorWindow.close();
        }
        ipcMain.removeListener('capture-area-selected', onCaptureAreaSelected);

        if (mainWindowWasMinimized && mainWindow && !mainWindow.isDestroyed() && mainWindow.isMinimized()) {
          mainWindow.restore();
        } else if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isFocused()) {
          mainWindow.focus()
        }
        resolvePromise(value);
      };

      const onCaptureAreaSelected = async (_event: Electron.IpcMainEvent, rect: { x: number; y: number; width: number; height: number } | null) => {
        if (!mainWindow || mainWindow.isDestroyed()) {
            cleanupAndResolve(null);
            return;
        }
        
        if (!rect) { 
            cleanupAndResolve(null);
            return;
        }

        setTimeout(async () => {
            try {
                const fullScreenImage = await targetSource!.thumbnail.toDataURL();
                const snipData = {
                    dataUrl: fullScreenImage,
                    cropRect: rect,
                };

                /* file Saving of image
                
                -- TODO: add back when  frontend has option to save to file or smth

                const picturesPath = app.getPath('pictures');
                const miscFolderPath = path.join(picturesPath, 'misc');
                if (!fs.existsSync(miscFolderPath)) {
                  fs.mkdirSync(miscFolderPath, { recursive: true });
                }
                const filePath = path.join(miscFolderPath, `snip-${Date.now()}.png`);
                const base64Data = fullScreenImage.replace(/^data:image\/png;base64,/, "");
                fs.writeFile(filePath, base64Data, 'base64', (err) => {
                  if (err) console.error('Failed to save snip:', err);
                  else console.log('Snip saved to:', filePath);
                });
                */

                cleanupAndResolve(snipData);
            } catch (captureError) {
                console.error('Error capturing screen snip after selection:', captureError);
                cleanupAndResolve(null);
            }
        }, 100);
      };
      
      ipcMain.once('capture-area-selected', onCaptureAreaSelected);

      selectorWindow.on('closed', () => {
        cleanupAndResolve(null);
      });
      
      // Define path to screen-selector.html in assets
      const RESOURCES_PATH = app.isPackaged
        ? path.join(process.resourcesPath, 'assets')
        : path.join(__dirname, '../../assets'); // Points to frontend/assets in dev
      const selectorHtmlPath = path.join(RESOURCES_PATH, 'screen-selector.html');
      
      selectorWindow.loadFile(selectorHtmlPath);
    });
  } catch (error) {
    console.error('Error during capture-screen-snip setup:', error);
    if (mainWindowWasMinimized && mainWindow && !mainWindow.isDestroyed() && mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    return null;
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';



const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
    // Open DevTools for the main window if in debug mode
    if (isDebug && mainWindow) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
