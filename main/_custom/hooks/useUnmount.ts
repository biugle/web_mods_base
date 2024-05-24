/*
 * @Author: HxB
 * @Date: 2023-04-27 14:42:28
 * @LastEditors: DoubleAm
 * @LastEditTime: 2024-05-13 12:24:52
 * @Description: useUnmounted 自定义 hooks
 * @FilePath: \web_mods_base\main\_custom\hooks\useUnmount.ts
 */
import { useEffect, useRef } from 'react';

const useUnmounted = (fn: () => void) => {
  const ref = useRef(fn);
  ref.current = fn;

  useEffect(
    () => () => {
      fn?.();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
};

export default useUnmounted;
