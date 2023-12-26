/*
 * @Author: HxB
 * @Date: 2023-12-21 17:31:18
 * @LastEditors: DoubleAm
 * @LastEditTime: 2023-12-26 14:23:12
 * @Description: 主程序页面
 * @FilePath: \web_mods_base\main\views\Home\index.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import './style.less';
import { Button, Tabs, Tag, message } from 'antd';
import AdaptiveWebView from '@/components/AdaptWebView';
import AntIcon from '@/components/AntIcon';

const Home = () => {
  const [tabViews, setTabViews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    window.xIpc
      .getModules()
      .then((data: any) => {
        setModules(data.modulesList);
      })
      .catch((e) => {
        console.log(e);
        message.error('获取模块失败');
      });

    window.xIpc.on('mods-state', (e, activeTab, modsMap, modsList) => {
      console.log('mods-state', { activeTab, modsMap, modsList });
      setActiveTab(activeTab);
      setTabViews(Object.values(modsMap));
    });
    window.xIpc.send('change-mods', undefined);
  }, []);

  return (
    <div data-component="Home">
      <div id="frame-container"></div>
      <div id="nav-container">
        <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', padding: '10px' }}>
          {modules.map((item) => (
            <Button
              style={{ margin: '5px' }}
              key={item.name}
              disabled={item.name === activeTab}
              onClick={() => {
                window.xIpc.send('change-mods', item);
              }}
            >
              {item.displayName}
            </Button>
          ))}
        </div>
      </div>
      <div className="main">
        <div id="tab-container">
          <span
            className="tool-icon-btn"
            onClick={() => {
              document.getElementById('tool-container').classList.toggle('collapsed');
              document.querySelector('.tool-icon-btn').classList.toggle('collapsed');
            }}
          >
            <AntIcon className="tool-open-icon" icon="MenuUnfoldOutlined"></AntIcon>
            <AntIcon className="tool-close-icon" icon="MenuFoldOutlined"></AntIcon>
          </span>
          <div style={{ marginLeft: '15px', maxWidth: 'calc(100% - 210px)' }}>
            <Tabs
              hideAdd
              size="small"
              onChange={(key) => {
                setActiveTab(key);
              }}
              activeKey={activeTab}
              type="editable-card"
              onEdit={(targetKey: string, action: 'add' | 'remove') => {
                if (action === 'remove') {
                  window.xIpc.send('close-mods', targetKey);
                }
              }}
              items={tabViews.map((i: any) => ({
                key: i.name,
                label: i.displayName,
              }))}
            />
          </div>
          <div style={{ marginLeft: 'auto', width: '210px', display: 'flex', justifyContent: 'flex-end' }}>
            <AntIcon
              className="icon-btn"
              onClick={() => {
                window.xIpc.send('change-module-history', activeTab, 'back');
              }}
              icon="LeftCircleOutlined"
            ></AntIcon>
            <AntIcon
              className="icon-btn"
              onClick={() => {
                window.xIpc.send('change-module-history', activeTab, 'forward');
              }}
              icon="RightCircleOutlined"
            ></AntIcon>
            <AntIcon
              className="icon-btn"
              onClick={() => {
                window.xIpc.send('close-mods', undefined);
              }}
              icon="CloseCircleTwoTone"
            ></AntIcon>
            <AntIcon
              className="icon-btn"
              onClick={() => {
                window.xIpc.send('toggle-module-devTools', activeTab);
              }}
              icon="ChromeOutlined"
            ></AntIcon>
            <AntIcon
              className="icon-btn reload"
              onClick={() => {
                window.xIpc.send('reload-module-page', activeTab);
              }}
              icon="SyncOutlined"
            ></AntIcon>
          </div>
        </div>
        <div className="modules-wrapper">
          <div id="tool-container"></div>
          <div id="webview-container">
            {/* <AdaptiveWebView src={'https://baidu.com'} /> */}
            {tabViews.map((item) => (
              <AdaptiveWebView
                key={item.name}
                name={item.name}
                src={window.xIpc.getModuleUrl(item.name)}
                className={item.name === activeTab ? 'adapt-webview' : 'adapt-webview hidden'}
              />
            ))}
          </div>
        </div>
      </div>
      <div id="fullscreen-container"></div>
    </div>
  );
};

export default Home;
