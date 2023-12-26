import React, { useEffect, useRef, useCallback } from 'react';
import './style.less';

const AdaptiveWebView = (props: { src: string; name?: string; [key: string]: any }) => {
  const webviewRef = useRef<any>(null);
  const eventListenersRef = useRef<any>(null);

  // 以如果不想让 webview 默认加载某个网站，可以初始化为 about:blank 或者 data:text/plain 。
  // data:text/html;base64,PGh0bWwgY29udGVudGVkaXRhYmxlPmVkaXQgaGVyZTwvaHRtbD4=
  // webview.stop();
  // webview.reload();
  // webview.openDevTools();
  // https://www.electronjs.org/zh/docs/latest/api/webview-tag
  // https://www.electronjs.org/zh/docs/latest/api/webview-tag#%E6%96%B9%E6%B3%95
  // https://www.electronjs.org/zh/docs/latest/api/webview-tag#dom-%E4%BA%8B%E4%BB%B6

  const updateWebViewHeight = useCallback(() => {
    requestAnimationFrame(() => {
      const parentHeight = webviewRef.current.parentElement?.offsetHeight || 0;
      webviewRef.current.style.height = `${parentHeight}px`;
    });
  }, []);

  const handleDomReady = useCallback(() => {
    updateWebViewHeight();
  }, [updateWebViewHeight]);

  const handleNewWindow = useCallback((event: any) => {
    event.preventDefault();
    const url = event.url;
    // @ts-ignore
    window.xIpc.send('open-new-window', url);
  }, []);

  const handleResize = useCallback(() => {
    updateWebViewHeight();
  }, [updateWebViewHeight]);

  const openDevTools = useCallback(
    (e: any, moduleName: string) => {
      if (props.name === moduleName) {
        webviewRef.current?.openDevTools();
      }
    },
    [props.name],
  );

  const reloadWebView = useCallback(
    (e: any, moduleName: string) => {
      if (props.name === moduleName) {
        webviewRef.current?.reload();
      }
    },
    [props.name],
  );

  useEffect(() => {
    const webview = webviewRef.current;

    eventListenersRef.current = { handleDomReady, handleNewWindow, handleResize, openDevTools, reloadWebView };

    webview?.addEventListener('dom-ready', eventListenersRef.current.handleDomReady);
    webview?.addEventListener('new-window', eventListenersRef.current.handleNewWindow);
    window.addEventListener('resize', eventListenersRef.current.handleResize);
    window.xIpc.on('open-module-devTools', eventListenersRef.current.openDevTools);
    window.xIpc.on('reload-module-page', eventListenersRef.current.reloadWebView);

    return () => {
      webview?.removeEventListener('dom-ready', eventListenersRef.current.handleDomReady);
      webview?.removeEventListener('new-window', eventListenersRef.current.handleNewWindow);
      window.removeEventListener('resize', eventListenersRef.current.handleResize);
      window.xIpc.remove('open-module-devTools', eventListenersRef.current.openDevTools);
      window.xIpc.on('reload-module-page', eventListenersRef.current.reloadWebView);
    };
  }, [handleDomReady, handleNewWindow, handleResize, openDevTools, reloadWebView]);

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
