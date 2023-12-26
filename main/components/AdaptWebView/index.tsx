import React, { useLayoutEffect, useRef } from 'react';
import './style.less';

const AdaptiveWebView = (props: { src: string; [key: string]: any }) => {
  const webviewRef = useRef<any>(null);
  // 以如果不想让 webview 默认加载某个网站，可以初始化为 about:blank 或者 data:text/plain 。
  // webview.openDevTools();
  // https://www.electronjs.org/zh/docs/latest/api/webview-tag

  useLayoutEffect(() => {
    const webview = webviewRef.current;

    const updateWebViewHeight = () => {
      requestAnimationFrame(() => {
        const parentHeight = webview.parentElement?.offsetHeight || 0;
        webview.style.height = `${parentHeight}px`;
      });
    };

    const handleDomReady = () => {
      updateWebViewHeight();
    };

    const handleNewWindow = (event: any) => {
      event.preventDefault();
      const url = event.url;
      // @ts-ignore
      window.xIpc.send('open-new-window', url);
    };

    const handleResize = () => {
      updateWebViewHeight();
    };

    webview?.addEventListener('dom-ready', handleDomReady);
    webview?.addEventListener('new-window', handleNewWindow);
    window.addEventListener('resize', handleResize);

    return () => {
      webview?.removeEventListener('dom-ready', handleDomReady);
      webview?.removeEventListener('new-window', handleNewWindow);
      window.removeEventListener('resize', handleResize);
      // 清理其他可能附加的事件监听器
    };
  }, [props.src]);

  return (
    <webview
      // @ts-ignore
      // eslint-disable-next-line react/no-unknown-property
      autosize="on"
      // @ts-ignore
      // eslint-disable-next-line react/no-unknown-property
      allowpopups="true"
      // @ts-ignore
      // eslint-disable-next-line react/no-unknown-property
      nodeintegration="true"
      // @ts-ignore
      // eslint-disable-next-line react/no-unknown-property
      preload={window.xIpc.getPreloadJSPath()}
      ref={webviewRef}
      className="adapt-webview"
      {...props}
    />
  );
};

export default AdaptiveWebView;
