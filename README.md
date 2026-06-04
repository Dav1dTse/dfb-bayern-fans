# dfb-bayern-fans

面向拜仁球迷的世界杯赛程筛选与观赛指南项目。仓库包含一个 React 前端应用，以及导出的德拜球迷赛程指南文档。

## 项目内容

- `debay-fixture-center/`：React + Vite + TypeScript 前端应用，用于浏览、筛选和收藏相关赛程。
- `德拜指南/`：面向球迷阅读和分发的 Word/PDF 版本赛程指南。

## 前端功能

- 按全部、德国队、拜仁相关、重点比赛、已收藏比赛筛选赛程。
- 支持按球队、场馆、城市、赛事阶段和拜仁球员搜索。
- 支持按拜仁球员过滤相关国家队比赛。
- 支持浏览器时区、德国时间、北京时间等时区显示。
- 支持选择比赛并导出日历文件。

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
- CSS

## 版本管理

仓库根目录使用 Git 管理。`node_modules/`、`dist/`、`.netlify/`、`.DS_Store` 和 TypeScript 构建缓存已通过 `.gitignore` 排除。
