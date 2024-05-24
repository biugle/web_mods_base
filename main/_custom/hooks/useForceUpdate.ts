/*
 * @Author: HxB
 * @Date: 2024-05-09 14:18:51
 * @LastEditors: DoubleAm
 * @LastEditTime: 2024-05-13 12:23:32
 * @Description: useForceUpdate 自定义 hooks
 * @FilePath: \web_mods_base\main\_custom\hooks\useForceUpdate.ts
 */
import { useReducer } from 'react';

export const useForceUpdate = () => {
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  return forceUpdate;
};
