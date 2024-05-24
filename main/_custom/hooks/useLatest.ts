/*
 * @Author: HxB
 * @Date: 2023-04-27 14:42:28
 * @LastEditors: DoubleAm
 * @LastEditTime: 2024-05-13 12:23:45
 * @Description: useLatest 自定义 hooks
 * @FilePath: \web_mods_base\main\_custom\hooks\useLatest.ts
 */
import { useRef, useLayoutEffect } from 'react';

const useLatest = <T>(value: T) => {
  const ref = useRef(value);
  ref.current = value;

  return ref;
};

// export function useLatest<T>(value: T) {
//   const ref = useRef(value);

//   useLayoutEffect(() => {
//     ref.current = value;
//   });

//   return ref;
// }

export default useLatest;
