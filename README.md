# 陆恩惠 Aric · 个人工作室站点

Next.js App Router 个人站：工作室首页、理财见解、履历、摄影画廊、联系页，以及可登录的后台上传。

## 本地运行

需要 Node.js 18+：

```bash
npm install
npm run dev
```

打开 http://localhost:3000

后台：http://localhost:3000/admin  
本地密码见 `.env.local` 的 `ADMIN_PASSWORD`（开发默认是 `aric-dev`，上线必须改掉）。

## 接到 GitHub 之后怎么更新照片

GitHub 只保存网站程序。照片和文章在 **Vercel 上线后的后台** 上传，不会进仓库。

1. 打开线上地址：`https://你的域名/admin`（不要用 localhost）
2. 用 Vercel 里设置的 `ADMIN_PASSWORD` 登录
3. 「上传摄影作品」选图、填影集名和旁白
4. 保存后 `/photography` 会马上更新，不用再 `git push`

发理财文章同样走 `/admin`。

## 部署到 Vercel（按顺序做一次）

### 1. 把代码放到 GitHub

在 GitHub 新建仓库（建议公开或私有均可），把本项目 `main` 分支推上去。

### 2. 用 Vercel 导入这个仓库

1. 打开 [https://vercel.com](https://vercel.com) 并登录（可用 GitHub 账号）
2. **Add New → Project**，选中这个仓库
3. Framework 会识别为 Next.js，保持默认即可
4. 先点 Deploy（此时后台还不能真正存照片）

### 3. 打开 Blob 图床

1. Vercel 项目页 → **Storage** → 创建 **Blob**
2. 把它连接到当前项目
3. 会自动写入环境变量 `BLOB_READ_WRITE_TOKEN`

### 4. 设置后台密码

Vercel 项目 → **Settings → Environment Variables**，确认有：

| 名称 | 说明 |
|---|---|
| `ADMIN_PASSWORD` | 线上后台密码，不要用 `aric-dev` |
| `BLOB_READ_WRITE_TOKEN` | 创建 Blob 后一般会自动出现 |
| `OPENAI_API_KEY` | 可选。设置后，主页文案保存时用它把简体同步成英文；不设则走公共翻译接口 |

Production / Preview / Development 都勾上。改完变量后 **Redeploy** 一次。

### 5. 以后只做这件事

打开 `https://你的项目.vercel.app/admin` 上传即可。

## 上线前请替换的占位

- `content/site.json`：微信号、邮箱、城市
- `public/placeholders/wechat-qr.jpg`：微信二维码
- `content/about.json`：学历与履历
