/*
 * @Author: HxB
 * @Date: 2023-12-21 17:31:18
 * @LastEditors: DoubleAm
 * @LastEditTime: 2023-12-25 17:28:05
 * @Description: 主程序页面
 * @FilePath: \web_mods_base\main\views\Home\index.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import './style.less';
import { Button, Tag, message } from 'antd';
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
        <div id="tool-container"></div>
        <div className="modules">
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
            <div style={{ marginLeft: '10px' }}>
              {tabViews.map((item) => (
                <Tag
                  key={item.name}
                  style={{ cursor: 'pointer' }}
                  color={item.name === activeTab ? 'geekblue' : 'default'}
                  onClick={() => {
                    window.xIpc.send('close-mods', item.name);
                  }}
                >
                  {item.displayName}
                </Tag>
              ))}
            </div>
          </div>
          <div id="webview-container">
            {tabViews.map((item) => (
              <AdaptiveWebView
                key={item.name}
                src={window.xIpc.getModuleUrl(item.name)}
                style={{ display: item.name === activeTab ? 'block' : 'none' }}
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
