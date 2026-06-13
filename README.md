# dfb-bayern-fans

面向德国队和拜仁球迷的世界杯赛程、竞猜与抽奖活动网站。项目用于球迷群内快速查看相关赛程、筛选重点比赛，并在指定场次参与比分竞猜和赛后抽奖。

线上地址：[https://dfb-bayern-fans.netlify.app/](https://dfb-bayern-fans.netlify.app/)

## 项目内容

- `debay-fixture-center/`：React + Vite + TypeScript 前端应用，用于浏览、筛选、收藏赛程，以及参与竞猜抽奖。
- `德拜指南/`：面向球迷阅读和分发的 Word/PDF 版本赛程指南。

## 前端功能

- 按全部、德国队、拜仁相关、重点比赛、有竞猜抽奖、已收藏比赛筛选赛程。
- 支持按球队、场馆、城市、赛事阶段和拜仁球员搜索。
- 支持按拜仁球员过滤相关国家队比赛。
- 支持浏览器时区、德国时间、北京时间等时区显示。
- 支持选择比赛并导出日历文件。
- 仅在管理员开启的场次显示竞猜入口，避免误以为所有比赛都有活动。
- 指定场次支持群内昵称 + 比分竞猜，开赛后自动截止。
- 同一昵称同一场只接受首次提交，重复提交会被拒绝。
- 公开页面开赛前只显示参与人数，不公开群友昵称和预测比分。
- 赛后管理员可在后台执行抽奖，当前奖品包含埃尔博签名照和凯恩签名照。

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
