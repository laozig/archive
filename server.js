const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3002;
const STORAGE_DIR = path.join(__dirname, '.storage');
const LEGACY_DATA_FILE = path.join(__dirname, 'data.json');
const DATA_FILE = path.join(STORAGE_DIR, 'data.json');
const ADMIN_KEY_FILE = path.join(STORAGE_DIR, 'admin.key');
const ADMIN_ROUTE_FILE = path.join(STORAGE_DIR, 'admin.route');
const PUBLIC_ASSETS = {
    '/app.js': 'app.js',
    '/style.css': 'style.css',
    '/manifest.json': 'manifest.json',
    '/sw.js': 'sw.js'
};
const CONTENT_SECURITY_POLICY = [
    "default-src 'self'",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.github.com",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
].join('; ');

const DEFAULT_DATA = {
    about: '一个热爱逆向工程与安全研究的开发者。专注于 Web 安全、移动安全、恶意代码分析。',
    subtitle: 'Security Researcher · Reverse Engineer · CTF Player',
    tags: ['#逆向工程', '#Web 安全', '#CTF', '#AI'],
    blogs: [],
    drafts: [],
    projects: [],
    tools: [],
    books: [],
    movies: [],
    moods: [],
    skills: [
        { name: 'Python', level: 90, color: 'cyan' },
        { name: 'JavaScript', level: 85, color: 'cyan' },
        { name: '逆向工程', level: 88, color: 'pink' },
        { name: 'Web 安全', level: 82, color: 'purple' },
        { name: 'Frida', level: 80, color: 'green' },
        { name: 'C/C++', level: 70, color: 'orange' }
    ],
    theme: 'default',
    ghUsername: '',
    lang: 'zh'
};

function ensureStorageDir() {
    if (!fs.existsSync(STORAGE_DIR)) {
        fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }
}

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function genId() {
    return Date.now().toString(36) + crypto.randomBytes(3).toString('hex');
}

function toText(value, maxLength) {
    if (typeof value !== 'string') return '';
    return value.trim().slice(0, maxLength);
}

function toList(value) {
    return Array.isArray(value) ? value : [];
}

function toInt(value, min, max, fallback) {
    const num = parseInt(value, 10);
    if (Number.isNaN(num)) return fallback;
    return Math.max(min, Math.min(max, num));
}

function toTimestamp(value) {
    const num = Number(value);
    return Number.isFinite(num) && num > 0 ? num : Date.now();
}

function toId(value) {
    const raw = toText(value, 64).replace(/[^a-zA-Z0-9_-]/g, '');
    return raw || genId();
}

function toTheme(value) {
    const allowed = ['default', 'neon-green', 'violet', 'amber', 'red', 'disguise'];
    return allowed.includes(value) ? value : DEFAULT_DATA.theme;
}

function toLang(value) {
    return value === 'en' ? 'en' : 'zh';
}

function toSkillColor(value) {
    const allowed = ['cyan', 'pink', 'purple', 'green', 'orange'];
    return allowed.includes(value) ? value : 'cyan';
}

function normalizeTags(value) {
    return toList(value)
        .map(item => toText(item, 32))
        .filter(Boolean)
        .slice(0, 20);
}

function normalizeBlog(item) {
    return {
        id: toId(item && item.id),
        title: toText(item && item.title, 160),
        content: typeof (item && item.content) === 'string' ? item.content.slice(0, 200000) : '',
        category: toText(item && item.category, 40),
        tags: normalizeTags(item && item.tags),
        created: toTimestamp(item && item.created)
    };
}

function normalizeProject(item) {
    return {
        id: toId(item && item.id),
        name: toText(item && item.name, 120),
        desc: toText(item && item.desc, 600),
        url: toText(item && item.url, 500),
        tags: normalizeTags(item && item.tags),
        stars: toInt(item && item.stars, 0, 1000000, 0),
        created: toTimestamp(item && item.created)
    };
}

function normalizeTool(item) {
    return {
        id: toId(item && item.id),
        name: toText(item && item.name, 120),
        desc: toText(item && item.desc, 600),
        url: toText(item && item.url, 500),
        category: toText(item && item.category, 40),
        created: toTimestamp(item && item.created)
    };
}

function normalizeBook(item) {
    const allowedStatus = ['reading', 'finished', 'wishlist'];
    return {
        id: toId(item && item.id),
        title: toText(item && item.title, 160),
        author: toText(item && item.author, 120),
        status: allowedStatus.includes(item && item.status) ? item.status : 'reading',
        rating: toInt(item && item.rating, 0, 5, 0),
        note: toText(item && item.note, 1200),
        created: toTimestamp(item && item.created)
    };
}

function normalizeMovie(item) {
    const allowedType = ['movie', 'tv', 'anime', 'docu'];
    const allowedStatus = ['watched', 'watching', 'wishlist'];
    return {
        id: toId(item && item.id),
        title: toText(item && item.title, 160),
        director: toText(item && item.director, 120),
        cast: toText(item && item.cast, 200),
        url: toText(item && item.url, 500),
        type: allowedType.includes(item && item.type) ? item.type : 'movie',
        status: allowedStatus.includes(item && item.status) ? item.status : 'watched',
        rating: toInt(item && item.rating, 0, 10, 0),
        note: toText(item && item.note, 1200),
        created: toTimestamp(item && item.created)
    };
}

function normalizeMood(item) {
    return {
        id: toId(item && item.id),
        text: toText(item && item.text, 500),
        emoji: toText(item && item.emoji, 8) || '💭',
        created: toTimestamp(item && item.created)
    };
}

function normalizeSkill(item) {
    return {
        name: toText(item && item.name, 60),
        level: toInt(item && item.level, 0, 100, 0),
        color: toSkillColor(item && item.color)
    };
}

function normalizeData(input) {
    const base = clone(DEFAULT_DATA);
    const source = input && typeof input === 'object' ? input : {};

    base.about = toText(source.about, 1000) || DEFAULT_DATA.about;
    base.subtitle = toText(source.subtitle, 160) || DEFAULT_DATA.subtitle;
    base.tags = normalizeTags(source.tags);
    base.blogs = toList(source.blogs).map(normalizeBlog).filter(item => item.title && item.content);
    base.drafts = toList(source.drafts).map(normalizeBlog).filter(item => item.title || item.content);
    base.projects = toList(source.projects).map(normalizeProject).filter(item => item.name);
    base.tools = toList(source.tools).map(normalizeTool).filter(item => item.name);
    base.books = toList(source.books).map(normalizeBook).filter(item => item.title);
    base.movies = toList(source.movies).map(normalizeMovie).filter(item => item.title);
    base.moods = toList(source.moods).map(normalizeMood).filter(item => item.text);
    base.skills = toList(source.skills).map(normalizeSkill).filter(item => item.name);
    base.theme = toTheme(source.theme);
    base.ghUsername = toText(source.ghUsername, 60);
    base.lang = toLang(source.lang);

    return base;
}

function ensureAdminKey() {
    ensureStorageDir();
    if (!fs.existsSync(ADMIN_KEY_FILE)) {
        fs.writeFileSync(ADMIN_KEY_FILE, crypto.randomBytes(24).toString('hex'));
    }
    return fs.readFileSync(ADMIN_KEY_FILE, 'utf8').trim();
}

function normalizeAdminRoute(value) {
    if (typeof value !== 'string') return '/admin';
    const raw = value.trim();
    if (!raw) return '/admin';
    const prefixed = raw.startsWith('/') ? raw : `/${raw}`;
    const sanitized = prefixed.replace(/[^a-zA-Z0-9/_-]/g, '').replace(/\/{2,}/g, '/');
    if (!sanitized || sanitized === '/') return '/admin';
    return sanitized.endsWith('/') ? sanitized.slice(0, -1) : sanitized;
}

function ensureAdminRoute() {
    ensureStorageDir();
    if (!fs.existsSync(ADMIN_ROUTE_FILE)) {
        fs.writeFileSync(ADMIN_ROUTE_FILE, `/_${crypto.randomBytes(12).toString('hex')}`);
    }
    const route = normalizeAdminRoute(fs.readFileSync(ADMIN_ROUTE_FILE, 'utf8'));
    fs.writeFileSync(ADMIN_ROUTE_FILE, route);
    return route;
}

const ADMIN_KEY = process.env.LAOZIG_ADMIN_KEY || ensureAdminKey();
const ADMIN_ROUTE = process.env.LAOZIG_ADMIN_ROUTE
    ? normalizeAdminRoute(process.env.LAOZIG_ADMIN_ROUTE)
    : ensureAdminRoute();

function initData() {
    ensureStorageDir();
    if (!fs.existsSync(DATA_FILE)) {
        if (fs.existsSync(LEGACY_DATA_FILE)) {
            const legacyRaw = fs.readFileSync(LEGACY_DATA_FILE, 'utf8');
            const normalized = normalizeData(JSON.parse(legacyRaw));
            fs.writeFileSync(DATA_FILE, JSON.stringify(normalized, null, 2));
            console.log('[DATA] 已迁移旧 data.json 到 .storage/data.json');
        } else {
            fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2));
            console.log('[DATA] 初始化 .storage/data.json');
        }
    }
}

function readData() {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return normalizeData(JSON.parse(raw));
}

function writeData(data) {
    const normalized = normalizeData(data);
    fs.writeFileSync(DATA_FILE, JSON.stringify(normalized, null, 2));
    return normalized;
}

function readIndexHtml() {
    return fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
}

function stripAdminSection(html) {
    const start = html.indexOf('<section class="page" id="page-admin"');
    if (start === -1) return html;
    const end = html.indexOf('\n    </section>', start);
    if (end === -1) return html;
    return html.slice(0, start) + html.slice(end + '\n    </section>'.length);
}

function sendAppShell(req, res, isAdminEntry) {
    let html = readIndexHtml();
    const siteOrigin = getSiteOrigin(req);
    html = html.replace('https://laozig.com', siteOrigin);
    if (isAdminEntry) {
        html = html.replace('<body>', '<body data-entry="admin">');
        html = html.replace('class="page active" id="page-home"', 'class="page" id="page-home"');
        html = html.replace('class="page" id="page-admin"', 'class="page active" id="page-admin"');
    } else {
        html = html.replace(/<section class="page(?: active)?" id="page-admin"[\s\S]*?<\/section>/, '');
    }
    res.type('html').send(html);
}

function getPublicData(data) {
    const safe = clone(data);
    safe.drafts = [];
    return safe;
}

function sendPublicAsset(res, assetPath) {
    res.sendFile(path.join(__dirname, assetPath));
}

function getSiteOrigin(req) {
    const forwardedProto = (req.get('x-forwarded-proto') || '').split(',')[0].trim();
    const protocol = forwardedProto || req.protocol || 'http';
    const host = req.get('x-forwarded-host') || req.get('host') || `127.0.0.1:${PORT}`;
    return `${protocol}://${host}`;
}

function getBlogCanonicalPath(id) {
    return `/blog/${encodeURIComponent(String(id || ''))}`;
}

function escapeXml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function requireAdmin(req, res, next) {
    const requestKey = req.get('x-admin-key');
    if (!requestKey || requestKey !== ADMIN_KEY) {
        return res.status(401).json({ error: '未授权' });
    }
    next();
}

initData();

app.disable('x-powered-by');
app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
    res.set({
        'Content-Security-Policy': CONTENT_SECURITY_POLICY,
        'Referrer-Policy': 'no-referrer',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
    });
    next();
});

app.get('/', (req, res) => {
    sendAppShell(req, res, false);
});

app.get('/index.html', (req, res) => {
    res.redirect(302, '/');
});

app.get(ADMIN_ROUTE, (req, res) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        'Pragma': 'no-cache',
        'X-Robots-Tag': 'noindex, nofollow, noarchive'
    });
    sendAppShell(req, res, true);
});

if (ADMIN_ROUTE !== '/admin') {
    app.get('/admin', (req, res) => {
        res.status(404).send('Not Found');
    });
}

app.get(['/data.json', '/package.json', '/package-lock.json', '/server.js', '/admin.html', '/README.md'], (req, res) => {
    res.status(404).send('Not Found');
});

app.get('/api/data', (req, res) => {
    try {
        res.json(getPublicData(readData()));
    } catch (e) {
        res.status(500).json({ error: '读取数据失败' });
    }
});

app.get('/api/admin/data', requireAdmin, (req, res) => {
    try {
        res.set('Cache-Control', 'no-store, private');
        res.json(readData());
    } catch (e) {
        res.status(500).json({ error: '读取管理数据失败' });
    }
});

app.post('/api/admin/data', requireAdmin, (req, res) => {
    try {
        res.set('Cache-Control', 'no-store, private');
        const saved = writeData(req.body);
        res.json({ success: true, data: saved });
    } catch (e) {
        res.status(500).json({ error: '保存数据失败' });
    }
});

app.get('/api/blogs/:id', (req, res) => {
    try {
        const data = readData();
        const blog = data.blogs.find(b => b.id === req.params.id);
        if (blog) res.json(blog);
        else res.status(404).json({ error: '博客不存在' });
    } catch (e) {
        res.status(500).json({ error: '读取失败' });
    }
});

app.get('/api/stats', (req, res) => {
    try {
        const data = readData();
        res.json({
            blogs: data.blogs.length,
            projects: data.projects.length,
            tools: data.tools.length,
            books: data.books.length,
            movies: (data.movies || []).length,
            moods: data.moods.length,
            skills: (data.skills || []).length
        });
    } catch (e) {
        res.status(500).json({ error: '统计失败' });
    }
});

app.get('/healthz', (req, res) => {
    try {
        const data = readData();
        const storageStat = fs.statSync(DATA_FILE);
        res.json({
            ok: true,
            timestamp: new Date().toISOString(),
            dataFile: DATA_FILE,
            counts: {
                blogs: data.blogs.length,
                projects: data.projects.length,
                tools: data.tools.length,
                books: data.books.length,
                movies: (data.movies || []).length,
                moods: data.moods.length
            },
            storage: {
                bytes: storageStat.size,
                updatedAt: storageStat.mtime.toISOString()
            }
        });
    } catch (e) {
        res.status(500).json({ ok: false, error: 'healthcheck_failed' });
    }
});

app.get('/robots.txt', (req, res) => {
    const siteOrigin = getSiteOrigin(req);
    const content = [
        'User-agent: *',
        'Allow: /',
        'Disallow: /api/',
        '',
        `Sitemap: ${siteOrigin}/sitemap.xml`
    ].join('\n');
    res.type('text/plain').send(content);
});

app.get('/blog/:id', (req, res) => {
    try {
        const data = readData();
        const exists = data.blogs.some(blog => blog.id === req.params.id);
        if (!exists) {
            res.status(404).send('Not Found');
            return;
        }
        sendAppShell(req, res, false);
    } catch (e) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/rss.xml', (req, res) => {
    try {
        const data = readData();
        const items = data.blogs.slice().reverse().slice(0, 20);
        const now = new Date().toUTCString();
        const siteOrigin = getSiteOrigin(req);
        let rss = '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>LAOZIG | 个人综合站</title>\n    <link>' + escapeXml(siteOrigin) + '</link>\n    <description>Security Researcher · Reverse Engineer · CTF Player</description>\n    <language>zh-CN</language>\n    <lastBuildDate>' + now + '</lastBuildDate>\n    <atom:link href="' + escapeXml(siteOrigin + '/rss.xml') + '" rel="self" type="application/rss+xml"/>';
        items.forEach(item => {
            const date = new Date(item.created).toUTCString();
            const desc = item.content.replace(/<[^>]*>/g, '').replace(/[#*`\[\]()!>_~\-|]/g, '').replace(/\s+/g, ' ').trim().slice(0, 200);
            const permalink = siteOrigin + getBlogCanonicalPath(item.id);
            rss += '\n    <item>\n      <title>' + escapeXml(item.title) + '</title>\n      <link>' + escapeXml(permalink) + '</link>\n      <description>' + escapeXml(desc) + '</description>\n      <pubDate>' + date + '</pubDate>\n      <guid>' + escapeXml(permalink) + '</guid>\n    </item>';
        });
        rss += '\n  </channel>\n</rss>';
        res.type('application/xml').send(rss);
    } catch (e) {
        res.status(500).send('RSS 生成失败');
    }
});

app.get('/sitemap.xml', (req, res) => {
    try {
        const data = readData();
        const siteOrigin = getSiteOrigin(req);
        const pages = [
            '/',
            '/rss.xml'
        ];
        const staticUrls = pages.map(page => ({
            loc: siteOrigin + page,
            lastmod: new Date().toISOString()
        }));
        const blogUrls = data.blogs.map(blog => ({
            loc: siteOrigin + getBlogCanonicalPath(blog.id),
            lastmod: new Date(blog.created).toISOString()
        }));
        const urls = staticUrls.concat(blogUrls);
        const body = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            ...urls.map(entry => `  <url><loc>${escapeXml(entry.loc)}</loc><lastmod>${escapeXml(entry.lastmod)}</lastmod></url>`),
            '</urlset>'
        ].join('\n');
        res.type('application/xml').send(body);
    } catch (e) {
        res.status(500).send('Sitemap 生成失败');
    }
});

Object.entries(PUBLIC_ASSETS).forEach(([routePath, assetPath]) => {
    app.get(routePath, (req, res) => {
        if (routePath === '/sw.js' || routePath === '/app.js' || routePath === '/style.css') {
            res.set('Cache-Control', 'no-cache');
        }
        sendPublicAsset(res, assetPath);
    });
});

app.use('/vendor', express.static(path.join(__dirname, 'vendor'), {
    fallthrough: false,
    immutable: true,
    maxAge: '30d'
}));

app.listen(PORT, () => {
    console.log(`[LAOZIG] 服务器启动 http://localhost:${PORT}`);
    console.log(`[LAOZIG] 数据存储: ${DATA_FILE}`);
    console.log(`[LAOZIG] 管理密钥文件: ${ADMIN_KEY_FILE}`);
    console.log(`[LAOZIG] 管理路由文件: ${ADMIN_ROUTE_FILE}`);
    if (!process.env.LAOZIG_ADMIN_KEY) {
        console.log('[LAOZIG] 未检测到环境变量 LAOZIG_ADMIN_KEY，已使用本地随机管理密钥文件。');
    }
    if (process.env.LAOZIG_ADMIN_ROUTE) {
        console.log(`[LAOZIG] 使用环境变量管理入口: ${ADMIN_ROUTE}`);
    }
});
