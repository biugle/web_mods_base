import { BrowserWindow, app, ipcMain } from 'electron';

const MODS_TAB_MAP: any = {};
let ACTIVE_MOD = '404';
const MODS_TAB_LIST: string[] = [];
export const bindWebviewController = (mainWindow: BrowserWindow) => {
  if (!mainWindow) {
    console.log('未获取到程序信息', mainWindow);
    return;
  }

  // 监听新开窗口与处理
  ipcMain.on('open-new-window', (event, url) => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      show: false, // 隐藏窗口，等待图标设置完成后再显示
    });

    win.loadURL(url);

    win.once('ready-to-show', () => {
      win.setIcon(app.isPackaged ? 'build/logos/icon.ico' : 'resource/logos/icon.ico');
      win.show(); // 显示窗口
    });
  });

  // 模块加载缓存记录
  ipcMain.on('change-mods', (event, module) => {
    if (!MODS_TAB_MAP[module.name]) {
      MODS_TAB_MAP[module.name] = module;
    }
    if (!MODS_TAB_LIST.includes(module.name)) {
      MODS_TAB_LIST.push(module.name);
    }
    ACTIVE_MOD = module.name;
    // 告诉前端现在的 module 与 tab
    event.sender.send('mods-state', ACTIVE_MOD, MODS_TAB_MAP, MODS_TAB_LIST);
  });

  // 关闭某个模块
  ipcMain.on('close-mods', (event, moduleName) => {
    if (MODS_TAB_MAP[moduleName]) {
      delete MODS_TAB_MAP[moduleName];
    }
    const tabIndex = MODS_TAB_LIST.indexOf(moduleName);
    if (tabIndex != -1) {
      MODS_TAB_LIST.splice(tabIndex, 1);
    }
    ACTIVE_MOD = MODS_TAB_LIST[tabIndex] ?? MODS_TAB_LIST[tabIndex - 1] ?? MODS_TAB_LIST[0] ?? '404';
    // 告诉前端现在的 module 与 tab
    event.sender.send('mods-state', ACTIVE_MOD, MODS_TAB_MAP, MODS_TAB_LIST);
  });

  // 获取某个模块内容
  ipcMain.on('get-mod', (event, moduleName) => {
    event.sender.send('mod-info', MODS_TAB_MAP[moduleName] ?? {});
  });
};
