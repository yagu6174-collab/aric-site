# 陆恩惠 Aric

私人理财顾问的个人站。深色、静态，页面是随笔而不是宣传册。

线上目前仍是上一版。这一版用 `next build` 静态导出到 `out/`，不包含后台、数据库或登录接口。

## 本地

需要 Node.js 18+。

```bash
npm install
npm run dev
```

打开 http://localhost:3000

生产构建（不要加 `--turbopack`）：

```bash
npm run build
```

## 内容放在仓库里

- 首页句子：`src/i18n/dictionaries/zh-CN.ts` 与 `en.ts`。繁体在运行时由简体经 OpenCC 转出。
- 个人介绍：`content/about.json`
- 联系：`content/site.json`（微信、邮箱、城市）
- 文章：`content/insights/*.json`。链接用文章里的 `slug`，中文 slug 可以打开。

首页人物剪影在 `public/queue/`。

## 页面

`/`、`/insights`、`/insights/[slug]`、`/about`、`/contact`。语言在页眉切换，记在浏览器本地。
