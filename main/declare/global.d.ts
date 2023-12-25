/*
 * @Author: HxB
 * @Date: 2023-12-25 10:55:00
 * @LastEditors: DoubleAm
 * @LastEditTime: 2023-12-25 11:00:29
 * @Description: 全局声明
 * @FilePath: \web_mods_base\main\declare\global.d.ts
 */
interface Window {
  xIpc: {
    send: (channel: string, ...args: any[]) => void;
    on: (channel: string, listener: (...args: any[]) => void) => void;
    exit: () => void;
    getVersion: () => string;
    getPreloadJSPath: () => string;
    getModules: () => any;
    getModuleUrl: (moduleName: string, params: any) => string;
    isMinimized: () => boolean;
    isMaximized: () => boolean;
    changeMainWindowStatus: () => void;
    toggleDevTools: () => void;
  };
}
