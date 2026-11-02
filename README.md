# 陆恩惠 Aric

私人理财顾问的个人站。米白纸面，页面是随笔而不是宣传册。

公开页按请求读取一份内容草稿。有 `BLOB_READ_WRITE_TOKEN` 时存在 Vercel Blob，没有时写在本机 `.data/`。仓库里的 `content/*.json` 和 `src/i18n/dictionaries/zh-CN.ts` 是还没保存过草稿时的种子。

后台在 `/admin`。打开后左边是公开页的预览，点一块，右边只改那一块，改完点保存。简体是源文。繁体由简体经 OpenCC 转出。英文界面仍在 `src/i18n/dictionaries/en.ts`。字段对照见 `ADMIN_MAP.md`。

## 本地

需要 Node.js 18+。

```bash
npm install
```

在 `.env.local` 里写上 `EDITOR_PASSWORD` 和 `SESSION_SECRET`，然后：

```bash
npm run dev
```

打开 http://localhost:3000 ，后台是 http://localhost:3000/admin 。

生产构建：

```bash
npm run build
```

## 页面

`/`、`/insights`、`/insights/[slug]`、`/about`、`/contact`。语言在页眉切换，记在浏览器本地。

首页人物剪影在 `public/queue/`。
