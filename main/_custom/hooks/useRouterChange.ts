/*
 * @Author: HxB
 * @Date: 2023-04-27 15:38:29
 * @LastEditors: DoubleAm
 * @LastEditTime: 2024-05-13 12:24:26
 * @Description: useRouterChange 自定义 hooks
 * @FilePath: \web_mods_base\main\_custom\hooks\useRouterChange.ts
 */
import { XCall } from 'js-xcall';
import { useEffect } from 'react';

const useRouterChange = (fn: (from: string, to: string) => void): void => {
  useEffect(() => {
    XCall.addCallBack('routerChange', fn);

    return () => {
      XCall.removeCallBack('routerChange', fn);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useRouterChange;
