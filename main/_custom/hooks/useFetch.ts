/* eslint-disable indent */
/*
 * @Author: HxB
 * @Date: 2024-01-08 18:21:39
 * @LastEditors: DoubleAm
 * @LastEditTime: 2024-01-09 10:33:45
 * @Description: useFetch 自定义 hooks
 * @FilePath: \web_mods_base\main\_custom\hooks\useFetch.ts
 */
import { useState, useEffect, useCallback } from 'react';

const useFetch = (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  dataOrParams?: any,
  headers?: any,
) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const options: any = {
        method,
        headers: {
          ...(headers ?? {}),
          // 文件请求相关处理时需注意别写 content-type
          ...(!headers || headers?.isFile
            ? {}
            : {
                'content-type':
                  headers?.contentType ??
                  headers?.ContentType ??
                  headers['Content-Type'] ??
                  headers['content-type'] ??
                  headers['content-Type'] ??
                  'application/x-www-form-urlencoded;charset=UTF-8',
                // 'application/json;charset=UTF-8',
              }),
        },
      };

      let newUrl = url;

      if (dataOrParams) {
        if (method !== 'GET') {
          options.body = JSON.stringify(dataOrParams);
        } else {
          newUrl = `${url}${url.includes('?') ? '&' : '?'}${new URLSearchParams(dataOrParams).toString()}`;
        }
      }

      const response = await fetch(newUrl, options);
      const json = await response.json();

      if (response.ok) {
        setData(json);
      } else {
        setError(json);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [method, url, dataOrParams, headers]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, isLoading };
};

export default useFetch;
