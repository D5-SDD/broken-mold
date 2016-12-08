'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// Module to control global key presses
const globalShortcut = electron.globalShortcut;

if (process.env.NODE_ENV === 'development') {
  /*
  require('electron-reload')(__dirname, {
    electron: require('electron-prebuilt')
  });
  */
  require('electron-context-menu')();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;

function createWindow () {
  //Browser window options
  const browserOptions = {
    width: 1100,
    height: 700
  };

  // Create the browser window.
  mainWindow = new BrowserWindow(browserOptions);

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.webContents.openDevTools();
  if (process.env.NODE_ENV === 'development') {
    // Open the DevTools.
    //mainWindow.webContents.openDevTools();
  } else {
    mainWindow.setMenu(null);
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  createWindow();

  if (process.env.NODE_ENV !== 'development') {
    globalShortcut.register('ctrl+r', function () {});
    globalShortcut.register('ctrl+shift+i', function() {});
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
