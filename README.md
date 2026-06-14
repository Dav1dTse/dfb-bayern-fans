# 德拜球迷赛程中心

面向德国队和拜仁球迷的世界杯赛程、比赛详情、竞猜与抽奖活动网站。项目用于球迷群内快速查看德国队和拜仁球员相关比赛，筛选重点赛程，查看比赛事件与阵容，并在指定场次参与比分竞猜和赛后抽奖。

线上地址：[https://dfb-bayern-fans.netlify.app/](https://dfb-bayern-fans.netlify.app/)

GitHub 地址：[https://github.com/Dav1dTse/dfb-bayern-fans](https://github.com/Dav1dTse/dfb-bayern-fans)

此页面由 @DavidTse 创建，暂时用于北理工同仁会内部交流、使用。欢迎 star、反馈问题、提出建议，也欢迎一起完善德拜球迷赛程体验。交流邮箱：[davidtse.cn@gmail.com](mailto:davidtse.cn@gmail.com)

## 项目内容

- `debay-fixture-center/`：React + Vite + TypeScript 前端应用。
- `德拜指南/`：面向球迷阅读和分发的赛程指南材料。

## 主要功能

- 首页按移动端和桌面端分别优化布局，手机端优先展示当前状态、下一场比赛、最近赛果、近期赛程和快速入口。
- 全部赛程页支持按球队、状态、赛事、月份和关键词筛选，筛选条件会写入 URL query。
- 比赛详情页包含概览、事件、阵容、技术统计和信息 tabs，手机端使用紧凑比分区和横向滚动 tabs。
- 比赛事件时间线在桌面端保留左右分栏，手机端自动切换成单列事件流。
- 阵容页支持首发、替补、教练信息和阵型图展示。
- 球员名单展示中文名、国家队、位置、相关赛程数，以及右侧拜仁号码圆标。
- 球员详情页展示该球员相关比赛。
- 支持选择比赛并导出日历文件。
- “更多”页集中放置项目介绍、GitHub 地址和交流方式。
- 移动端底部导航提供首页、赛程、比赛、球员、更多五个入口，并带有图标和当前页面选中状态。
- 竞猜与抽奖只在管理员开启的场次显示，避免误以为所有比赛都有活动。
- 指定场次支持群内昵称 + 比分竞猜，开赛后自动截止。
- 同一昵称同一场只接受首次提交，重复提交会被拒绝。
- 公开页面开赛前只显示参与人数，不公开群友昵称和预测比分。
- 赛后管理员可在后台执行抽奖并保存结果。

## 管理后台

管理入口不在普通用户首页展示，管理员密码通过 Netlify 环境变量 `ADMIN_PASSWORD` 配置。

后台支持：

- 编辑哪些比赛开放竞猜。
- 编辑每场竞猜对应的奖品名称、说明、图片、sponsor、中奖人数和资格规则。
- 查看竞猜记录和符合资格候选人。
- 在比赛结束后执行抽奖并保存结果。

当前线上 MVP 使用 Netlify Functions + Netlify Blobs 存储竞猜记录、抽奖结果和竞猜配置。

## 本地运行

进入前端项目目录：

```bash
cd debay-fixture-center
```

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

构建生产版本：

```bash
npm run build
```

预览生产构建：

```bash
npm run preview
```

## 技术栈

- React 18
- TypeScript
- Vite
- Netlify Functions
- Netlify Blobs
- CSS

## 部署

项目已连接 Netlify，会从 GitHub `main` 分支自动部署。

必要环境变量：

```bash
ADMIN_PASSWORD=your-strong-admin-password
```

## 版本管理

仓库根目录使用 Git 管理。`node_modules/`、`dist/`、`.netlify/`、`.DS_Store` 和 TypeScript 构建缓存已通过 `.gitignore` 排除。
