/*
 * @Author: HxB
 * @Date: 2022-08-18 10:34:52
 * @LastEditors: DoubleAm
 * @LastEditTime: 2023-12-25 10:49:39
 * @Description: preload
 * @FilePath: \web_mods_base\electron\preload.ts
 */
import path from 'path';
import { contextBridge, ipcRenderer } from 'electron';
import { qsStringify } from 'js-xxx';
import pkg from '../package.json';
import { sendData } from './utils';

window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('checkUpdate');
  sendData('test', ['hello', 'world']);
  console.log('HTML DOMContentLoaded.');
});

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
  getVersion: () => pkg['version'],
  // eslint-disable-next-line no-undef
  getPreloadJSPath: () => path.join(__dirname, './preload.js'),
  getModules: () => ({ modules: 'test' }),
  getModuleUrl: (moduleName, params) => `biu://localhost/modules/${moduleName}/index.html?${qsStringify(params)}`,
  isMinimized: () => ipcRenderer.sendSync('getMainWindowStatus', 'min'),
  isMaximized: () => ipcRenderer.sendSync('getMainWindowStatus', 'max'),
  changeMainWindowStatus: () => ipcRenderer.send('changeMainWindowStatus'),
  toggleDevTools: () => ipcRenderer.send('toggleDevTools'),
});
