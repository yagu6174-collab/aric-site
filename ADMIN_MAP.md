# 对照预览后台映射（陆恩惠 Aric）

数据根：`SiteDraft`（持久化 key `site`，`PUT /api/site`）。  
预览：`SitePreview` 复用公开页组件，`editMode` 由 `EditModeProvider` 打开。  
表单：`components/admin/EditorForm.tsx`。  
选中：字符串 ID。列表项用 `insight:{id}` / `edu:{id}` / `job:{id}` / `skill:{id}` / `social:{id}`。

## 语言策略

后台只编辑简体源文。公开页 `zh-CN` 用这份草稿。`zh-TW` 由 OpenCC 在运行时从简体转出，不单独入库，也不在后台逐句改。`en` 的界面铬（导航、按钮、分类名、免责声明、首屏英文等）仍读 `src/i18n/dictionaries/en.ts`。文章、关于经历、联系方式这些事实字段，英文页继续显示简体源文，和改版前 `forLocale` 的行为一致。

人物剪影队列、弧线和章节号 `01` 是装饰，不进草稿。语言切换器只切换显示，不写入草稿；后台预览固定简体。

## A. 后台壳层（不是首页文案）

| 区块 | 前端位置 | 选中 ID | 数据字段路径 | 编辑交互 |
|------|----------|---------|--------------|----------|
| 顶栏 | `/admin` header | — | — | 「回到主页」；窄屏「预览 \| 表单」；**保存**；退出。改动留在本地，只有保存才写存储 |
| 访问量 | 顶栏下方 `VisitPanel` | —（只读） | 访问统计存储 `visits`（非 SiteDraft） | 今日 / 近 7 日 / 累计 + 近 7 天。公开首页每打开一次计一次。**仅后台可见，非点选文案** |
| 预览页签 | 预览区上方 | — | — | 首页 / 见解 / 关于 / 联系 / 阅读。只切换预览，不改公开导航 |
| 未选中目录 | 右侧默认态，或表单顶「目录」 | `null` | — | 跳到各块；加文章、教育、履历、技能、链接 |
| 登录 | 未登录的 `/admin` | — | — | 密码门。`EDITOR_PASSWORD`（或 `ADMIN_PASSWORD`）+ `SESSION_SECRET`。非内容映射 |

## B. 页头与首屏

| 区块 | 前端位置 | 选中 ID | 数据字段路径 | 编辑交互 |
|------|----------|---------|--------------|----------|
| 名字 | 页头品牌、页脚名字、关于署名、联系页眉眼 | `brand` | `brand.name`, `brand.nameEn` | 两个文本 |
| 导航 | 页头桌面导航、手机菜单、页脚导航、首页列表下那一行 | `nav` | `nav.home`, `nav.insights`, `nav.about`, `nav.contact`, `nav.skip` | 五个文本。编辑态点击不跳转 |
| 页头联系按钮 | 页头右侧按钮 | `studio-contact` | `studio.contactTitle`（与首页联系卡片标题同一字段） | 见联系卡片 |
| 首屏标题 | Hero 两行大标题 | `hero` | `hero.line1`, `hero.line2` | 文本。可跳到导语 / 正文 |
| 导语 | Hero 标题下那句；页脚名字下那句 | `hero-lead` | `hero.subtitle` | textarea |
| 先稳一手 | 小标题、首屏链到这一段的字、下面各段 | `philosophy` | `philosophy.title`, `philosophy.paragraphs[]` | 文本 + 段落列表。上移 / 下移 / 删除 / 加一段（确认） |
| 剪影队列 | Hero 底部人物 | — | — | 装饰，不可编辑。编辑态不接收点击 |
| 弧线、`01` | Hero 弧、理念区序号 | — | — | 装饰 |

首屏三块用小按钮互跳：`hero` / `hero-lead` / `philosophy`。

## C. 首页下列

| 区块 | 前端位置 | 选中 ID | 数据字段路径 | 编辑交互 |
|------|----------|---------|--------------|----------|
| 最近写下的 | 栏目标题 | `latest` | `latest.title` | 文本。可跳到文章顺序 |
| 一篇文章（首页前三、见解列表、阅读页） | 卡片或阅读页正文 | `insight:{id}` | `insights[]`：`title, excerpt, quote, date, category, slug, body[], order` | 表单改这一篇。正文块可加段落 / 引文 / 表格，上移下移删除（确认）。上移下移整篇。删除确认。字数由正文算出，不单设字段 |
| 文章顺序 | 目录或「文章顺序」 | `insights-order` | `insights[].order` | 拖动手柄或上移 / 下移。顺序即首页前三与 `/insights` 的顺序；日期仍印在卡片上 |
| 加一篇 | 列表下虚线，或目录 | 确认后选中新 `insight:{id}` | 新 `insights` 项 | 确认后插入到最前 |
| 我是谁 | 首页右侧门 | `studio-about` | `studio.aboutTitle`, `studio.aboutDesc` | 文本 |
| 联系卡片 | 首页右侧门 | `studio-contact` | `studio.contactTitle`, `studio.contactDesc` | 文本。`contactTitle` 同时是页头按钮 |

## D. 见解页与阅读页

| 区块 | 前端位置 | 选中 ID | 数据字段路径 | 编辑交互 |
|------|----------|---------|--------------|----------|
| 见解页文案 | 标题、列表页说明、空列表、返回、文末声明、字数单位 | `insights-copy` | `insightsPage.title`, `disclaimer`, `all`, `empty`, `charCount`, `back` | 文本 / textarea。文章页的返回和文末声明用同一份 |
| 分类名 | 筛选条 | `categories` | `insightsPage.categories.allocation/market/risk/family/essay` | 五个文本。分类枚举不增删，只改显示名 |
| 阅读页正文 | 标题、日期、分类、摘要、正文 | `insight:{id}` | 同文章 | 与列表点进同一张表。表单里可「在阅读页看这篇」 |

## E. 关于

| 区块 | 前端位置 | 选中 ID | 数据字段路径 | 编辑交互 |
|------|----------|---------|--------------|----------|
| 关于文案 | 页标题、理念标题、介绍段落、栏名、肖像替代文字 | `about-copy` | `aboutPage.title`, `storyTitle`, `story[]`, `education`, `career`, `skills`, `portraitAlt` | 文本。介绍段落可增删排序（确认） |
| 肖像 | 关于页照片 | `portrait` | `images.portraitUrl` | URL + 上传 + 缩略图 + 去掉图片。空则用 `/placeholders/portrait.png` |
| 一条教育 | 教育列表中的一条 | `edu:{id}` | `about.education[]`：`period, title, detail` | 文本。上移下移。删除确认。栏名在关于文案 |
| 一条履历 | 履历列表中的一条 | `job:{id}` | `about.career[]`：`period, title, detail` | 同上 |
| 一项技能 | 技能芯片 | `skill:{id}` | `about.skills[]`：`text` | 文本。上移下移。删除确认 |
| 加一条 | 栏下虚线，或目录 | 确认后选中新项 | 对应数组 | 确认 |

## F. 联系

| 区块 | 前端位置 | 选中 ID | 数据字段路径 | 编辑交互 |
|------|----------|---------|--------------|----------|
| 联系页文案 | 标题、说明、各栏名、复制按钮、二维码替代文字 | `contact-copy` | `contactPage.*` | 文本。编辑态点「复制」只选中这块，不写剪贴板 |
| 微信、邮箱、城市 | 联系页这三项，以及页脚这三项 | `profile` | `profile.wechat`, `profile.email`, `profile.city` | 文本。下列出其他链接 |
| 二维码 | 联系页二维码 | `qr` | `images.qrUrl` | URL + 上传 + 缩略图 + 去掉。空则用占位图 |
| 一个外链 | 联系页其他链接 | `social:{id}` | `profile.socials[]`：`label, href` | 文本。上移下移。删除确认。地址需 `https://` 或 `mailto:`，保存时认不出的会被拿掉。可打开链接看看 |

## G. 页脚、颜色、找不到页

| 区块 | 前端位置 | 选中 ID | 数据字段路径 | 编辑交互 |
|------|----------|---------|--------------|----------|
| 免责声明 | 页脚底栏 | `footer` | `footer.label`, `footer.rights` | 文本 / textarea。名字、导航、联系事实分别在 brand / nav / profile |
| 全站颜色 | 纸色、墨色、棕 | `colors` | `colors.bg`, `bgRaised`, `fg`, `muted`, `faint`, `gold`, `goldBright` | 取色器 + 十六进制。非法值保存时退回默认。分割线跟着墨色，不单设一格 |
| 找不到页 | 404 标题 | `not-found` | `notFound.title` | 文本。预览没有独立热区，从目录进入 |

## H. 刻意不在「点预览改文案」里的部分

| 项 | 说明 |
|----|------|
| 登录口令 | 未登录只显示登录表单 |
| 访问量 | `VisitPanel` + `POST /api/visits`。只读统计 |
| 简 / 繁 / EN 切换 | 产品行为。繁体是 OpenCC，英文界面在 `en.ts` |
| 菜单按钮的 Menu / Close | 给读屏用的系统字，不进草稿 |
| 剪影、弧线、`01` | 装饰 |
| 未渲染的词典键 | `home.ctaInsights`、`home.read`、`studio.insights` 等当前页面没有用到，不进草稿 |
| 校验失败的提示 | 上传太大、密码不对，是系统字 |

## 自检

- [x] 预览点击与右侧表单字段一致
- [x] 保存后公开页读同一份草稿，不必改代码
- [x] 编辑态预览里的链接不会跳走
- [x] 删除和新增有确认对话框
- [x] 映射表留在仓库
