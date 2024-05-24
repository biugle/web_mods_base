/*
 * @Author: HxB
 * @Date: 2023-04-27 14:42:28
 * @LastEditors: DoubleAm
 * @LastEditTime: 2024-05-13 11:56:32
 * @Description: TabContainer
 * @FilePath: \web_mods_base\main\components\TabContainer\index.tsx
 */
import React, { useEffect } from 'react';
import { emitEvent } from 'js-xxx';
import { Dropdown, Tabs } from 'antd';
import AntIcon from '@/components/AntIcon';
import './style.less';

const TabContainer = (props: { onChange: any; tabViews: any[]; activeTab: string; [key: string]: any }) => {
  // 监听 webview 点击，关闭 dropdown 。
  useEffect(() => {
    window.xIpc.on('webview-click', (event, webview) => {
      emitEvent('click', null, document.querySelector('#tab-container'));
      console.log(webview);
    });
  }, []);

  const renderMenus = (moduleName) => ({
    // 菜单多次渲染，首次加载可能会出现的 react 的内存泄露警告，升级 react 会解决这个问题，暂时不管。
    onClick: (menuInfo: any) => {
      menuInfo.domEvent.preventDefault();
      menuInfo.domEvent.stopPropagation();
      switch (menuInfo.key) {
        case 'refresh':
          window.xIpc.send('reload-module-page', moduleName);
          break;
        // case 'delete':
        //   window.xIpc.send('close-mods', moduleName);
        //   break;
        case 'left':
          window.xIpc.send('close-mods', moduleName, 'left');
          break;
        case 'right':
          window.xIpc.send('close-mods', moduleName, 'right');
          break;
        case 'other':
          window.xIpc.send('close-mods', moduleName, 'other');
          break;
        case 'dev':
          window.xIpc.send('toggle-module-devTools', moduleName);
          break;
      }
    },
    key: moduleName,
    items: [
      {
        label: '刷新模块',
        key: 'refresh',
        icon: <AntIcon icon="UndoOutlined" />,
      },
      // {
      //   label: '删除标签',
      //   key: 'delete',
      //   icon: <AntIcon icon="DeleteOutlined" />,
      // },
      {
        label: '关闭左侧',
        key: 'left',
        icon: <AntIcon icon="VerticalRightOutlined" />,
      },
      {
        label: '关闭右侧',
        key: 'right',
        icon: <AntIcon icon="VerticalLeftOutlined" />,
      },
      {
        label: '关闭其他',
        key: 'other',
        icon: <AntIcon icon="ColumnWidthOutlined" />,
      },
      {
        label: '调试面板',
        key: 'dev',
        icon: <AntIcon icon="BugOutlined" />,
      },
    ],
  });

  return (
    <div id="tab-container">
      <div className="tabs-box">
        <Tabs
          hideAdd
          size="small"
          onChange={props.onChange}
          activeKey={props.activeTab}
          type="editable-card"
          onEdit={(targetKey: string, action: 'add' | 'remove') => {
            if (action === 'remove') {
              window.xIpc.send('close-mods', targetKey);
            }
          }}
          items={props.tabViews.map((i: any) => ({
            key: i.name,
            label: (
              <Dropdown
                destroyPopupOnHide={true}
                key={i.name}
                autoFocus
                trigger={['contextMenu']}
                menu={renderMenus(i.name)}
              >
                <div>{i.displayName}</div>
              </Dropdown>
            ),
          }))}
        />
      </div>
      <div className="tabs-options">
        <AntIcon
          className="icon-btn"
          title="后退"
          onClick={() => {
            window.xIpc.send('change-module-history', props.activeTab, 'back');
          }}
          icon="LeftCircleOutlined"
        ></AntIcon>
        <AntIcon
          className="icon-btn"
          title="前进"
          onClick={() => {
            window.xIpc.send('change-module-history', props.activeTab, 'forward');
          }}
          icon="RightCircleOutlined"
        ></AntIcon>
        <AntIcon
          className="icon-btn"
          title="关闭所有模块"
          onClick={() => {
            window.xIpc.send('close-mods', undefined);
          }}
          icon="CloseCircleTwoTone"
        ></AntIcon>
        <AntIcon
          className="icon-btn"
          title="打开模块控制台"
          onClick={() => {
            window.xIpc.send('toggle-module-devTools', props.activeTab);
          }}
          icon="ChromeOutlined"
        ></AntIcon>
        <AntIcon
          className="icon-btn reload"
          title="刷新模块"
          onClick={() => {
            window.xIpc.send('reload-module-page', props.activeTab);
          }}
          icon="SyncOutlined"
        ></AntIcon>
      </div>
    </div>
  );
};

export default TabContainer;
