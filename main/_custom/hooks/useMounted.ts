/*
 * @Author: HxB
 * @Date: 2023-04-27 14:42:28
 * @LastEditors: DoubleAm
 * @LastEditTime: 2024-05-13 12:24:13
 * @Description: useMounted 自定义 hooks
 * @FilePath: \web_mods_base\main\_custom\hooks\useMounted.ts
 */
import { useEffect } from 'react';

const useMounted = (fn: () => void) => {
  useEffect(() => {
    fn?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useMounted;
