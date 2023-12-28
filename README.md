# web_mods_base

> 基于 Electron 实现的前端模组化客户端模板，使用类似微前端的模式进行不同框架项目之间的协同与管理，采用浏览器用户交互模式进行框架设计。

## @TODO

* `electron/store.ts` 用于存储全局数据信息
* `新开窗口与主窗口、窗口间、主窗口间通用 IPC`
* `404/401/403` 等状态提示组件
* `导航栏、登录` 开发
* `工具栏扩展`，比如：加载 URL、计算器等
* `安装卸载、配置操作等全局管理模块` 开发
* ...

## 主程序 Technology Stack

* React 17.x
* Redux+Toolkit
* TypeScript
* Scss/Less
* Ant Design 5.x
* Vite 4.x
* Electron
* EsLint
* Prettier
* Husky

> DevEnvTips: (node >= 14.20.0)、(npm >= 8.0.0)、(git >= 2.30.0)

## Start

* `npm install` or `npm run init`

> 若 `husky hooks` 安装失败，请检查是否已进行 `git init` 。

> 注意：若代码标红提示，请检查是否因为 `npm` 版本过低，导致安装了 `react18` 的声明文件。
> 可以使用 `npm install --no-optional` 来避免安装 `react18` 的声明文件。
> 或者直接升级 `npm` 版本

## Development

* `npm run dev`

## Preview

* `npm run preview`

## Build

* `npm run build`

## Code Check

* `npm run lint`

## Docs

* [Xxx](https://pandaoh.github.io/js-xxx/html/)
* [React](https://reactjs.bootcss.com/)
* [Redux Toolkit](http://cn.redux.js.org/redux-toolkit/overview/)
* [Vite](https://vitejs.cn/guide/)
* [Ant Design](https://ant.design/components/overview-cn/)
* [Ant Design ProComponents](https://procomponents.ant.design/components/)

## 模块开发说明

* 模块开发时必须在 `package.json` 中添加以下配置项

```json
{
  "name": "header", // 模块项目名称与 id，全局唯一，需与目录名保持一致。（为保证后续其他系统平台扩展，name 只能使用字母数字与下划线）
  "displayName": "Header模块", // 模块显示的名称
  "description": "Header模块，用于展示用户信息等。", // 模块的功能描述
  "version": "1.0.0", // 模块的版本信息
  "module_config": { // 模块的配置
    "type": "CORE", // 模块类型，CORE-核心模块 COMMON-通用模块 PROJECT-单独新开窗口的模块 MOD-普通模块
    "devURL": "http://localhost:9903", // 模块的开发环境入口地址
    "prodPath": "index.html", // 模块的生成环境入口地址，若多层请添加目录，比如 dist/index.html。
    "platform_version": "1.0.0",  // 模块依赖的最低平台版本-即本项目的最低版本
    "depends": ["login"],  // 模块依赖的其他模块，没有则不填。
    "project": "biugle_core" // 对应模块的 type 分组，方便后续显示。
  }
}
```

* 模块入口目录必须包含上面的 `package.json`，如果模块需要打包，需同时将 `package.json` 复制到模块的打包目录。
* 模块开发时可以使用主窗口的 `contextBridge-xIpc`（参考 `main\declare\global.d.ts`） 进行主窗口以及模块间的通讯与交互，禁止模块引入 `electron` api。
  * 包括读取所有模块信息
  * 获取模块加载地址
  * 控制窗口变化、数据等等等
* `window.xIpc.getModules()` 数据预览，数据均为实时读取生成，以下仅为参考，具体以实际数据为准。

```json
{
    "modulesMap": {
        "authenticator": {
            "name": "authenticator",
            "displayName": "认证模块",
            "description": "认证模块，用于身份认证。",
            "version": "1.0.0",
            "module_config": {
                "type": "CORE",
                "devURL": "http://localhost:9901",
                "prodPath": "index.html",
                "platform_version": "1.0.0",
                "project": "biugle_core"
            }
        },
        "footer": {
            "name": "footer",
            "displayName": "Footer模块",
            "description": "Footer模块，用于展示版权等信息。",
            "version": "1.0.0",
            "module_config": {
                "type": "CORE",
                "devURL": "http://localhost:9904",
                "prodPath": "index.html",
                "platform_version": "1.0.0",
                "project": "biugle_core"
            }
        },
        "header": {
            "name": "header",
            "displayName": "Header模块",
            "description": "Header模块，用于展示用户信息等。",
            "version": "1.0.0",
            "module_config": {
                "type": "CORE",
                "devURL": "http://localhost:9903",
                "prodPath": "index.html",
                "platform_version": "1.0.0",
                "project": "biugle_core"
            }
        },
        "navigation": {
            "name": "navigation",
            "displayName": "导航栏",
            "description": "导航栏，用于展示已安装的 MOD 模块。",
            "version": "1.0.0",
            "module_config": {
                "type": "CORE",
                "devURL": "http://localhost:9902",
                "prodPath": "index.html",
                "platform_version": "1.0.0",
                "project": "biugle_core"
            }
        },
    },
    "modulesList": [
        {
            "dirname": "authenticator",
            "modulePath": "F:\\WORKSPACINGGGGGG\\web_mods_base\\build\\modules\\authenticator",
            "pkgPath": "F:\\WORKSPACINGGGGGG\\web_mods_base\\build\\modules\\authenticator\\package.json",
            "name": "authenticator",
            "displayName": "认证模块",
            "description": "认证模块，用于身份认证。",
            "version": "1.0.0",
            "module_config": {
                "type": "CORE",
                "devURL": "http://localhost:9901",
                "prodPath": "index.html",
                "platform_version": "1.0.0",
                "project": "biugle_core"
            }
        },
        {
            "dirname": "footer",
            "modulePath": "F:\\WORKSPACINGGGGGG\\web_mods_base\\build\\modules\\footer",
            "pkgPath": "F:\\WORKSPACINGGGGGG\\web_mods_base\\build\\modules\\footer\\package.json",
            "name": "footer",
            "displayName": "Footer模块",
            "description": "Footer模块，用于展示版权等信息。",
            "version": "1.0.0",
            "module_config": {
                "type": "CORE",
                "devURL": "http://localhost:9904",
                "prodPath": "index.html",
                "platform_version": "1.0.0",
                "project": "biugle_core"
            }
        },
        {
            "dirname": "header",
            "modulePath": "F:\\WORKSPACINGGGGGG\\web_mods_base\\build\\modules\\header",
            "pkgPath": "F:\\WORKSPACINGGGGGG\\web_mods_base\\build\\modules\\header\\package.json",
            "name": "header",
            "displayName": "Header模块",
            "description": "Header模块，用于展示用户信息等。",
            "version": "1.0.0",
            "module_config": {
                "type": "CORE",
                "devURL": "http://localhost:9903",
                "prodPath": "index.html",
                "platform_version": "1.0.0",
                "project": "biugle_core"
            }
        },
    ]
}
```

* 模块之间的数据交互统一在主窗口进行
* 模块开发可以在 `modules` 下进行，也可以单独开发，后续只需打包完成后放在 `modules` 目录下即可。
  * 建议使用 `git submodules` 进行统一管理
* 目前主窗口与主程序均为开发者自己编写绘制，若改动需 UI 配合重新设计。
* 禁止泛滥引入插件，非必需插件不引入，能自己写就自己写，确保可控性。
* 更多问题疑问联系开发者
