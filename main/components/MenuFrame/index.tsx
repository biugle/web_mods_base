/*
 * @Author: HxB
 * @Date: 2023-04-27 14:42:28
 * @LastEditors: DoubleAm
 * @LastEditTime: 2024-01-08 16:36:17
 * @Description: 菜单边框
 * @FilePath: \web_mods_base\main\components\MenuFrame\index.tsx
 */
import React, { useEffect, useState } from 'react';
import AntIcon from '@/components/AntIcon';
import './style.less';

const MenuFrame = (props: { [key: string]: any }) => {
  const [isMaximized, setIsMaximized] = useState<boolean>(window.xIpc.isMaximized());

  useEffect(() => {
    window.xIpc.on('mainWindowStatusChange', (e, isMaximized) => {
      console.log({ isMaximized });
      setIsMaximized(isMaximized);
    });
    window.addEventListener('resize', () => {
      setIsMaximized(window.xIpc.isMaximized());
    });
  }, []);

  return (
    <div id="frame-container">
      <h1>前端模块化</h1>
      <div className="frame-toolbar"></div>
      <div className="frame-control">
        <AntIcon
          className="icon-btn reload"
          title="重新加载"
          onClick={() => {
            window.location.reload();
          }}
          icon="ReloadOutlined"
        />
        <AntIcon
          className="icon-btn"
          title="打开控制台"
          onClick={() => {
            window.xIpc.toggleDevTools();
          }}
          icon="CodeOutlined"
        />
        <AntIcon
          className="icon-btn"
          title="最小化"
          onClick={() => {
            window.xIpc.minimizeWindow();
          }}
          icon="MinusOutlined"
        />
        <AntIcon
          className="icon-btn"
          title="放大"
          style={{ display: isMaximized ? 'inline-block' : 'none' }}
          onClick={() => {
            window.xIpc.changeMainWindowStatus();
          }}
          icon="SwitcherOutlined"
        />
        <AntIcon
          className="icon-btn"
          title="缩小"
          style={{ display: isMaximized ? 'none' : 'inline-block' }}
          onClick={() => {
            window.xIpc.changeMainWindowStatus();
          }}
          icon="BorderOutlined"
        />
        <AntIcon
          className="icon-btn"
          title="退出"
          onClick={() => {
            window.xIpc.exit();
          }}
          icon="CloseOutlined"
        />
      </div>
    </div>
  );
};

export default MenuFrame;
