/*
 * @Author: HxB
 * @Date: 2023-04-27 14:42:28
 * @LastEditors: DoubleAm
 * @LastEditTime: 2024-01-08 16:55:10
 * @Description: 工具栏
 * @FilePath: \web_mods_base\main\components\ToolContainer\index.tsx
 */
import React from 'react';
import AntIcon from '@/components/AntIcon';
import './style.less';

const ToolContainer = (props: { [key: string]: any }) => {
  return (
    <div id="tool-container" className="collapsed">
      <div
        className="tool-icon-btn"
        onClick={() => {
          document.getElementById('tool-container').classList.toggle('collapsed');
        }}
      >
        <h5 className="tool-title">工具栏</h5>
        <AntIcon title="展开" className="tool-open-icon" icon="MenuUnfoldOutlined"></AntIcon>
        <AntIcon title="收起" className="tool-close-icon" icon="MenuFoldOutlined"></AntIcon>
      </div>
    </div>
  );
};

export default ToolContainer;
