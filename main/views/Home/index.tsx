/*
 * @Author: HxB
 * @Date: 2023-12-21 17:31:18
 * @LastEditors: DoubleAm
 * @LastEditTime: 2023-12-25 10:58:36
 * @Description: 主程序页面
 * @FilePath: \web_mods_base\main\views\Home\index.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import './style.less';
import AdaptiveWebView from '@/components/AdaptWebView';

const Home = () => {
  const webviewRef = useRef(null);
  const [webviewHeight, setWebviewHeight] = useState(0);

  useEffect(() => {
    // const resizeWebview = () => {
    //   const containerHeight = document.querySelector('.webview-wrapper').clientHeight;
    //   setWebviewHeight(containerHeight);
    // };

    // window.addEventListener('resize', resizeWebview);
    // resizeWebview();

    // 监听新窗口请求
    // const handleNewWindow = (e) => {
    //   e.preventDefault(); // 阻止默认行为，不在新窗口中打开链接
    //   const url = e.targetUrl; // 获取新窗口的链接地址
    //   webviewRef.current.loadURL(url); // 在同一个 Webview 中加载链接
    // };

    // // 监听 Webview 的新窗口事件
    // webviewRef.current.addEventListener('new-window', handleNewWindow);

    return () => {
      // window.removeEventListener('resize', resizeWebview);
      // webviewRef.current.removeEventListener('new-window', handleNewWindow);
    };
  }, []);

  return (
    <div data-component="Home">
      <div id="webview-container">
        <div className="webview-wrapper">
          <AdaptiveWebView src="https://www.baidu.com" />
        </div>
        <div className="webview-wrapper">
          <AdaptiveWebView src={window.xIpc.getModuleUrl('header', { q: 'test12345' })} />
        </div>
      </div>
    </div>
  );
};

export default Home;
