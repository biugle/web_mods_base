/*
 * @Author: HxB
 * @Date: 2022-08-15 15:42:27
 * @LastEditors: DoubleAm
 * @LastEditTime: 2023-12-23 16:44:18
 * @Description: electron 打包与启动文件主程序
 * @FilePath: \web_mods_base\electron\main.ts
 */
import * as path from 'path';
import fs from 'fs';
import url from 'url';
import mime from 'mime-types';
import { app, BrowserWindow, globalShortcut, ipcMain, protocol, net } from 'electron';
import { initEvents } from './events';

// eslint-disable-next-line no-undef
const mode = process.argv[2]; // process.env.NODE_ENV

// const baseDir = path.dirname(process.execPath);
// const baseRenderDir = path.join(baseDir, 'resources/app');
// const bgPng = path.join(baseRenderDir, 'source', 'bg.png');

let mainWindow: BrowserWindow;

// 注册自定义协议
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'biu',
    privileges: {
      standard: true,
      secure: true,
      bypassCSP: true,
      supportFetchAPI: true,
      allowServiceWorkers: true,
      corsEnabled: true,
    },
  },
]);

const createWindow = () => {
  mainWindow = new BrowserWindow({
    center: true,
    autoHideMenuBar: true,
    alwaysOnTop: false,
    resizable: true,
    // fullscreen: true, // 默认全屏
    // show: false, // is show
    // frame: false, // 无边框
    width: 1280,
    height: 720,
    webPreferences: {
      // eslint-disable-next-line spellcheck/spell-checker
      webviewTag: true,
      webSecurity: false,
      // eslint-disable-next-line no-undef
      preload: path.join(__dirname, './preload.js'),
      nodeIntegration: true, // 解决无法使用 require 加载的 bug
      nodeIntegrationInSubFrames: true, // for subContent nodeIntegration Enable
      // contextIsolation: false, // preload 单独的运行环境
    },
  });
  console.log(mode);
  if (!app.isPackaged && !mode.includes('prod')) {
    // eslint-disable-next-line no-undef
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL ?? 'http://localhost:1998/');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile('build/index.html').catch(() => null);
  }

  // 处理自定义协议请求
  protocol.registerBufferProtocol('biu', (request, respond) => {
    // const url = request.url.substring(6); // 移除协议部分 ('biu://')
    const data = url.parse(request.url);
    console.log({ data });
    // eslint-disable-next-line no-undef
    const filePath = path.join(__dirname, '../' + data.pathname); // 根据相对路径获取完整的本地文件路径

    // 使用 fs.readFile 读取文件内容
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error('Failed to read file:', err);
        return respond({ statusCode: 404 }); // 返回错误状态码给渲染进程
      }

      // 根据文件扩展名获取对应的 MIME 类型
      const mimeType = mime.lookup(filePath);

      // 返回文件内容和 MIME 类型给渲染进程
      respond({ mimeType, data });
    });
  });

  // 关闭 window 时触发下列事件
  mainWindow.on('closed', function () {
    // @ts-ignore
    mainWindow = null;
  });

  ipcMain.on('get-tab-url', (event, tab) => {
    const tabUrl = getLocalURL(tab.id); // 根据选项卡 ID 获取本地 URL
    console.log({ tab, tabUrl });
    event.reply('tab-url', tabUrl);
  });

  ipcMain.on('open-new-window', (event, url) => {
    const win = new BrowserWindow({ width: 800, height: 600 });
    win.loadURL(url);
  });

  // ...

  // 获取对应选项卡的本地 URL
  function getLocalURL(tabId) {
    switch (tabId) {
      case 'footer':
        // eslint-disable-next-line no-undef
        return `file://${__dirname}/modules/footer/index.html`;
      case 'header':
        // eslint-disable-next-line no-undef
        return `file://${__dirname}/modules/header/index.html`;
      // 添加更多选项卡的情况...
      default:
        return '';
    }
  }
  // mainWindow.show(); // control mainWindow show
  initEvents(mainWindow);
};

app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors'); // 兼容各个版本关闭跨域(上线时删除此配置)

// 绑定 ready 方法，当 electron 应用创建成功时，创建一个窗口。
app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+Alt+X', () => {
    console.log('DEV TOOLS');
    mainWindow.webContents.isDevToolsOpened()
      ? mainWindow.webContents.closeDevTools()
      : mainWindow.webContents.openDevTools();
  });
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    console.log('CLOSE DEV TOOLS 关闭默认控制台打开事件');
  });

  createWindow();

  if (!mainWindow.isFocused()) {
    mainWindow.focus();
  }

  mainWindow.setMenuBarVisibility(false); // 设置菜单栏不可见
  mainWindow.menuBarVisible = false;
  mainWindow.setAutoHideMenuBar(false);

  // eslint-disable-next-line no-undef
  if (process.platform != 'darwin') {
    mainWindow.setIcon(app.isPackaged ? 'build/logos/icon.ico' : 'resource/logos/icon.ico');
  }

  // 绑定 activate 方法，当 electron 应用激活时，创建一个窗口。这是为了点击关闭按钮之后从 dock 栏打开。
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    // macOS 中点击 Dock 图标时没有已打开的其余应用窗口时，则通常在应用中重建一个窗口。
    if (mainWindow === null) {
      createWindow();
    }
  });
});

// 绑定关闭方法，当 electron 应用关闭时，退出 electron 。 macos 系统因为具有 dock 栏机制，可选择不退出。
app.on('window-all-closed', function () {
  // macOS 中除非用户按下 `Cmd + Q` 显式退出，否则应用与菜单栏始终处于活动状态。
  // eslint-disable-next-line no-undef
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时，将会聚焦到 mainWindow 这个窗口。
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      mainWindow.show();
    }
  });
}
