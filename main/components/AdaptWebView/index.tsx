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
      // const parentHeight = webviewRef.current.parentElement?.offsetHeight || 0;
      // webviewRef.current.style.height = `${parentHeight}px`;
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
        if (!webviewRef.current?.isDevToolsOpened()) {
          webviewRef.current?.openDevTools();
        } else {
          webviewRef.current?.closeDevTools();
        }
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

  const changeHistory = useCallback(
    (e: any, moduleName: string, type: 'back' | 'forward') => {
      if (props.name === moduleName) {
        type === 'back' ? webviewRef.current?.goBack() : webviewRef.current?.goForward();
      }
    },
    [props.name],
  );

  useEffect(() => {
    const webview = webviewRef.current;

    eventListenersRef.current = {
      handleDomReady,
      handleNewWindow,
      handleResize,
      openDevTools,
      reloadWebView,
      changeHistory,
    };

    webview?.addEventListener('dom-ready', eventListenersRef.current.handleDomReady);
    webview?.addEventListener('dom-ready', () => {
      // 在 WebView 中执行 JavaScript 代码
      webview?.executeJavaScript(`
        // 添加一个点击事件处理程序
        document.addEventListener('click', function() {
          // 通过 xIpc 传递到主窗口
          window.xIpc.send('webview-click', { name: ${JSON.stringify(props.name)} }); 
        });
      `);
    });
    webview?.addEventListener('new-window', eventListenersRef.current.handleNewWindow);
    window.addEventListener('resize', eventListenersRef.current.handleResize);
    window.xIpc.on('toggle-module-devTools', eventListenersRef.current.openDevTools);
    window.xIpc.on('reload-module-page', eventListenersRef.current.reloadWebView);
    window.xIpc.on('change-module-history', eventListenersRef.current.changeHistory);

    return () => {
      webview?.removeEventListener('dom-ready', eventListenersRef.current.handleDomReady);
      webview?.removeEventListener('new-window', eventListenersRef.current.handleNewWindow);
      window.removeEventListener('resize', eventListenersRef.current.handleResize);
      window.xIpc.remove('toggle-module-devTools', eventListenersRef.current.openDevTools);
      window.xIpc.remove('reload-module-page', eventListenersRef.current.reloadWebView);
      window.xIpc.remove('change-module-history', eventListenersRef.current.changeHistory);
    };
  }, [props, handleDomReady, handleNewWindow, handleResize, openDevTools, reloadWebView, changeHistory]);

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
