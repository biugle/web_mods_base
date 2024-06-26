/*
 * @Author: HxB
 * @Date: 2024-01-08 18:21:39
 * @LastEditors: DoubleAm
 * @LastEditTime: 2024-05-13 12:23:21
 * @Description: useData 自定义 hooks，支持重置数据。
 * @FilePath: \web_mods_base\main\_custom\hooks\useData.ts
 */
import { useState } from 'react';

const useData = (initialData: any) => {
  const [data, setData] = useState(initialData);

  const updateData = (key, value) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const resetData = () => {
    setData(initialData);
  };

  return [data, updateData, resetData];
};

export default useData;
