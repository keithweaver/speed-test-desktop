'use strict';

// Import parts of electron to use
const {
  app,
  BrowserWindow,
  ipcMain,
  Notification,
  shell,
  Tray,
} = require('electron');
const path = require('path');
const url = require('url');
const storage = require('electron-json-storage');
const request = require('superagent');
const AutoLaunch = require('auto-launch');

const {
  FETCH_INTERNET_SPEEDS,
  FETCH_INTERNET_SPEEDS_DATA,
  FETCH_INTERNET_SPEEDS_DOWNLOAD_PROGRESS,
  FETCH_INTERNET_SPEEDS_UPLOAD_PROGRESS,
  FETCH_INTERNET_SPEEDS_ERROR,
  SPEED_TEST_DESKTOP_DATA_FILE,
  SPEED_TEST_DESKTOP_DATA_SEND,
  SPEED_TEST_DESKTOP_DATA_WATCH,
  SPEED_TEST_DESKTOP_DATA_SAVE,
  FETCH_REMOTE_VERSION,
  SEND_REMOTE_VERSION,
  RECEIVE_TIMER,
  OPEN_URL,
  SHOW_WINDOW,
} = require('./utils/constants');

// Globals
let mainWindow;
let tray;
let onDisconnectNotify = false;
let notificationTimers = [];
let speeds = {};
const assetsDirectory = path.join(__dirname, 'public')

// Keep a reference for dev mode
let dev = false;
if ( process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath) ) {
  dev = true;
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 150,
    height: 140,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    backgroundColor: '#fff',
  });

  // and load the index.html of the app.
  let indexPath;
  if ( dev && process.argv.indexOf('--noDevServer') === -1 ) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:4001',
      pathname: 'index.html',
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    });
  }
  mainWindow.loadURL( indexPath );

  // Unique to tray
  app.dock.hide()

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.hide();
    // Open the DevTools automatically if developing
    if ( dev ) {
      // mainWindow.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    cancelAllTimers();
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.on('blur', () => {
    if (!mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide()
    }
  });
}

function fetchInternetSpeeds() {
  const speedTest = require('speedtest-net');
  const test = speedTest({maxTime: 5000});
  try {
    test.on('data', data => {
      speeds = data.speeds;
      mainWindow.send(FETCH_INTERNET_SPEEDS_DATA, data);
    });

    test.on('downloadprogress', progress => {
      mainWindow.send(FETCH_INTERNET_SPEEDS_DOWNLOAD_PROGRESS, { progress });
    });

    test.on('uploadprogress', progress => {
      mainWindow.send(FETCH_INTERNET_SPEEDS_UPLOAD_PROGRESS, { progress });
    });

    test.on('error', err => {
      console.log('Speed test error:');
      console.log(err);

      if (err.code === 'ENOTFOUND') {
        // Fire notification because disconnected
        console.log('Notification about being disconnected');

        sendNotification('Disconnected', 'You are disconnect from the internet.');
      }

      mainWindow.send(FETCH_INTERNET_SPEEDS_ERROR, err);
    });
  } catch(e) {
    console.log('error for test', e);
  }
}

function getAppData() {
  storage.get(SPEED_TEST_DESKTOP_DATA_FILE, function(error, data) {
    if (error) {
      mainWindow.send(SPEED_TEST_DESKTOP_DATA_SEND, {
        success: false,
        message: error.toString(),
      });
    }
    mainWindow.send(SPEED_TEST_DESKTOP_DATA_SEND, {
      success: true,
      message: 'Fetch app data',
      data,
    });
  });
}

function saveAppData(data) {
  console.log('saveAppData', data);
  storage.set(SPEED_TEST_DESKTOP_DATA_FILE, data, function(error) {
    if (error) {
      throw error;
    }
  });
}
function fetchRemoteVersion() {
  request
   .get('https://raw.githubusercontent.com/EasyAPIio/speed-test-desktop/master/package.json')
   .set('Accept', 'application/json')
   .end((err, res) => {
     if (err) {
       mainWindow.send(SEND_REMOTE_VERSION, {
         success: false,
         message: 'failed to load json',
       });
     } else {
       const remotePackageJSON = JSON.parse(res.text);
       mainWindow.send(SEND_REMOTE_VERSION, {
         success: true,
         message: 'Loaded json',
         remotePackage: remotePackageJSON,
       });
     }
   });
}
function startTimer(time) {
  notificationTimers.push(
    setInterval(() => {
      const {
        download,
        upload,
      } = speeds;
      console.log('show notification');
      sendNotification(`Download: ${download}, Upload: ${upload}`, 'To run another test, press SpeedTest.net.');
    }, time)
  );
}
function cancelTimer(id) {
  clearInterval(id);
}
function cancelAllTimers() {
  for (let i = 0; i < notificationTimers.length; i += 1) {
    cancelTimer(notificationTimers[i]);
  }
}
function sendNotification(title, body) {
  new Notification({
    title,
    body,
  }).show();
}

function createTray() {
  tray = new Tray(path.join(`${assetsDirectory}/imgs`, 'speedometer1616.png'));
  tray.on('right-click', toggleWindow);
  tray.on('double-click', toggleWindow);
  tray.on('click', function (event) {
    toggleWindow();

    // Show devtools when command clicked
    if (mainWindow.isVisible() && process.defaultApp && event.metaKey) {
      mainWindow.openDevTools({mode: 'detach'});
    }
  })
}

function getWindowPosition() {
  const windowBounds = mainWindow.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return { x: x, y: y }
}

function showWindow() {
  const position = getWindowPosition();
  mainWindow.setPosition(position.x, position.y, false);
  mainWindow.show();
  mainWindow.focus();
}

function toggleWindow() {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    fetchRemoteVersion();
    getAppData();
    fetchInternetSpeeds();
    showWindow();
  }
}

ipcMain.on(SHOW_WINDOW, () => {
  showWindow();
});

ipcMain.on(FETCH_INTERNET_SPEEDS, (event, arg) => {
  fetchInternetSpeeds();
});

ipcMain.on(SPEED_TEST_DESKTOP_DATA_WATCH, (event, arg) => {
  getAppData();
});

ipcMain.on(SPEED_TEST_DESKTOP_DATA_SAVE, (event, arg) => {
  saveAppData(arg);
});

ipcMain.on(FETCH_REMOTE_VERSION, (event, arg) => {
  fetchRemoteVersion();
});

ipcMain.on(RECEIVE_TIMER, (event, arg) => {
  const {
    onDisconnect,
    every5min,
    every20min,
    every1Hour,
  } = arg;

  onDisconnectNotify = onDisconnect;

  cancelAllTimers();
  if (every5min) {
    startTimer(1000 * 60 * 5);
  }
  if (every20min) {
    startTimer(1000 * 60 * 20);
  }
  if (every1Hour) {
    startTimer(1000 * 60 * 60);
  }
});
ipcMain.on(OPEN_URL, (event, arg) => {
  shell.openExternal(arg);
});



const speedTestDesktopAutoLauncher = new AutoLaunch({
	name: 'Speed Test',
});

speedTestDesktopAutoLauncher.enable();


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createTray();
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
