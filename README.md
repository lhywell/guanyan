# vue2-framework-lint

## 简介
在官方脚手架创建的项目基础上，补充了部分代码。**推荐使用 yarn 进行代码的安装和管理**

- 管理员：admin；密码：any
- 普通用户：normal；密码：any

## 基础配置信息
- vue2.6
- element-ui
- sass
- axios

## 项目运行

1. 安装依赖

```bash
yarn setup //安装依赖

// 或者
yarn
yarn postinstall //安装husky依赖
```

2. 运行

```bash
yarn serve //开发
yarn test //测试
yarn build //生产
```

3. 代码提交

```bash
git add .
yarn commit
```

4. 更新 `CHANGELOG.md`

```bash
yarn release
```

## 浏览器兼容

[![IE / Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png)](https://godban.github.io/browsers-support-badges/)<br>**IE / Edge** | [![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png)](https://godban.github.io/browsers-support-badges/)<br>**Firefox** | [![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png)](https://godban.github.io/browsers-support-badges/)<br>**Chrome** | [![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png)](https://godban.github.io/browsers-support-badges/)<br>**Safari**
:---:|:---:|:---:|:---:
IE10, IE11, Edge | last 2 versions | last 2 versions | last 2 versions

## 开发工具：推荐使用VSCode
框架使用：Prettier + ESLint + Styleliint 规范代码  
推荐安装以下插件

Logo | 名称 | 介绍
:---:|---|:---
<img src="https://johnsoncodehk.gallerycdn.vsassets.io/extensions/johnsoncodehk/volar/0.29.5/1636956426311/Microsoft.VisualStudio.Services.Icons.Default" width="50" /> | **Vetur** | Vue 语法高亮、格式化、智能感知、错误检查等
<img src="https://dbaeumer.gallerycdn.vsassets.io/extensions/dbaeumer/vscode-eslint/2.2.2/1634813919455/Microsoft.VisualStudio.Services.Icons.Default" width="50" /> | **ESLint** | JS 代码规范校验
<img src="https://esbenp.gallerycdn.vsassets.io/extensions/esbenp/prettier-vscode/9.0.0/1632149351877/Microsoft.VisualStudio.Services.Icons.Default" width="50" /> | **Prettier** | JS/HTML/CSS 代码规范校验
<img src="https://stylelint.gallerycdn.vsassets.io/extensions/stylelint/vscode-stylelint/1.2.1/1637258001753/Microsoft.VisualStudio.Services.Icons.Default" width="50" /> | **Stylelint** | CSS 规范校验


## 目录

```javascript
|-- vue2-framework-lint
    |-- .browserslistrc //浏览器支持范围配置
    |-- .editorconfig //编辑器规范配置
    |-- .eslintignore //eslint忽略规则
    |-- .eslintrc.js //eslint配置
    |-- .gitignore //git提交忽略规则
    |-- .lintstagedrc //commit校验配置
    |-- .prettierignore //prettier忽略规则
    |-- .prettierrc //prettier配置
    |-- .stylelinti-css.js //stylelint规则
    |-- .stylelinti-scss.js //stylelint规则
    |-- .stylelintignore //stylelint忽略规则
    |-- .stylelintrc.json //stylelint配置
    |-- .versionrc.json //CHANGELOG配置
    |-- README.md //项目说明
    |-- CHANGELOG.md //发版说明
    |-- babel.config.js //babel配置
    |-- commitlint.config.js //commitlint配置
    |-- jsconfig.json //根目录说明
    |-- package.json //依赖说明
    |-- vue.config.js  //vue配置
    |-- yarn.lock
    |-- .husky  //Git hooks 工具
    |   |-- commit-msg
    |   |-- pre-commit
    |   |-- _
    |       |-- .gitignore
    |       |-- husky.sh
    |-- .vscode //vscode配置
    |   |-- settings.json
    |-- mock //模拟请求
    |   |-- index.js
    |   |-- mock-server.js
    |   |-- utils.js
    |   |-- controllers
    |       |-- user.js
    |-- public
    |   |-- favicon.ico
    |   |-- index.html
    |-- src
        |-- App.vue //主模板
        |-- main.js //入口js
        |-- assets
        |   |-- sass
        |       |-- index.scss
        |       |-- common
        |           |-- base.scss //样式重置
        |           |-- element-ui.scss //element样式重置
        |           |-- element-variables.scss //element主题重置
        |           |-- mixins.scss //样式混入
        |           |-- rem.scss //rem配置
        |           |-- variables.scss //scss变量配置
        |-- common
        |   |-- axios //请求封装
        |   |   |-- index.js
        |   |-- conf
        |   |   |-- config.js //配置请求地址 和 token key
        |   |   |-- utils.js //常用工具
        |   |-- directive //自定义指令
        |       |-- permission //权限控制
        |           |-- index.js
        |           |-- permission.js
        |-- components
        |   |-- error-page //错误页面组件
        |       |-- index.vue
        |       |-- images
        |           |-- 401.png
        |           |-- 404.png
        |           |-- 500.png
        |-- layout //布局
        |   |-- index.vue
        |   |-- components
        |       |-- Breadcrumb.vue
        |       |-- HeaderBar.vue
        |       |-- SideBar
        |           |-- SidebarItem.vue
        |           |-- index.vue
        |-- router
        |   |-- index.js
        |   |-- permission.js //路由守卫
        |   |-- modules
        |       |-- content.js
        |-- store
        |   |-- getters.js
        |   |-- index.js
        |   |-- modules
        |       |-- permission.js //动态生成路由
        |       |-- user.js
        |-- views
            |-- content
            |   |-- clues
            |   |   |-- index.vue
            |   |-- material
            |   |   |-- index.vue
            |   |-- weixin
            |       |-- index.vue
            |-- dashboard
            |   |-- echart.js
            |   |-- index.vue
            |   |-- admin
            |   |   |-- index.vue
            |   |-- normal
            |       |-- index.vue
            |-- error-page
            |   |-- 401.vue
            |   |-- 404.vue
            |-- login
            |   |-- index.scss
            |   |-- index.vue
            |   |-- images
            |       |-- login-left.png
            |       |-- login.jpg
            |-- switch-roles
                |-- index.vue

```

## 配置参考

- `.eslintrc.js` 参考：[Eslint Rules](https://cloud.tencent.com/developer/chapter/12618)
- `.prettierrc` 参考：[Prettier Options](https://prettier.io/docs/en/options.html)
- `.stylelint.json` 参考：[Stylelint Rules](http://stylelint.docschina.org/user-guide/rules/)
- `jsconfig.js` 参考：[jsconfig.json 中文文档](https://juejin.cn/post/6930549887402672135) and [tsc CLI Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- `commitlint` 参考：[Commit message 和 Change log 编写指南](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
