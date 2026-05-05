# ⚡ LAOZIG | 赛博风个人综合站 V3

> 一个赛博朋克风格的个人综合站，使用 `Express` 提供共享内容 API，并以 `localStorage` 作为前端缓存层。

![HTML5](https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white)
![PWA](https://img.shields.io/badge/-PWA-4285F4?style=flat)

## ✨ 功能特性

### 核心模块
| 模块 | 说明 |
|------|------|
| 🏠 **主页** | Glitch 标题、打字机副标题、技能栈进度条、活动热力图、弹幕墙、最新动态 |
| 📝 **博客** | Markdown 支持、分类过滤、自动生成目录、阅读进度条、字数统计、分享按钮、草稿箱 |
| 🔧 **项目** | 标签分类、GitHub Stars 展示 |
| 🛠 **工具箱** | 分类管理常用工具 |
| 📚 **书架** | 在读/已读/想读状态、评分、读书笔记 |
| 🎬 **影视柜** | 电影/剧集/动画/纪录片分类、评分、短评 |
| 💬 **GitHub** | 自动拉取 GitHub 用户信息和仓库列表 |
| 💭 **碎碎念** | 带表情的动态时间线 |

### 交互特性
| 功能 | 说明 |
|------|------|
| 💻 **交互式终端** | 15+ 命令 + 命令历史（↑↓箭头）、`history`/`visitor`/`theme`/`uptime` 等新命令 + 11 个彩蛋 |
| 🔍 **全站搜索** | `Ctrl+K` 搜索所有内容 |
| ⌨️ **快捷键** | Vim 风格 `g+h`/`g+b` 导航 + 数字键 `1-8` + `?` 帮助 |
| 🎯 **弹幕墙** | 自动轮播 + 用户发送，持久化存储，6 色随机 |
| 📊 **活动热力图** | GitHub 贡献图风格，180 天数据 |
| 🌐 **多语言切换** | 中/英文一键切换，导航栏 + UI 文案翻译 |
| ⌨️ **打字机效果** | 副标题逐字显示 + 光标闪烁动画 |
| 👁 **访客统计** | 自动记录访问次数和首次访问时间 |

### 后台管理
| 功能 | 说明 |
|------|------|
| 📊 **数据统计面板** | Dashboard 卡片（含访客统计）+ 12 月趋势图 + 分类分布图 |
| 📋 **内容管理** | 博客/项目/工具/书架/影视/碎碎念/技能栈 **CRUD + 编辑功能**（需管理密钥） |
| 📝 **博客草稿箱** | 保存草稿、编辑、发布、删除 |
| 🎨 **6 种主题** | 赛博青/霓虹绿/暗紫/琥珀金/赤焰红/🌙 伪装模式 |
| ✍️ **Markdown 编辑器** | 左右分栏实时预览 |
| 🎨 **自定义 CSS** | 实时注入自定义样式 |
| 📦 **数据管理** | JSON 导出/导入/清空 |
| 📡 **RSS 订阅** | 动态生成 RSS + 后台一键下载 |

### 视觉效果
- 🚀 启动序列动画（ASCII Art + 进度条）
- 🌐 粒子连线背景（鼠标交互）
- 📺 CRT 扫描线效果
- ⚡ Glitch 标题动画
- ⌨️ 副标题打字机效果
- 🔄 页面过渡闪烁效果
- 📖 博客阅读进度条
- 🎵 赛博风音乐播放器
- 🌙 伪装模式（浅色背景，隐藏赛博风）

### SEO & PWA
- Open Graph / Twitter Card 标签
- SVG Favicon
- Meta description
- Service Worker 离线缓存
- `manifest.json` 支持安装到主屏幕
- 动态 `robots.txt` / `sitemap.xml`
- `healthz` 健康检查

## 🚀 使用方式

```bash
npm install
npm start
```

首次启动后，服务端会在 `.storage/admin.key` 生成管理密钥，并在 `.storage/admin.route` 生成独立后台路径。

公开页不再暴露固定后台入口。

请读取 `.storage/admin.route` 中的路径后访问，例如 `/_xxxxxxxxxxxxxxxxxxxxxxxx`。

将 `.storage/admin.key` 中的密钥填入后台页中的“管理认证”区域后，才可以读取草稿并修改共享数据。

### 生产环境变量

- `LAOZIG_ADMIN_KEY`
- `LAOZIG_ADMIN_ROUTE`
- `PORT`

### 生产部署文件

- `Caddyfile`
- `nginx.conf`

`nginx.conf` 是更偏正式上线的模板，使用前至少替换：

- `example.com`
- `/etc/letsencrypt/live/example.com/fullchain.pem`
- `/etc/letsencrypt/live/example.com/privkey.pem`

### 健康检查

- `GET /healthz`

### SEO 入口

- `GET /robots.txt`
- `GET /sitemap.xml`
- `GET /rss.xml`

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `?` | 显示/隐藏快捷键帮助 |
| `g+h` | 主页 |
| `g+b` | 博客 |
| `g+p` | 项目 |
| `g+t` | 工具箱 |
| `g+s` | 书架 |
| `g+c` | 影视 |
| `g+m` | 碎碎念 |
| `g+a` | 管理后台 |
| `g+k` / `Ctrl+K` | 全站搜索 |
| `1-8` | 数字键快速导航 |
| `ESC` | 关闭搜索弹窗 |

## 🎮 终端命令

在主页终端输入以下命令：

```
# 基础命令
help     → 显示帮助
whoami   → 关于我
ls       → 列出所有内容
stats    → 数据统计
blog     → 最新博客
skills   → 技能列表
date     → 当前时间
clear    → 清屏
matrix   → 矩阵特效
fortune  → 今日运势
history  → 命令历史
visitor  → 访客统计
theme    → 当前主题
uptime   → 运行时间

# 彩蛋命令
cat flag     → FLAG{you_f0und_th3_34st3r_3gg}
neofetch     → 系统信息
sudo         → permission denied 😏
hack         → Just kidding
coffee       → ☕ Brewing virtual coffee...
ls -la       → 隐藏文件列表
hello        → Hello, friend
exit         → There is no exit
pwd          → /home/laozig/cyberspace
rm -rf       → nice try, but no
ping         → PING localhost ✅
```

**终端快捷操作：**
- `↑` / `↓` 箭头翻阅命令历史

## 📁 项目结构

```
weblog/
├── index.html       # 页面结构
├── style.css        # 赛博风样式（含 6 种主题 + 全模块样式）
├── app.js           # 核心逻辑（~1100 行）
├── manifest.json    # PWA 清单
├── sw.js            # Service Worker（离线缓存）
├── vendor/          # 本地化前端依赖
├── Caddyfile        # Caddy 部署配置
├── nginx.conf       # Nginx 部署配置
└── README.md        # 项目文档
```

## 🎨 主题配色

| 主题 | 主色 | 适用场景 |
|------|------|----------|
| 赛博青 | `#00f0ff` | 默认，经典赛博风 |
| 霓虹绿 | `#00ff88` | 黑客帝国风格 |
| 暗紫 | `#a78bfa` | 优雅暗黑风 |
| 琥珀金 | `#fbbf24` | 暖色调科技感 |
| 赤焰红 | `#f87171` | 热血战斗风 |
| 🌙 伪装模式 | `#2563eb` | 浅色背景，白天隐藏 |

## 📦 技术栈

- **纯前端**：HTML + CSS + JavaScript，零依赖（仅 `marked.js` 用于 Markdown）
- **数据存储**：localStorage，支持 JSON 导出/导入
- **PWA**：Service Worker + manifest.json，支持离线使用
- **API**：GitHub API（公开接口，无需 Token）
- **兼容性**：现代浏览器（Chrome/Edge/Firefox/Safari）

## 📄 License

MIT © LAOZIG
