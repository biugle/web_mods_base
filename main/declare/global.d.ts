/*
 * @Author: HxB
 * @Date: 2023-12-25 10:55:00
 * @LastEditors: DoubleAm
 * @LastEditTime: 2023-12-25 15:17:43
 * @Description: 全局声明
 * @FilePath: \web_mods_base\main\declare\global.d.ts
 */
interface Window {
  xIpc: {
    send: (channel: string, ...args: any[]) => void;
    on: (channel: string, listener: (...args: any[]) => void) => void;
    remove: (channel: string, listener: (...args: any[]) => void) => void;
    removeAll: (channel: string) => void;
    exit: () => void;
    getNodeENV: () => string;
    getVersion: () => string;
    getPreloadJSPath: () => string;
    getModules: () => Promise<any>;
    getModuleUrl: (moduleName: string, params?: any) => string;
    isMinimized: () => boolean;
    isMaximized: () => boolean;
    changeMainWindowStatus: () => void;
    toggleDevTools: () => void;
  };
}
