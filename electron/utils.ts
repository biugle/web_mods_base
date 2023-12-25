/*
 * @Author: HxB
 * @Date: 2023-05-31 10:30:54
 * @LastEditors: DoubleAm
 * @LastEditTime: 2023-12-25 11:33:41
 * @Description: 通用函数
 * @FilePath: \web_mods_base\electron\utils.ts
 */
import fs from 'fs';
import path from 'path';
import XCall from 'js-xcall';
import { app } from 'electron';

export async function getModulesByNodeFS() {
  // eslint-disable-next-line no-undef
  const modulesPath = path.join(__dirname, '../modules');
  const modulesMap = {};
  const modulesList: any[] = [];

  try {
    const directories = await fs.promises.readdir(modulesPath, { withFileTypes: true });

    const promises = directories.map(async (dir) => {
      if (dir.isDirectory()) {
        const modulePath = path.join(modulesPath, dir.name);
        const packageJsonPath = path.join(modulePath, 'package.json');

        try {
          const packageJsonContent = await fs.promises.readFile(packageJsonPath, 'utf-8');
          const packageJson = JSON.parse(packageJsonContent);

          modulesMap[dir.name] = packageJson;
          modulesList.push({
            dirname: dir.name,
            modulePath: modulePath,
            pkgPath: packageJsonPath,
            ...packageJson,
          });
        } catch (error) {
          console.error(`Error reading package.json for module ${dir.name}: ${error}`);
        }
      }
    });

    await Promise.allSettled(promises);
  } catch (error) {
    console.error(`Error reading modules directory: ${error}`);
  }

  return {
    modulesMap,
    modulesList,
  };
}

export function sendData(...args) {
  console.log('sendData------', ...args);
  XCall.existEvent('sendData') && XCall.dispatch('sendData', ...args);
}

export function setProgress(percent: number) {
  console.log('setProgress------', percent);
  XCall.existEvent('setProgress') && XCall.dispatch('setProgress', percent);
}

export function logger(...args) {
  console.log('logger------', ...args);
  XCall.existEvent('logger') && XCall.dispatch('logger', ...args);
}

export function toggleDevTools() {
  XCall.existEvent('toggleDevTools') && XCall.dispatch('toggleDevTools');
}

export function sendEvent2Web(eventKey: string, ...args) {
  XCall.existEvent('sendEvent2Web') && XCall.dispatch('sendEvent2Web', eventKey, ...args);
}

export function sendJsExecute(jsStr: string) {
  XCall.existEvent('sendJsExecute') && XCall.dispatch('sendJsExecute', jsStr);
}
