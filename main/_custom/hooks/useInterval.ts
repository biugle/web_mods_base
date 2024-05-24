/*
 * @Author: HxB
 * @Date: 2023-04-27 14:42:28
 * @LastEditors: DoubleAm
 * @LastEditTime: 2024-05-13 12:23:38
 * @Description: useInterval 自定义 hooks
 * @FilePath: \web_mods_base\main\_custom\hooks\useInterval.ts
 */
import { useEffect } from 'react';
import useLatest from './useLatest';

const useInterval = (fn: () => void, delay?: number, immediate?: boolean): void => {
  const fnRef = useLatest(fn);

  useEffect(() => {
    if (!delay || delay < 0) return;
    if (immediate) fnRef.current();

    const timer = setInterval(() => {
      fnRef.current();
    }, delay);

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);
};

export default useInterval;
