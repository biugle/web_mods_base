/*
 * @Author: HxB
 * @Date: 2023-12-21 17:31:18
 * @LastEditors: DoubleAm
 * @LastEditTime: 2024-01-08 16:38:52
 * @Description: 主程序页面
 * @FilePath: \web_mods_base\main\views\Home\index.tsx
 */
import React, { useEffect, useState } from 'react';
import './style.less';
import { Button, Empty, message } from 'antd';
import AdaptiveWebView from '@/components/AdaptWebView';
import TabContainer from '@/components/TabContainer';
import MenuFrame from '@/components/MenuFrame';
import ToolContainer from '@/components/ToolContainer';

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
      <MenuFrame />
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
        <ToolContainer />
        <div className="modules-wrapper">
          <TabContainer
            onChange={(key) => {
              setActiveTab(key);
              window.xIpc.send('change-mods', key);
            }}
            activeTab={activeTab}
            tabViews={tabViews}
          />
          <div id="webview-container">
            {/* <AdaptiveWebView src={'https://baidu.com'} /> */}
            {tabViews.length ? (
              tabViews.map((item) => (
                <AdaptiveWebView
                  key={item.name}
                  name={item.name}
                  src={window.xIpc.getModuleUrl(item)}
                  className={item.name === activeTab ? 'adapt-webview' : 'adapt-webview hidden'}
                />
              ))
            ) : (
              <Empty description="" style={{ margin: '25vh auto' }} />
            )}
          </div>
        </div>
      </div>
      <div id="fullscreen-container"></div>
    </div>
  );
};

export default Home;
