/*
 * @Author: HxB
 * @Date: 2024-05-09 14:20:06
 * @LastEditors: DoubleAm
 * @LastEditTime: 2024-05-13 12:24:19
 * @Description: useOnceEffect
 * @FilePath: \web_mods_base\main\_custom\hooks\useOnceEffect.ts
 */
import { useRef, useEffect } from 'react';

export const useOnceEffect = (fn: () => void, deps?: any[]) => {
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current === false) {
      fn?.();
      ref.current = true;
    }
  }, deps || []);
};
