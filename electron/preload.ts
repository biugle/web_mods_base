/*
 * @Author: HxB
 * @Date: 2022-08-18 10:34:52
 * @LastEditors: DoubleAm
 * @LastEditTime: 2023-12-25 14:15:00
 * @Description: preload
 * @FilePath: \web_mods_base\electron\preload.ts
 */
import path from 'path';
import { contextBridge, ipcRenderer } from 'electron';
import { qsStringify } from 'js-xxx';
import pkg from '../package.json';
import { getModulesByNodeFS, sendData } from './utils';

window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('checkUpdate');
  sendData('test', ['hello', 'world']);
  console.log('HTML DOMContentLoaded.');
});

let MODULES: { modulesMap: any; modulesList: any[] } = {
  modulesMap: {},
  modulesList: [],
};
let IS_GET_MODULES = false;
// eslint-disable-next-line no-undef
const NODE_ENV = process.env.NODE_ENV;

contextBridge.exposeInMainWorld('xIpc', {
  send: (channel, ...args) => {
    return ipcRenderer.send(channel, ...args);
  },
  on: (channel, listener) => {
    // listener(event, ...args)
    ipcRenderer.on(channel, listener);
  },
  exit: () => {
    console.log('destroy');
    ipcRenderer.send('destroy');
  },
  getNodeENV: () => NODE_ENV,
  getVersion: () => pkg['version'],
  // eslint-disable-next-line no-undef
  getPreloadJSPath: () => path.join(__dirname, './preload.js'),
  getModules: async () => {
    if (!IS_GET_MODULES) {
      try {
        MODULES = await getModulesByNodeFS();
        IS_GET_MODULES = true;
      } catch (e) {
        console.error('contextBridge getModules error:', e);
        IS_GET_MODULES = false;
      }
    }
    return MODULES;
  },
  // eslint-disable-next-line spellcheck/spell-checker
  getModuleUrl: (moduleName, params) => `biu://localhost/modules/${moduleName}/index.html?${qsStringify(params)}`,
  isMinimized: () => ipcRenderer.sendSync('getMainWindowStatus', 'min'),
  isMaximized: () => ipcRenderer.sendSync('getMainWindowStatus', 'max'),
  changeMainWindowStatus: () => ipcRenderer.send('changeMainWindowStatus'),
  toggleDevTools: () => ipcRenderer.send('toggleDevTools'),
});
