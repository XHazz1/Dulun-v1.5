# 渡轮 - 抖音解析 (Dulun v1.5 自研魔改版)

一个基于 Manifest V3 的抖音网页解析下载扩展：**暗黑极简 UI**、**无水印**解析视频、图文与实况动图，点一下按钮就能把内容落到本地。

> 本改版基于 JKP-Video-Downloader 2.3.1 二次开发，解析层重构、UI 全套替换。仅限个人学习与备份使用。

---

## 项目简介

- **暗黑极简风**：设置页重做为纯黑底 + 紫色微光，底部鼠标跟随光斑由 `ui-effects.js` 统一驱动。
- **无水印解析**：视频直链自动把 `playwm` 替换为 `play`，拿到无水印原画。
- **三类资源全覆盖**：普通视频（mp4 直链）、图文（`images[]` 最高清 `original_url`）、实况动图（`static_url` + `live_video_url` 成对解析）。
- **按需下载**：设置页三个开关（视频 / 图文 / 实况）决定解析出哪些列表，未勾选的类型直接返回空数组，不浪费请求。
- **请求头补齐**：通过 `declarativeNetRequest` 为 `*.douyin.com` 与视频 CDN 注入 `Referer: https://www.douyin.com/` 与完整浏览器 UA，绕过缺 Referer 导致的 403 防盗链。
- **过程可感知**：点击按钮先弹「正在解析...」，完成后按结果弹「已开始下载 N 项 / 部分失败 / 下载失败」。

## 功能特性

| 能力 | 说明 |
| --- | --- |
| 视频解析 | React fiber / `_ROUTER_DATA` 主链路 + `aweme/v1/play` 数字 video_id 二级兜底 |
| 图文解析 | `images[].url_list`，优先 `original_url` 最高清原图 |
| 实况解析 | `live_photo` 的静态图与动态视频成对提取，缺一不可 |
| 无损直链 | 全局 `playwm` → `play` |
| 请求头注入 | DNR 静态规则 + 启动时用真实 `navigator.userAgent` 覆盖的动态规则 |
| 文件名逻辑 | 设置页可选主逻辑 / 备用逻辑（作者、描述、分辨率、vid 组合） |
| 下载提示 | 全局 Toast（`window.DulunUI.showToast`），旧 snackbar 作为回退 |

## 使用方法

### 1. 下载

下载发布页的 `Dulun-v1.5.zip`（或直接克隆本仓库）。

### 2. 解压

把 ZIP 解压到任意固定目录，例如 `D:\douyin\推荐用的扩展\Dulun-v1.5`。

> 解压后目录里必须能直接看到 `manifest.json`，不要多套一层文件夹。

### 3. 加载扩展

1. 打开 `chrome://extensions`（Edge 为 `edge://extensions`）；
2. 右上角打开「开发者模式」；
3. 点击「加载已解压的扩展程序」，选中解压出来的 `Dulun-v1.5` 目录；
4. 打开抖音网页版，视频播放器右上角会出现下载按钮，点击即可解析下载；
5. 设置页：扩展详情 → 扩展选项，可切换视频 / 图文 / 实况开关与文件名逻辑。

## 目录结构

```
Dulun-v1.5/
├── manifest.json              # MV3 清单：权限、注入顺序、DNR 规则、WAR
├── background.js              # Service Worker：下载调度、文件名生成、请求头覆盖
├── fetcher.js                 # 页面主世界解析核心（fiber / 路由数据 / 接口兜底）
├── options.html               # 暗黑极简设置页
├── rules/dnr-rules.json       # Referer / UA 静态注入规则
├── content-scripts/
│   ├── ui-effects.js          # DulunUI：Toast + 鼠标跟随紫光
│   ├── content.js             # 隔离世界：按钮挂载、消息桥、分流下载
│   ├── jkp_extra.js           # 附加模块
│   └── content.css            # 注入按钮与 Toast 样式
├── icon/                      # 图标（new-icon.png 一张通吃全尺寸）
└── _locales/                  # 多语言文案
```

## 解析链路说明

1. **主链路**：页面 React fiber 与 `window._ROUTER_DATA` 提取 aweme 详情；
2. **二级兜底**：拿不到 `play_addr.uri`（或返回 `video_layout: null` 壳页）时，取数字 `video_id` 请求 `aweme.snssdk.com/aweme/v1/play/?video_id=xxx` 取 302 直链；
3. **三级兜底**：接口失效时用游客 Cookie 携带 `a_bogus` 签名请求 `www.douyin.com/web/api/v2/aweme/post/`；
4. **出参契约**：`{ vid, creator, description, tagList, bitRateList, videoList, imagesList, livePhotosList }`，其中 `bitRateList` 始终保留全量，供后台兜底与文件名逻辑使用。

## 常见问题

- **Edge 报 `Filenames starting with '_' are reserved`**：扩展根目录除 `_locales` 外不允许任何下划线开头的文件/目录。浏览器编译 DNR 规则时会生成 `_metadata/`，删掉它再重载即可（会自动重建，已列入 `.gitignore`）。
- **按钮不出现**：确认当前页面是视频详情页而非直播页；刷新页面后重试。
- **下载 403**：确认扩展已启用 DNR 权限，未被其他下载类扩展的规则覆盖。
- **图文/实况下载为空**：检查设置页对应开关是否勾选。

## 原作者版权声明

- 本项目为 **JKP-Video-Downloader**（原作者：**伐浩 / D站伐浩**，版本 2.3.1）的**非官方二次修改版**，与原项目作者无隶属或合作关系。
- 原项目的代码结构、解析思路与部分实现版权归原作者所有；本仓库仅对解析层、UI 与交互做了修改与增补。
- 原始作品的版权声明与使用条款优先于本仓库任何描述；如原作者不同意二次分发，请立即停止使用并删除本仓库相关内容。
- 本改版同样**仅供个人学习、技术研究与个人备份使用**，禁止任何形式的商业用途、付费分发、二次打包售卖。
- 使用本工具下载的内容版权归原内容创作者与平台所有，请勿用于转载、搬运或其他侵权用途。

## 免责声明

本工具不存储、不上传任何用户数据，不绕过平台登录与付费机制，仅对当前浏览器已加载的公开页面资源做本地解析。因使用本工具产生的任何版权纠纷或平台责任，由使用者自行承担。

## 更新日志

### v1.5（2026-11-13）

- 重构解析层：新增 video_id 直链二级兜底与 post 接口三级兜底；
- 新增图文 / 实况动图提取，`playwm` 全局替换为 `play`；
- 启用 `declarativeNetRequest` 注入 Referer 与 UA，修复 403 防盗链；
- 全新暗黑极简设置页，接入 `ui-effects.js`（Toast + 鼠标跟随紫光）；
- 按钮与设置项打通：三开关控制解析类型，下载流程按类型分流并回传进度提示；
- 更名「渡轮 - 抖音解析」，版本号 1.5，图标统一为 `icon/new-icon.png`。
