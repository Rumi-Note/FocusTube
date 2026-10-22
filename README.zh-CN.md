# FocusTube 专注模式

[English](README.md) | [简体中文](README.zh-CN.md)

FocusTube 是一个 Manifest V3 Chrome 扩展，可在 YouTube 视频页为当前视频区域和播放器外的其他内容分别添加半透明、可模糊的遮罩。两部分可以独立调节；视频遮罩不会拦截播放、暂停、进度条或音量控制。进入全屏后遮罩自动隐藏。

## 功能

- 一键启用或关闭全部专注遮罩
- 当前视频区域：独立调节透明度（0%–95%）和模糊度（0–30 px）
- 其他区域：独立调节透明度（0%–95%）和模糊度（0–30 px）
- 视频边缘留白：0–40 px
- 自动适配普通视频、影院模式、Shorts、滚动、窗口缩放和 YouTube 单页导航
- 内置英文和简体中文，自动跟随 Chrome 界面语言；其他语言环境默认显示英文
- 设置通过 Chrome Sync 保存，并兼容旧版外围遮罩参数
- 不含分析、广告、开发者服务器或远程代码

## 本地安装

1. 打开 Chrome 扩展管理页。
2. 开启右上角「开发者模式」。
3. 点击「加载已解压的扩展程序」。
4. 选择克隆或解压后的 FocusTube 项目文件夹。
5. 打开或刷新一个 YouTube 视频页，点击工具栏中的 FocusTube 图标调节效果。

修改代码后，需要在扩展管理页的 FocusTube 卡片上点击「重新加载」，再刷新 YouTube 页面。

## Chrome Web Store 发布材料

- 图标源文件：`images/focustube-icon.svg`
- 16/32/48/128 px 图标：`icons/`
- 440 × 280 宣传图：`store-assets/small-promo-440x280.png`
- 中英文商店文案：`store-listing/STORE_LISTING.md`
- 隐私政策源文件：`store-listing/PRIVACY_POLICY.md`
- GitHub Pages 页面：`docs/privacy-policy.html`
- 公开隐私政策：[FocusTube Privacy Policy](https://rumi-note.github.io/FocusTube/privacy-policy.html)
- 完整发布清单：`store-listing/PUBLISHING_CHECKLIST.md`

公开截图中不要显示私人账号信息或无权使用的视频画面。

## 语言

- 英文：`_locales/en/messages.json`
- 简体中文：`_locales/zh_CN/messages.json`
- 默认语言：英文

## 隐私与权限

- `storage`：只保存开关和 5 个显示参数到 Chrome Sync。
- `activeTab`：用户点击扩展后，将当前设置发送给正在打开的 YouTube 标签；不读取浏览历史。
- `https://www.youtube.com/*`：仅在浏览器本地定位播放器并绘制遮罩，不向外传输页面或视频数据。

## 开发验证

```sh
npm test
npm run check
```

YouTube 可能调整页面结构；如果未来无法识别播放器，需要更新 `content.js` 中的播放器选择器。
