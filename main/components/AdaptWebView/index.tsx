/*
 * @Author: HxB
 * @Date: 2023-12-23 14:10:06
 * @LastEditors: DoubleAm
 * @LastEditTime: 2023-12-25 10:28:56
 * @Description: 自定义 webview
 * @FilePath: \web_mods_base\main\components\AdaptWebView\index.tsx
 */
import React, { useEffect, useRef } from 'react';
import './style.less';

const AdaptiveWebView = (props: { src: string; [key: string]: any }) => {
  const webviewRef = useRef<any>(null);

  useEffect(() => {
    const webview = webviewRef.current;

    const handleDomReady = () => {
      requestAnimationFrame(() => {
        const parentHeight = webview.parentElement?.offsetHeight || 0;
        webview.style.height = `${parentHeight}px`;
      });
    };

    const handleNewWindow = (event: any) => {
      event.preventDefault();
      const url = event.url;
      // @ts-ignore
      window.xIpc.send('open-new-window', url);
    };

    webview?.addEventListener('dom-ready', handleDomReady);
    webview?.addEventListener('new-window', handleNewWindow);

    return () => {
      webview?.removeEventListener('dom-ready', handleDomReady);
      webview?.removeEventListener('new-window', handleNewWindow);
      // 清理其他可能附加的事件监听器
    };
  }, [props.src]);

  return (
    <webview
      // @ts-ignore
      // eslint-disable-next-line react/no-unknown-property, prettier/prettier
      autosize="on"
      className="adapt-webview"
      // @ts-ignore
      // eslint-disable-next-line react/no-unknown-property, prettier/prettier
      allowpopups="true"
      // @ts-ignore
      // eslint-disable-next-line react/no-unknown-property, prettier/prettier, no-undef
      nodeintegration="true"
      // @ts-ignore
      // eslint-disable-next-line react/no-unknown-property
      preload={window.xIpc.getPreloadJSPath()}
      ref={webviewRef}
      {...props}
    />
  );
};

export default AdaptiveWebView;
