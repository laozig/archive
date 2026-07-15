/* ============================================
   LAOZIG 赛博风个人综合站 - 核心逻辑 V3 (Enhanced)
   ============================================ */

// ===== 数据层 =====
const DB_KEY = 'laozig_data';

const defaultData = {
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
const MOVIE_VIEW_STORAGE_KEY = 'laozig_movie_view';

// ===== 多语言翻译 =====
const i18n = {
    zh: {
        home: '主页', blog: '博客', projects: '项目', tools: '工具箱',
        github: 'GitHub', bookshelf: '书架', cinema: '影视', mood: '碎碎念',
        subtitle: 'Security Researcher · Reverse Engineer · CTF Player',
        online: '系统在线', blogs: '博客', projects_label: '项目', tools_label: '工具',
        books: '书籍', movies_label: '影视',
        search_placeholder: '搜索博客、项目、工具...', search_empty: '输入关键词开始搜索',
        search_none: '未找到匹配结果',
        danmaku_placeholder: '发一条弹幕...',
        danmaku_sent: '弹幕已发射 🚀',
        saved: '已保存', deleted: '已删除',
        blog_published: '博客已发布', draft_saved: '草稿已保存',
        project_added: '项目已添加', tool_added: '工具已添加',
        movie_added: '影视已添加', book_added: '书籍已添加', mood_published: '已发布',
        skill_added: '技能已添加', theme_changed: '主题已切换',
        export_ok: '数据已导出', import_ok: '数据导入成功',
        clear_confirm: '确定要清空所有数据吗？此操作不可恢复！',
        clear_ok: '数据已清空', rss_ok: 'RSS 已生成并下载',
        css_applied: '自定义 CSS 已应用', css_cleared: '自定义 CSS 已清除',
        empty_warning: '标题和内容不能为空', name_warning: '不能为空',
        cmd_not_found: 'command not found',
        draft_deleted: '草稿已删除', draft_published: '草稿已发布', draft_loaded: '草稿已加载到编辑器',
        blog_updated: '博客已更新', project_updated: '项目已更新', tool_updated: '工具已更新',
        movie_updated: '影视已更新', book_updated: '书籍已更新', mood_updated: '碎碎念已更新',
        skill_updated: '技能已更新'
    },
    en: {
        home: 'Home', blog: 'Blog', projects: 'Projects', tools: 'Tools',
        github: 'GitHub', bookshelf: 'Books', cinema: 'Movies', mood: 'Thoughts',
        subtitle: 'Security Researcher · Reverse Engineer · CTF Player',
        online: 'System Online', blogs: 'Blogs', projects_label: 'Projects', tools_label: 'Tools',
        books: 'Books', movies_label: 'Movies',
        search_placeholder: 'Search blogs, projects, tools...', search_empty: 'Type to search...',
        search_none: 'No results found',
        danmaku_placeholder: 'Send a danmaku...',
        danmaku_sent: 'Danmaku fired 🚀',
        saved: 'Saved', deleted: 'Deleted',
        blog_published: 'Blog published', draft_saved: 'Draft saved',
        project_added: 'Project added', tool_added: 'Tool added',
        movie_added: 'Movie added', book_added: 'Book added', mood_published: 'Published',
        skill_added: 'Skill added', theme_changed: 'Theme changed',
        export_ok: 'Data exported', import_ok: 'Data imported',
        clear_confirm: 'Clear all data? This cannot be undone!',
        clear_ok: 'Data cleared', rss_ok: 'RSS generated & downloaded',
        css_applied: 'Custom CSS applied', css_cleared: 'Custom CSS cleared',
        empty_warning: 'Title and content required', name_warning: 'cannot be empty',
        cmd_not_found: 'command not found',
        draft_deleted: 'Draft deleted', draft_published: 'Draft published', draft_loaded: 'Draft loaded to editor',
        blog_updated: 'Blog updated', project_updated: 'Project updated', tool_updated: 'Tool updated',
        movie_updated: 'Movie updated', book_updated: 'Book updated', mood_updated: 'Thought updated',
        skill_updated: 'Skill updated'
    }
};

function t(key) {
    const data = loadData();
    const lang = data.lang || 'zh';
    return (i18n[lang] && i18n[lang][key]) || (i18n.zh[key]) || key;
}

function applyLang() {
    const data = loadData();
    const lang = data.lang || 'zh';
    const btn = document.getElementById('navLangBtn');
    if (btn) btn.textContent = lang === 'zh' ? 'EN' : 'CN';
    const navMap = { home: 'home', blog: 'blog', projects: 'projects', tools: 'tools', github: 'github', bookshelf: 'bookshelf', cinema: 'cinema', mood: 'mood' };
    document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
        const page = a.dataset.page;
        if (navMap[page]) a.textContent = t(page);
    });
    const sub = document.getElementById('heroSubtitle');
    if (sub && !sub.dataset.typed) sub.textContent = t('subtitle');
    const statusText = document.getElementById('statusText');
    if (statusText) statusText.textContent = t('online');
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.placeholder = t('search_placeholder');
    const danmakuInput = document.getElementById('danmakuInput');
    if (danmakuInput) danmakuInput.placeholder = t('danmaku_placeholder');
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
}

function toggleLang() {
    const data = loadData();
    data.lang = data.lang === 'zh' ? 'en' : 'zh';
    saveData(data);
    applyLang();
    showToast(data.lang === 'zh' ? '已切换到中文' : 'Switched to English');
}

// 服务端数据缓存
var _serverData = null;
var _serverDataReady = false;
var _adminKey = '';
var ADMIN_KEY_STORAGE = 'laozig_admin_key';

try {
    _adminKey = localStorage.getItem(ADMIN_KEY_STORAGE) || '';
} catch (e) {
    _adminKey = '';
}

function hasAdminAccess() {
    return !!_adminKey;
}

function hasAdminPage() {
    return !!document.getElementById('page-admin');
}

function isAdminEntry() {
    return !!(document.body && document.body.dataset && document.body.dataset.entry === 'admin');
}

function syncAdminKeyInput() {
    var input = document.getElementById('adminKeyInput');
    if (input) input.value = _adminKey || '';
}

function updateAdminAuthStatus(message, isError) {
    var el = document.getElementById('adminAuthStatus');
    if (!el) return;
    if (message) {
        el.textContent = message;
        el.style.color = isError ? 'var(--pink)' : 'var(--text-secondary)';
        return;
    }
    if (hasAdminAccess()) {
        el.textContent = '已保存管理密钥，可读取草稿并修改共享数据';
        el.style.color = 'var(--green)';
    } else {
        el.textContent = '当前未认证';
        el.style.color = 'var(--text-secondary)';
    }
}

function persistAdminKey(key) {
    _adminKey = (key || '').trim();
    try {
        if (_adminKey) localStorage.setItem(ADMIN_KEY_STORAGE, _adminKey);
        else localStorage.removeItem(ADMIN_KEY_STORAGE);
    } catch (e) {}
    syncAdminKeyInput();
    updateAdminAuthStatus();
}

function requireAdminAccess() {
    if (hasAdminAccess()) return true;
    updateAdminAuthStatus('未认证：请先输入管理密钥', true);
    showToast('请先输入管理密钥', true);
    return false;
}

function handleAuthFailure(message) {
    persistAdminKey('');
    updateAdminAuthStatus(message || '认证失效，请重新输入管理密钥', true);
    showToast(message || '管理密钥无效，请重新认证', true);
    return loadFromServer().then(function() {
        renderHome();
        renderAdmin();
    }).catch(function() {});
}

function loadData() {
    // 如果已有服务端数据缓存，直接使用
    if (_serverDataReady && _serverData) {
        var data = JSON.parse(JSON.stringify(_serverData));
        Object.keys(defaultData).forEach(function(k) {
            if (data[k] === undefined) data[k] = defaultData[k];
        });
        return data;
    }
    // 否则尝试从 localStorage 读取
    try {
        var raw = localStorage.getItem(DB_KEY);
        if (raw) {
            var data = JSON.parse(raw);
            Object.keys(defaultData).forEach(function(k) {
                if (data[k] === undefined) data[k] = defaultData[k];
            });
            return data;
        }
    } catch (e) { console.error('Load error:', e); }
    return JSON.parse(JSON.stringify(defaultData));
}

function saveData(data) {
    // 保存到 localStorage（本地缓存）
    localStorage.setItem(DB_KEY, JSON.stringify(data));
    // 保存到服务端
    _serverData = JSON.parse(JSON.stringify(data));
    return saveToServer(data);
}

function saveToServer(data) {
    if (!hasAdminAccess()) {
        return Promise.resolve({ localOnly: true });
    }
    return fetch('/api/admin/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-admin-key': _adminKey
        },
        body: JSON.stringify(data)
    }).then(function(r) {
        if (r.status === 401) {
            return handleAuthFailure('管理密钥无效，请重新认证').then(function() {
                throw new Error('Unauthorized');
            });
        }
        if (!r.ok) throw new Error('Save failed');
        return r.json();
    }).catch(function(e) {
        if (e.message !== 'Unauthorized') {
            console.warn('[SYNC] 服务端保存失败，数据仅保存在本地');
        }
    });
}

function loadFromServer() {
    return fetch('/api/data')
        .then(function(r) {
            if (!r.ok) throw new Error('API error');
            return r.json();
        })
        .then(function(data) {
            _serverData = data;
            _serverDataReady = true;
            // 同步到 localStorage 作为备份
            localStorage.setItem(DB_KEY, JSON.stringify(data));
            return data;
        })
        .catch(function(e) {
            console.warn('[SYNC] 服务端不可用，使用本地数据');
            _serverDataReady = true;
            _serverData = null;
            return null;
        });
}

function loadAdminDataFromServer() {
    if (!hasAdminAccess()) return Promise.reject(new Error('No admin key'));
    return fetch('/api/admin/data', {
        headers: { 'x-admin-key': _adminKey }
    }).then(function(r) {
        if (r.status === 401) {
            return handleAuthFailure('管理密钥无效，请重新输入').then(function() {
                throw new Error('Unauthorized');
            });
        }
        if (!r.ok) throw new Error('API error');
        return r.json();
    }).then(function(data) {
        _serverData = data;
        _serverDataReady = true;
        localStorage.setItem(DB_KEY, JSON.stringify(data));
        updateAdminAuthStatus('认证成功，已加载管理数据', false);
        return data;
    });
}

function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function createBlogSlug(value) {
    var slug = String(value || '')
        .normalize('NFKC')
        .toLowerCase()
        .replace(/[\s_]+/g, '-')
        .replace(/[^a-z0-9\u3400-\u9fff-]+/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 100)
        .replace(/-$/g, '');
    return slug || 'blog';
}

function getUniqueBlogSlug(title, blogs, currentId) {
    var base = createBlogSlug(title);
    var slug = base;
    var suffix = 2;
    var used = (blogs || []).some(function(blog) {
        return blog.id !== currentId && createBlogSlug(blog.slug || blog.title || blog.id) === slug;
    });
    while (used) {
        slug = base + '-' + suffix++;
        used = (blogs || []).some(function(blog) {
            return blog.id !== currentId && createBlogSlug(blog.slug || blog.title || blog.id) === slug;
        });
    }
    return slug;
}

function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }
    return new Promise(function(resolve, reject) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        try {
            if (!document.execCommand('copy')) throw new Error('copy command failed');
            resolve();
        } catch (error) {
            reject(error);
        } finally {
            document.body.removeChild(textarea);
        }
    });
}

function getBlogExcerpt(blog) {
    return String((blog && blog.content) || '')
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/`([^`]*)`/g, '$1')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/<[^>]*>/g, ' ')
        .replace(/[#>*_~|\-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 160);
}

function setDocumentMeta(attribute, key, value) {
    var selector = 'meta[' + attribute + '="' + key + '"]';
    var meta = document.head.querySelector(selector);
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', value);
}

function updateDocumentMetadata(blog) {
    var isBlog = !!blog;
    var title = isBlog ? blog.title + ' | LAOZIG' : 'LAOZIG | 个人综合站';
    var description = isBlog
        ? (getBlogExcerpt(blog) || 'LAOZIG 博客文章')
        : 'LAOZIG 的个人综合站 - Security Researcher · Reverse Engineer · CTF Player';
    var canonicalUrl = isBlog ? getBlogPermalink(blog) : window.location.origin + '/';
    document.title = title;
    setDocumentMeta('name', 'description', description);
    setDocumentMeta('property', 'og:title', title);
    setDocumentMeta('property', 'og:description', description);
    setDocumentMeta('property', 'og:type', isBlog ? 'article' : 'website');
    setDocumentMeta('property', 'og:url', canonicalUrl);
    setDocumentMeta('name', 'twitter:title', title);
    setDocumentMeta('name', 'twitter:description', description);
    var canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
}

// ===== Toast =====
let toastTimer;
function showToast(msg, isError = false) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = 'toast show' + (isError ? ' error' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

// ===== 工具函数 =====
function formatTime(ts) {
    const d = new Date(ts);
    const pad = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeXml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

var _mdCache = {};
var _mdCacheSize = 0;
var _MD_CACHE_MAX = 30;

function sanitizeMarkdown(markdown, cacheKey) {
    if (cacheKey && _mdCache[cacheKey] !== undefined) {
        return _mdCache[cacheKey];
    }
    var html = '';
    try {
        html = marked.parse(markdown || '');
    } catch (e) {
        html = '';
    }
    if (typeof DOMPurify !== 'undefined') {
        html = DOMPurify.sanitize(html, {
            ADD_TAGS: ['img'],
            ADD_ATTR: ['src', 'alt', 'title', 'width', 'height', 'loading']
        });
    } else {
        html = escapeHtml(markdown || '');
    }
    if (cacheKey) {
        if (_mdCacheSize >= _MD_CACHE_MAX) {
            _mdCache = {};
            _mdCacheSize = 0;
        }
        _mdCache[cacheKey] = html;
        _mdCacheSize++;
    }
    return html;
}

function safeUrl(url) {
    if (typeof url !== 'string') return '';
    var trimmed = url.trim();
    if (!trimmed) return '';
    try {
        var parsed = new URL(trimmed, window.location.origin);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            return parsed.href;
        }
    } catch (e) {}
    return '';
}

function getMovieViewMode() {
    try {
        var mode = localStorage.getItem(MOVIE_VIEW_STORAGE_KEY);
        return mode === 'list' ? 'list' : 'card';
    } catch (e) {
        return 'card';
    }
}

function setMovieViewMode(mode) {
    var nextMode = mode === 'list' ? 'list' : 'card';
    try {
        localStorage.setItem(MOVIE_VIEW_STORAGE_KEY, nextMode);
    } catch (e) {}
    return nextMode;
}

function timeAgo(ts) {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '刚刚';
    if (mins < 60) return mins + ' 分钟前';
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + ' 小时前';
    const days = Math.floor(hours / 24);
    if (days < 30) return days + ' 天前';
    return formatTime(ts);
}

// ===== 访客统计 =====
function trackVisitor() {
    const VISITOR_KEY = 'laozig_visitor';
    try {
        const raw = localStorage.getItem(VISITOR_KEY);
        let visitor = raw ? JSON.parse(raw) : { count: 0, firstVisit: Date.now() };
        visitor.count++;
        visitor.lastVisit = Date.now();
        localStorage.setItem(VISITOR_KEY, JSON.stringify(visitor));
        return visitor;
    } catch (e) {
        return { count: 1, firstVisit: Date.now(), lastVisit: Date.now() };
    }
}

function getVisitorStats() {
    try {
        const raw = localStorage.getItem('laozig_visitor');
        return raw ? JSON.parse(raw) : { count: 0, firstVisit: null };
    } catch (e) {
        return { count: 0, firstVisit: null };
    }
}

// ===== 启动序列 =====
class BootSequence {
    constructor() {
        this.screen = document.getElementById('bootScreen');
        this.ascii = document.getElementById('bootAscii');
        this.log = document.getElementById('bootLog');
        this.bar = document.getElementById('bootBarFill');
        this.lines = [
            { text: '[  OK  ] Kernel initialized', cls: 'log-ok' },
            { text: '[  OK  ] Loading cyber modules...', cls: 'log-ok' },
            { text: '[ INFO ] Mounting /dev/particles', cls: 'log-info' },
            { text: '[  OK  ] Particle engine ready', cls: 'log-ok' },
            { text: '[ INFO ] Initializing grid matrix', cls: 'log-info' },
            { text: '[ WARN ] Scanline overlay active', cls: 'log-warn' },
            { text: '[  OK  ] Theme engine loaded', cls: 'log-ok' },
            { text: '[ INFO ] Decrypting blog archives...', cls: 'log-info' },
            { text: '[  OK  ] Data store connected', cls: 'log-ok' },
            { text: '[ INFO ] Visitor tracking initialized', cls: 'log-info' },
            { text: '[  OK  ] Music engine ready', cls: 'log-ok' },
            { text: '[ INFO ] Booting LAOZIG OS v3.0', cls: 'log-info' },
            { text: '[  OK  ] System ready. Welcome.', cls: 'log-ok' }
        ];
        this.init();
    }
    init() {
        const asciiArt = '\n \u2588\u2588\u2557      \u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2557 \n \u2588\u2588\u2551     \u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557\u255a\u2550\u2550\u2588\u2588\u2588\u2554\u255d\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d \n \u2588\u2588\u2551     \u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551  \u2588\u2588\u2588\u2554\u255d \u2588\u2588\u2551\u2588\u2588\u2551  \u2588\u2588\u2588\u2557\n \u2588\u2588\u2551     \u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551 \u2588\u2588\u2588\u2554\u255d  \u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551\n \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u255a\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d\u255a\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2551\u255a\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d\n \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d \u255a\u2550\u2550\u2550\u255d  \u255a\u2550\u2550\u2550\u255d \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d\u255a\u2550\u255d \u255a\u2550\u2550\u2550\u2550\u255d';
        this.ascii.textContent = asciiArt;
        this.runSequence();
    }
    async runSequence() {
        for (let i = 0; i < this.lines.length; i++) {
            await this.delay(120 + Math.random() * 100);
            const div = document.createElement('div');
            div.className = 'log-line ' + this.lines[i].cls;
            div.textContent = this.lines[i].text;
            this.log.appendChild(div);
            this.bar.style.width = ((i + 1) / this.lines.length * 100) + '%';
        }
        await this.delay(400);
        this.screen.classList.add('fade-out');
        await this.delay(600);
        this.screen.classList.add('hidden');
    }
    delay(ms) { return new Promise(r => setTimeout(r, ms)); }
}

// ===== 粒子动画 =====
class ParticleNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -1000, y: -1000 };
        this.init();
    }
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', e => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; });
        for (let i = 0; i < 55; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                r: Math.random() * 1.5 + 0.5
            });
        }
        this.animate();
    }
    resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; }
    animate() {
        const { ctx, canvas, particles } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        });
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                if (Math.sqrt(dx * dx + dy * dy) < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        particles.forEach(p => {
            const dx = p.x - this.mouse.x;
            const dy = p.y - this.mouse.y;
            const brightness = Math.sqrt(dx * dx + dy * dy) < 120 ? 0.8 : 0.3;
            ctx.fillStyle = 'rgba(0, 240, 255, ' + brightness + ')';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(() => this.animate());
    }
}

// ===== 路由 =====
class Router {
    constructor() {
        this.currentPage = 'home';
        document.querySelectorAll('[data-page]').forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                const page = el.dataset.page;
                if (page && page !== 'blog-detail') this.navigate(page);
            });
        });
    }
    navigate(page) {
        const oldPage = document.querySelector('.page.active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const target = document.getElementById('page-' + page);
        if (target) {
            if (oldPage && oldPage !== target) {
                target.style.animation = 'none';
                target.offsetHeight;
                target.style.animation = '';
                const gridBg = document.getElementById('gridBg');
                if (gridBg) { gridBg.style.opacity = '0.15'; setTimeout(() => { gridBg.style.opacity = ''; }, 200); }
            }
            target.classList.add('active');
            this.currentPage = page;
            document.querySelectorAll('.nav-links a').forEach(a => { a.classList.toggle('active', a.dataset.page === page); });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.querySelector('.nav-links').classList.remove('open');
            this.onPageChange(page);
        }
    }
    onPageChange(page) {
        switch (page) {
            case 'home': renderHome(); break;
            case 'blog': renderBlogList(); break;
            case 'projects': renderProjects(); break;
            case 'tools': renderTools(); break;
            case 'bookshelf': renderBookshelf(); break;
            case 'cinema': renderCinema(); break;
            case 'github': renderGitHub(); break;
            case 'mood': renderMoodList(); break;
            case 'admin': renderAdmin(); break;
        }
    }
}

// ===== 打字机效果 =====
function initTypingEffect() {
    const sub = document.getElementById('heroSubtitle');
    if (!sub) return;
    const text = sub.textContent;
    sub.textContent = '';
    sub.dataset.typed = '1';
    sub.style.borderRight = '2px solid var(--cyan)';
    let i = 0;
    function type() {
        if (i < text.length) {
            sub.textContent += text[i];
            i++;
            setTimeout(type, 60 + Math.random() * 40);
        } else {
            setInterval(() => {
                sub.style.borderRight = sub.style.borderRight === 'none' ? '2px solid var(--cyan)' : 'none';
            }, 530);
        }
    }
    setTimeout(type, 1500);
}

// ===== 渲染函数 =====
function renderHome() {
    const data = loadData();
    document.getElementById('statBlogs').textContent = data.blogs.length;
    document.getElementById('statProjects').textContent = data.projects.length;
    document.getElementById('statTools').textContent = data.tools.length;
    document.getElementById('statMoods').textContent = data.moods.length;
    document.getElementById('statBooks').textContent = data.books.length;
    document.getElementById('aboutText').textContent = data.about;
    if (!document.getElementById('heroSubtitle').dataset.typed) {
        document.getElementById('heroSubtitle').textContent = data.subtitle || defaultData.subtitle;
    }
    document.getElementById('heroTags').innerHTML = (data.tags || []).map(tag => '<span class="tag">' + escapeHtml(tag) + '</span>').join('');
    renderMoodItems('homeMoodList', data.moods.slice(-3).reverse());
    renderSkills(data.skills || []);
    renderActivityMap(data);
    // 页脚统计
    const footerStats = document.getElementById('footerStats');
    if (footerStats) {
        const visitor = getVisitorStats();
        footerStats.textContent = '\uD83D\uDC41 ' + visitor.count + ' visits';
    }
}

function renderSkills(skills) {
    const grid = document.getElementById('skillsGrid');
    if (!skills.length) {
        grid.innerHTML = '<div class="card"><p style="text-align:center;color:var(--text-secondary);">暂无技能数据</p></div>';
        return;
    }
    grid.innerHTML = skills.map(s =>
        '<div class="skill-item"><div class="skill-header"><span class="skill-name">' + escapeHtml(s.name) + '</span><span class="skill-level">' + s.level + '%</span></div><div class="skill-bar"><div class="skill-bar-fill ' + s.color + '" data-level="' + s.level + '"></div></div></div>'
    ).join('');
    setTimeout(() => { grid.querySelectorAll('.skill-bar-fill').forEach(bar => { bar.style.width = bar.dataset.level + '%'; }); }, 100);
}

function renderActivityMap(data) {
    const map = document.getElementById('activityMap');
    const days = [];
    const now = new Date();
    const activityMap = {};
    const allItems = [
        ...data.blogs.map(b => b.created),
        ...data.projects.map(p => p.created),
        ...data.tools.map(t => t.created),
        ...data.books.map(b => b.created),
        ...data.moods.map(m => m.created)
    ];
    allItems.forEach(ts => {
        const d = new Date(ts);
        const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        activityMap[key] = (activityMap[key] || 0) + 1;
    });
    for (let i = 179; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        const count = activityMap[key] || 0;
        let level = 'l0';
        if (count >= 4) level = 'l4';
        else if (count >= 3) level = 'l3';
        else if (count >= 2) level = 'l2';
        else if (count >= 1) level = 'l1';
        days.push('<div class="act-block ' + level + '" data-tip="' + key + ': ' + count + ' 条活动"></div>');
    }
    map.innerHTML = days.join('');
}

// ---- 博客 ----
function renderBlogList(filter) {
    filter = filter || 'all';
    const data = loadData();
    const list = document.getElementById('blogList');
    const blogs = data.blogs.slice().reverse();
    const categories = [...new Set(data.blogs.map(b => b.category).filter(Boolean))];
    const filterBar = document.getElementById('blogFilter');
    filterBar.innerHTML = '<button class="filter-btn ' + (filter === 'all' ? 'active' : '') + '" data-filter="all">全部</button>' +
        categories.map(c => '<button class="filter-btn ' + (filter === c ? 'active' : '') + '" data-filter="' + escapeHtml(c) + '">' + escapeHtml(c) + '</button>').join('');
    filterBar.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => renderBlogList(btn.dataset.filter));
    });
    const filtered = filter === 'all' ? blogs : blogs.filter(b => b.category === filter);
    document.getElementById('blogCount').textContent = '共 ' + filtered.length + ' 篇';
    if (filtered.length === 0) {
        list.innerHTML = '<div class="card"><p style="text-align:center;color:var(--text-secondary);">暂无博客</p></div>';
        return;
    }
    list.innerHTML = filtered.map(b =>
        '<div class="blog-item" data-id="' + b.id + '"><div class="blog-item-title">' + escapeHtml(b.title) + '</div><div class="blog-item-meta"><span>' + formatTime(b.created) + '</span>' + (b.category ? '<span class="blog-item-category">' + escapeHtml(b.category) + '</span>' : '') + (b.tags && b.tags.length ? '<div class="blog-item-tags">' + b.tags.map(tag => '<span>' + escapeHtml(tag) + '</span>').join('') + '</div>' : '') + '</div></div>'
    ).join('');
    list.querySelectorAll('.blog-item').forEach(item => {
        item.addEventListener('click', () => showBlogDetail(item.dataset.id));
    });
}

function showBlogDetail(id) {
    const data = loadData();
    const blog = data.blogs.find(b => b.id === id);
    if (!blog) return;
    const detail = document.getElementById('blogDetail');
    const safeHtml = sanitizeMarkdown(blog.content, 'blog:' + blog.id);
    detail.innerHTML =
        '<h1>' + escapeHtml(blog.title) + '</h1><div class="blog-meta"><span>' + formatTime(blog.created) + '</span>' +
        (blog.category ? '<span class="blog-item-category">' + escapeHtml(blog.category) + '</span>' : '') +
        (blog.tags && blog.tags.length ? '<div class="blog-item-tags">' + blog.tags.map(tag => '<span>' + escapeHtml(tag) + '</span>').join('') + '</div>' : '') +
        '</div><div class="blog-content">' + safeHtml + '</div>';
    // 字数统计和阅读时间
    const plainText = blog.content.replace(/<[^>]*>/g, '').replace(/[#*`\[\]()!>_~\-|]/g, '');
    const charCount = plainText.length;
    const readTime = Math.max(1, Math.ceil(charCount / 500));
    const statsEl = document.getElementById('blogStats');
    if (statsEl) statsEl.innerHTML = '<span>\uD83D\uDCDD ' + charCount + ' 字</span><span>\uD83D\uDCD6 约 ' + readTime + ' 分钟</span>';
    // 分享按钮
    const shareEl = document.getElementById('shareBar');
    if (shareEl) {
        const permalink = getBlogPermalink(blog);
        const shareUrl = encodeURIComponent(permalink);
        const shareTitle = encodeURIComponent(blog.title);
        const shareText = getBlogExcerpt(blog);
        shareEl.innerHTML = '';
        if (navigator.share) {
            const systemShareBtn = document.createElement('button');
            systemShareBtn.className = 'share-btn';
            systemShareBtn.textContent = '📤 分享';
            systemShareBtn.addEventListener('click', function() {
                navigator.share({ title: blog.title, text: shareText, url: permalink }).catch(function(error) {
                    if (error && error.name !== 'AbortError') showToast('系统分享失败，请复制链接', true);
                });
            });
            shareEl.appendChild(systemShareBtn);
        }
        const copyBtn = document.createElement('button');
        copyBtn.className = 'share-btn';
        copyBtn.textContent = '📋 复制链接';
        copyBtn.addEventListener('click', function() {
            copyText(permalink).then(function() {
                showToast('链接已复制');
            }).catch(function() {
                showToast('复制失败，请从地址栏复制', true);
            });
        });
        const twitterBtn = document.createElement('button');
        twitterBtn.className = 'share-btn';
        twitterBtn.textContent = '🐦 Twitter';
        twitterBtn.addEventListener('click', function() {
            window.open('https://twitter.com/intent/tweet?text=' + shareTitle + '&url=' + shareUrl, '_blank', 'noopener');
        });
        shareEl.appendChild(copyBtn);
        shareEl.appendChild(twitterBtn);
    }
    updateDocumentMetadata(blog);
    if (typeof Prism !== 'undefined') {
        document.querySelectorAll('.blog-content pre code').forEach(block => { Prism.highlightElement(block); });
    }
    generateToc();
    renderRelatedPosts(blog);
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-blog-detail').classList.add('active');
}

function generateToc() {
    const content = document.querySelector('.blog-content');
    const tocList = document.getElementById('tocList');
    if (!content || !tocList) return;
    const headings = content.querySelectorAll('h2, h3');
    if (headings.length < 2) { tocList.innerHTML = ''; return; }
    var usedSlugs = {};
    tocList.innerHTML = Array.from(headings).map(function(h) {
        var slug = (h.textContent || '').toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        if (!slug) slug = 'section';
        if (usedSlugs[slug]) {
            var counter = 1;
            while (usedSlugs[slug + '-' + counter]) counter++;
            slug = slug + '-' + counter;
        }
        usedSlugs[slug] = true;
        h.id = slug;
        return '<a href="#' + slug + '" class="' + (h.tagName === 'H3' ? 'toc-h3' : '') + '">' + escapeHtml(h.textContent) + '</a>';
    }).join('');
}

function renderProjects() {
    const data = loadData();
    const grid = document.getElementById('projectGrid');
    document.getElementById('projectCount').textContent = '共 ' + data.projects.length + ' 个';
    if (data.projects.length === 0) { grid.innerHTML = '<div class="card"><p style="text-align:center;color:var(--text-secondary);">暂无项目</p></div>'; return; }
    grid.innerHTML = data.projects.map(p =>
        '<div class="project-card">' + (p.tags && p.tags.length ? '<div class="project-tags">' + p.tags.map(tag => '<span>' + escapeHtml(tag) + '</span>').join('') + '</div>' : '') + '<h3>' + escapeHtml(p.name) + '</h3><p>' + escapeHtml(p.desc) + '</p>' + (p.stars ? '<div class="project-stars">★ ' + p.stars + '</div>' : '') + (safeUrl(p.url) ? '<a href="' + escapeHtml(safeUrl(p.url)) + '" target="_blank" rel="noopener">查看 →</a>' : '') + '</div>'
    ).join('');
}

function renderTools() {
    const data = loadData();
    const grid = document.getElementById('toolsGrid');
    document.getElementById('toolsCount').textContent = '共 ' + data.tools.length + ' 个';
    if (data.tools.length === 0) { grid.innerHTML = '<div class="card"><p style="text-align:center;color:var(--text-secondary);">暂无工具</p></div>'; return; }
    grid.innerHTML = data.tools.map(tool =>
        '<div class="tool-card">' + (tool.category ? '<div class="tool-category">[' + escapeHtml(tool.category) + ']</div>' : '') + '<h3>' + escapeHtml(tool.name) + '</h3><p>' + escapeHtml(tool.desc) + '</p>' + (safeUrl(tool.url) ? '<a href="' + escapeHtml(safeUrl(tool.url)) + '" target="_blank" rel="noopener">打开 →</a>' : '') + '</div>'
    ).join('');
}

function renderCinema(filter) {
    filter = filter || 'all';
    const data = loadData();
    const grid = document.getElementById('movieGrid');
    const movies = data.movies || [];
    const viewMode = getMovieViewMode();
    document.querySelectorAll('[data-movie-filter]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.movieFilter === filter);
        btn.onclick = () => renderCinema(btn.dataset.movieFilter);
    });
    document.querySelectorAll('[data-movie-view]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.movieView === viewMode);
        btn.onclick = function() {
            setMovieViewMode(btn.dataset.movieView);
            renderCinema(filter);
        };
    });
    const filtered = filter === 'all' ? movies : movies.filter(m => m.type === filter);
    document.getElementById('movieCount').textContent = '共 ' + filtered.length + ' 部';
    grid.className = viewMode === 'list' ? 'movie-list' : 'movie-grid';
    if (filtered.length === 0) { grid.innerHTML = '<div class="card"><p style="text-align:center;color:var(--text-secondary);">暂无影视记录</p></div>'; return; }
    const typeLabels = { movie: '电影', tv: '剧集', anime: '动画', docu: '纪录片' };
    const statusLabels = { watched: '已看', watching: '在看', wishlist: '想看' };
    grid.innerHTML = filtered.map(function(m) {
        var metaLines = [
            m.director ? '<div class="movie-meta-line"><span class="movie-meta-label">导演</span><span class="movie-meta-value">' + escapeHtml(m.director) + '</span></div>' : '',
            m.cast ? '<div class="movie-meta-line"><span class="movie-meta-label">主演</span><span class="movie-meta-value">' + escapeHtml(m.cast) + '</span></div>' : ''
        ].join('');
        var link = safeUrl(m.url) ? '<a class="movie-link-btn" href="' + escapeHtml(safeUrl(m.url)) + '" target="_blank" rel="noopener">查看链接</a>' : '';
        if (viewMode === 'list') {
            return '<article class="movie-card movie-card-list">' +
                '<div class="movie-card-main">' +
                '<div class="movie-card-header"><div><h3>' + escapeHtml(m.title) + '</h3></div><div class="movie-meta-row"><span class="movie-type-badge">' + (typeLabels[m.type] || m.type) + '</span><span class="movie-status-badge ' + m.status + '">' + (statusLabels[m.status] || m.status) + '</span></div></div>' +
                (metaLines ? '<div class="movie-meta-block">' + metaLines + '</div>' : '') +
                (m.note ? '<div class="movie-note">' + escapeHtml(m.note) + '</div>' : '') +
                '</div>' +
                '<div class="movie-card-side">' +
                (m.rating ? '<div class="movie-rating movie-rating-prominent">' + '\u2605'.repeat(Math.round(m.rating / 2)) + '\u2606'.repeat(5 - Math.round(m.rating / 2)) + '<span>' + m.rating + '/10</span></div>' : '') +
                link +
                '</div>' +
                '</article>';
        }
        return '<article class="movie-card">' +
            '<div class="movie-card-header"><div><h3>' + escapeHtml(m.title) + '</h3></div></div>' +
            '<div class="movie-meta-row"><span class="movie-type-badge">' + (typeLabels[m.type] || m.type) + '</span><span class="movie-status-badge ' + m.status + '">' + (statusLabels[m.status] || m.status) + '</span></div>' +
            (metaLines ? '<div class="movie-meta-block">' + metaLines + '</div>' : '') +
            (m.rating ? '<div class="movie-rating">' + '\u2605'.repeat(Math.round(m.rating / 2)) + '\u2606'.repeat(5 - Math.round(m.rating / 2)) + ' ' + m.rating + '/10</div>' : '') +
            (m.note ? '<div class="movie-note">' + escapeHtml(m.note) + '</div>' : '') +
            link +
            '</article>';
    }).join('');
}

function renderBookshelf(filter) {
    filter = filter || 'all';
    const data = loadData();
    const grid = document.getElementById('bookGrid');
    const books = data.books || [];
    document.querySelectorAll('[data-book-filter]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.bookFilter === filter);
        btn.onclick = () => renderBookshelf(btn.dataset.bookFilter);
    });
    const filtered = filter === 'all' ? books : books.filter(b => b.status === filter);
    document.getElementById('bookCount').textContent = '共 ' + filtered.length + ' 本';
    if (filtered.length === 0) { grid.innerHTML = '<div class="card"><p style="text-align:center;color:var(--text-secondary);">暂无书籍</p></div>'; return; }
    const statusLabels = { reading: '在读', finished: '已读', wishlist: '想读' };
    grid.innerHTML = filtered.map(b =>
        '<div class="book-card"><div class="book-card-header"><div><h3>' + escapeHtml(b.title) + '</h3><div class="book-author">' + escapeHtml(b.author || '未知作者') + '</div></div><span class="book-status ' + b.status + '">' + (statusLabels[b.status] || b.status) + '</span></div>' + (b.rating ? '<div class="book-stars">' + '★'.repeat(b.rating) + '☆'.repeat(5 - b.rating) + '</div>' : '') + (b.note ? '<div class="book-note">' + escapeHtml(b.note) + '</div>' : '') + '</div>'
    ).join('');
}

function renderMoodItems(containerId, moods) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (moods.length === 0) { container.innerHTML = '<div class="card"><p style="text-align:center;color:var(--text-secondary);">暂无动态</p></div>'; return; }
    container.innerHTML = moods.map(m =>
        '<div class="mood-item"><p><span class="mood-emoji">' + (m.emoji || '💭') + '</span>' + escapeHtml(m.text) + '</p><div class="mood-time">' + timeAgo(m.created) + '</div></div>'
    ).join('');
}

function renderMoodList() {
    const data = loadData();
    document.getElementById('moodCount').textContent = '共 ' + data.moods.length + ' 条';
    renderMoodItems('moodList', data.moods.slice().reverse());
}

// ===== 交互式终端 (增强版) =====
const terminalCommands = {
    help: function() {
        return [
            '<span class="t-line info">═══ 可用命令 ═══</span>',
            '<span class="t-line output">  help     - 显示帮助</span>',
            '<span class="t-line output">  whoami   - 关于我</span>',
            '<span class="t-line output">  ls       - 列出所有内容</span>',
            '<span class="t-line output">  stats    - 数据统计</span>',
            '<span class="t-line output">  blog     - 最新博客</span>',
            '<span class="t-line output">  skills   - 技能列表</span>',
            '<span class="t-line output">  date     - 当前时间</span>',
            '<span class="t-line output">  clear    - 清屏</span>',
            '<span class="t-line output">  matrix   - 矩阵特效</span>',
            '<span class="t-line output">  fortune  - 今日运势</span>',
            '<span class="t-line output">  history  - 命令历史</span>',
            '<span class="t-line output">  visitor  - 访客统计</span>',
            '<span class="t-line output">  theme    - 当前主题</span>',
            '<span class="t-line output">  uptime   - 运行时间</span>'
        ];
    },
    whoami: function() { var data = loadData(); return ['<span class="t-line success">' + escapeHtml(data.about) + '</span>']; },
    ls: function() {
        var data = loadData();
        return [
            '<span class="t-line output">blogs/     (' + data.blogs.length + ' 篇)</span>',
            '<span class="t-line output">projects/  (' + data.projects.length + ' 个)</span>',
            '<span class="t-line output">tools/     (' + data.tools.length + ' 个)</span>',
            '<span class="t-line output">books/     (' + data.books.length + ' 本)</span>',
            '<span class="t-line output">moods/     (' + data.moods.length + ' 条)</span>',
            '<span class="t-line output">movies/    (' + (data.movies || []).length + ' 部)</span>'
        ];
    },
    stats: function() {
        var data = loadData();
        var total = data.blogs.length + data.projects.length + data.tools.length + data.books.length + data.moods.length;
        return [
            '<span class="t-line info">═══ 站点统计 ═══</span>',
            '<span class="t-line output">总内容数: ' + total + '</span>',
            '<span class="t-line output">博客: ' + data.blogs.length + ' | 项目: ' + data.projects.length + '</span>',
            '<span class="t-line output">工具: ' + data.tools.length + ' | 书籍: ' + data.books.length + '</span>',
            '<span class="t-line output">动态: ' + data.moods.length + ' | 技能: ' + (data.skills || []).length + '</span>'
        ];
    },
    blog: function() {
        var data = loadData();
        if (!data.blogs.length) return ['<span class="t-line output">暂无博客</span>'];
        return data.blogs.slice(-3).reverse().map(function(b) {
            return '<span class="t-line output">[' + formatTime(b.created) + '] ' + escapeHtml(b.title) + '</span>';
        });
    },
    skills: function() {
        var data = loadData();
        return (data.skills || []).map(function(s) {
            return '<span class="t-line output">' + escapeHtml(s.name).padEnd(16) + '█'.repeat(Math.round(s.level / 10)) + '░'.repeat(10 - Math.round(s.level / 10)) + ' ' + s.level + '%</span>';
        });
    },
    date: function() { return ['<span class="t-line output">' + new Date().toLocaleString('zh-CN') + '</span>']; },
    clear: function() { return 'CLEAR'; },
    matrix: function() { return ['<span class="t-line success">Wake up, Neo...</span>', '<span class="t-line output">The Matrix has you...</span>', '<span class="t-line info">Follow the white rabbit. 🐇</span>']; },
    fortune: function() {
        var fortunes = ['今日宜写代码，忌摸鱼 ☕', 'Bug 将远离你，Feature 将追随你 🐛', '今日会有重大发现，保持好奇心 💡', '代码如诗，愿你写出最优美的篇章 ✨', '今日适合学习新技术，突破自我 🚀', '休息是为了更好地编码 🌙', '一个 commit 解千愁 🎉'];
        return ['<span class="t-line info">🔮 ' + fortunes[Math.floor(Math.random() * fortunes.length)] + '</span>'];
    },
    visitor: function() {
        var v = getVisitorStats();
        return ['<span class="t-line info">═══ 访客统计 ═══</span>', '<span class="t-line output">访问次数: ' + v.count + '</span>', '<span class="t-line output">首次访问: ' + (v.firstVisit ? formatTime(v.firstVisit) : '-') + '</span>'];
    },
    theme: function() {
        var data = loadData();
        var themes = { default: '赛博青', 'neon-green': '霓虹绿', violet: '暗紫', amber: '琥珀金', red: '赤焰红', disguise: '伪装模式' };
        return ['<span class="t-line output">当前主题: ' + (themes[data.theme] || data.theme) + '</span>'];
    },
    uptime: function() {
        var diff = Math.floor((Date.now() - startTime) / 1000);
        var h = Math.floor(diff / 3600), m = Math.floor((diff % 3600) / 60), s = diff % 60;
        return ['<span class="t-line output">运行时间: ' + h + 'h ' + m + 'm ' + s + 's</span>'];
    }
};

var termHistory = [];
var termHistoryIdx = -1;

function initTerminal() {
    var input = document.getElementById('terminalInput');
    var body = document.getElementById('terminalBody');
    body.innerHTML = '<div class="t-line success">Welcome to LAOZIG Terminal v3.0</div><div class="t-line output">Type "help" for available commands.</div><div class="t-line output">&nbsp;</div>';

    input.addEventListener('keydown', function(e) {
        // 上下箭头翻历史
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (termHistory.length > 0 && termHistoryIdx < termHistory.length - 1) {
                termHistoryIdx++;
                input.value = termHistory[termHistory.length - 1 - termHistoryIdx];
            }
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (termHistoryIdx > 0) {
                termHistoryIdx--;
                input.value = termHistory[termHistory.length - 1 - termHistoryIdx];
            } else {
                termHistoryIdx = -1;
                input.value = '';
            }
            return;
        }
        if (e.key !== 'Enter') return;
        var cmd = input.value.trim().toLowerCase();
        input.value = '';
        termHistoryIdx = -1;
        if (!cmd) return;
        termHistory.push(cmd);
        if (termHistory.length > 100) termHistory.shift();

        body.innerHTML += '<div class="t-line cmd">$ ' + escapeHtml(cmd) + '</div>';

        if (terminalCommands[cmd]) {
            var result = terminalCommands[cmd]();
            if (result === 'CLEAR') {
                body.innerHTML = '';
            } else {
                body.innerHTML += result.join('');
            }
        } else if (cmd === 'history') {
            body.innerHTML += termHistory.map(function(h, i) {
                return '<span class="t-line output">  ' + (i + 1) + '  ' + escapeHtml(h) + '</span>';
            }).join('');
        } else {
            var eggs = {
                'sudo': ['<span class="t-line error">[sudo] permission denied: nice try, hacker 😏</span>'],
                'rm -rf': ['<span class="t-line error">⚠️ nice try, but no.</span>'],
                'hack': ['<span class="t-line info">Initiating hack sequence...</span><br><span class="t-line output">Just kidding. Go read a blog instead.</span>'],
                'coffee': ['<span class="t-line info">☕ Brewing virtual coffee... done.</span>'],
                'hello': ['<span class="t-line success">Hello, friend. Welcome to the machine.</span>'],
                'exit': ['<span class="t-line error">There is no exit. You live here now.</span>'],
                'pwd': ['<span class="t-line output">/home/laozig/cyberspace</span>'],
                'cat flag': ['<span class="t-line success">FLAG{you_f0und_th3_34st3r_3gg}</span>'],
                'ls -la': ['<span class="t-line output">drwxr-xr-x  laozig  staff  .ssh/</span><br><span class="t-line output">-rw-------  laozig  staff  secrets.enc</span><br><span class="t-line output">drwxr-xr-x  laozig  staff  exploits/</span>'],
                'neofetch': ['<span class="t-line info">  LAOZIG OS v3.0</span><br><span class="t-line output">  Uptime: since you opened this tab</span><br><span class="t-line output">  Kernel: cyber-punk-6.66</span><br><span class="t-line output">  Shell: laozig-sh 3.0</span>'],
                'ping': ['<span class="t-line output">PING localhost (127.0.0.1): 56 data bytes</span><br><span class="t-line success">64 bytes: ttl=64 time=0.042ms ✅</span>']
            };
            if (eggs[cmd]) {
                body.innerHTML += eggs[cmd].join('');
            } else {
                body.innerHTML += '<div class="t-line error">command not found: ' + escapeHtml(cmd) + '</div>';
                if (Math.random() < 0.3) {
                    var cmds = Object.keys(terminalCommands);
                    body.innerHTML += '<div class="t-line output">💡 试试: ' + cmds[Math.floor(Math.random() * cmds.length)] + '</div>';
                }
            }
        }
        body.innerHTML += '<div class="t-line output">&nbsp;</div>';
        body.scrollTop = body.scrollHeight;
    });
}

// ===== 全站搜索 =====
function initSearch() {
    var modal = document.getElementById('searchModal');
    var input = document.getElementById('searchInput');
    function openSearch() { modal.classList.add('open'); input.value = ''; input.focus(); document.getElementById('searchResults').innerHTML = '<div class="search-empty">输入关键词开始搜索</div>'; }
    function closeSearch() { modal.classList.remove('open'); }
    document.getElementById('navSearchBtn').addEventListener('click', openSearch);
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
        if (e.key === 'Escape') closeSearch();
    });
    modal.addEventListener('click', function(e) { if (e.target === modal) closeSearch(); });
    var searchTimer = null;
    input.addEventListener('input', function() {
        var q = input.value.trim().toLowerCase();
        if (!q) {
            document.getElementById('searchResults').innerHTML = '<div class="search-empty">输入关键词开始搜索</div>';
            clearTimeout(searchTimer);
            return;
        }
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function() {
            performSearch(q);
        }, 300);
    });
}

function performSearch(q) {
    var data = loadData();
    var results = [];
    data.blogs.forEach(function(b) { if (b.title.toLowerCase().includes(q) || b.content.toLowerCase().includes(q)) results.push({ type: '博客', title: b.title, sub: formatTime(b.created), action: function() { showBlogDetail(b.id); } }); });
    data.projects.forEach(function(p) { if (p.name.toLowerCase().includes(q) || (p.desc || '').toLowerCase().includes(q)) results.push({ type: '项目', title: p.name, sub: p.desc, action: function() { router.navigate('projects'); } }); });
    data.tools.forEach(function(tool) { if (tool.name.toLowerCase().includes(q) || (tool.desc || '').toLowerCase().includes(q)) results.push({ type: '工具', title: tool.name, sub: tool.desc, action: function() { router.navigate('tools'); } }); });
    (data.movies || []).forEach(function(m) { if (m.title.toLowerCase().includes(q) || (m.director || '').toLowerCase().includes(q)) results.push({ type: '影视', title: m.title, sub: m.director || '', action: function() { router.navigate('cinema'); } }); });
    data.books.forEach(function(b) { if (b.title.toLowerCase().includes(q) || (b.author || '').toLowerCase().includes(q)) results.push({ type: '书籍', title: b.title, sub: b.author, action: function() { router.navigate('bookshelf'); } }); });
    data.moods.forEach(function(m) { if (m.text.toLowerCase().includes(q)) results.push({ type: '动态', title: m.text.slice(0, 50), sub: timeAgo(m.created), action: function() { router.navigate('mood'); } }); });

    var container = document.getElementById('searchResults');
    if (results.length === 0) { container.innerHTML = '<div class="search-empty">未找到匹配结果</div>'; return; }
    container.innerHTML = results.slice(0, 15).map(function(r, i) {
        return '<div class="search-result-item" data-idx="' + i + '"><span class="search-result-type">' + r.type + '</span><div class="search-result-text"><div class="search-result-title">' + escapeHtml(r.title) + '</div><div class="search-result-sub">' + escapeHtml(r.sub || '') + '</div></div></div>';
    }).join('');
    container.querySelectorAll('.search-result-item').forEach(function(item) {
        item.addEventListener('click', function() { results[parseInt(item.dataset.idx)].action(); document.getElementById('searchModal').classList.remove('open'); });
    });
}

// ===== 管理后台 =====
function renderAdmin() {
    if (!hasAdminPage()) return;
    var data = loadData();
    var protectedEl = document.getElementById('adminProtected');
    var dataSectionEl = document.getElementById('adminDataSection');
    syncAdminKeyInput();
    updateAdminAuthStatus();
    if (protectedEl) protectedEl.style.display = hasAdminAccess() ? '' : 'none';
    if (dataSectionEl) dataSectionEl.style.display = hasAdminAccess() ? '' : 'none';
    if (!hasAdminAccess()) return;
    document.getElementById('editAbout').value = data.about;
    document.getElementById('editSubtitle').value = data.subtitle || '';
    document.getElementById('editTags').value = (data.tags || []).join(', ');
    var ghInput = document.getElementById('editGH');
    if (ghInput) ghInput.value = data.ghUsername || '';
    renderAdminLists();
    renderDashboard(data);
}

function renderDashboard(data) {
    document.getElementById('dashBlogs').textContent = data.blogs.length;
    document.getElementById('dashProjects').textContent = data.projects.length;
    document.getElementById('dashTools').textContent = data.tools.length;
    document.getElementById('dashMovies').textContent = (data.movies || []).length;
    document.getElementById('dashBooks').textContent = (data.books || []).length;
    document.getElementById('dashMoods').textContent = data.moods.length;
    document.getElementById('dashDrafts').textContent = (data.drafts || []).length;
    document.getElementById('dashSkills').textContent = (data.skills || []).length;
    // 访客统计
    var visitor = getVisitorStats();
    var dashVisitors = document.getElementById('dashVisitors');
    if (dashVisitors) dashVisitors.textContent = visitor.count;
    var dashFirstVisit = document.getElementById('dashFirstVisit');
    if (dashFirstVisit) dashFirstVisit.textContent = visitor.firstVisit ? formatTime(visitor.firstVisit) : '-';

    // 趋势图
    var canvas = document.getElementById('trendChart');
    if (canvas) {
        var ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = 400;
        ctx.scale(2, 2);
        var w = canvas.offsetWidth, h = 200;
        ctx.clearRect(0, 0, w, h);
        var months = [], counts = [];
        var allItems = [].concat(data.blogs, data.projects, data.tools, data.movies || [], data.moods);
        var now = new Date();
        for (var i = 11; i >= 0; i--) {
            var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push(String(d.getMonth() + 1).padStart(2, '0'));
            counts.push(allItems.filter(function(item) { var id = new Date(item.created); return id.getFullYear() === d.getFullYear() && id.getMonth() === d.getMonth(); }).length);
        }
        var maxCount = Math.max.apply(null, counts.concat([1]));
        ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 0.5;
        for (var j = 0; j < 5; j++) { var y = 20 + (h - 50) * j / 4; ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(w - 10, y); ctx.stroke(); }
        var gradient = ctx.createLinearGradient(0, 0, w, 0);
        gradient.addColorStop(0, 'rgba(0, 240, 255, 0.8)'); gradient.addColorStop(1, 'rgba(124, 58, 237, 0.8)');
        ctx.strokeStyle = gradient; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.beginPath();
        var points = [];
        for (var k = 0; k < 12; k++) {
            var px = 40 + (w - 50) * k / 11;
            var py = 20 + (h - 50) * (1 - counts[k] / maxCount);
            points.push({ x: px, y: py });
            if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        var fillGrad = ctx.createLinearGradient(0, 20, 0, h - 30);
        fillGrad.addColorStop(0, 'rgba(0, 240, 255, 0.15)'); fillGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.fillStyle = fillGrad;
        ctx.lineTo(points[points.length - 1].x, h - 30); ctx.lineTo(points[0].x, h - 30); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#00f0ff';
        points.forEach(function(p, idx) {
            ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(136,136,170,0.7)'; ctx.font = '10px monospace'; ctx.textAlign = 'center';
            ctx.fillText(months[idx], p.x, h - 15); ctx.fillStyle = '#00f0ff';
        });
    }
    // 分类分布
    var catEl = document.getElementById('categoryStats');
    if (catEl) {
        var categories = {};
        data.blogs.forEach(function(b) { var cat = b.category || '未分类'; categories[cat] = (categories[cat] || 0) + 1; });
        var entries = Object.entries(categories).sort(function(a, b) { return b[1] - a[1]; });
        var maxCat = entries.length ? entries[0][1] : 1;
        var colors = ['var(--cyan)', 'var(--pink)', 'var(--purple)', 'var(--green)', 'var(--orange)'];
        catEl.innerHTML = entries.length ? entries.map(function(e, idx) {
            return '<div class="cat-bar"><span class="cat-bar-name">' + escapeHtml(e[0]) + '</span><div class="cat-bar-track"><div class="cat-bar-fill" style="width:' + (e[1] / maxCat * 100) + '%;background:' + (colors[idx % colors.length]) + '"></div></div><span class="cat-bar-count">' + e[1] + '</span></div>';
        }).join('') : '<p style="color:var(--text-secondary);font-size:0.82rem;">暂无分类数据</p>';
    }
}

function adminActionButton(action, value, label, className, inlineStyle) {
    return '<button' +
        (className ? ' class="' + className + '"' : '') +
        (inlineStyle ? ' style="' + inlineStyle + '"' : '') +
        ' data-admin-action="' + action + '" data-value="' + encodeURIComponent(String(value || '')) + '">' + label + '</button>';
}

function bindAdminActionButtons(root) {
    (root || document).querySelectorAll('[data-admin-action]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var action = btn.getAttribute('data-admin-action');
            var value = decodeURIComponent(btn.getAttribute('data-value') || '');
            switch (action) {
                case 'editDraft': editDraft(value); break;
                case 'publishDraft': publishDraft(value); break;
                case 'deleteDraft': deleteDraft(value); break;
                case 'editBlog': editBlog(value); break;
                case 'deleteBlog': deleteBlog(value); break;
                case 'editProject': editProject(value); break;
                case 'deleteProject': deleteProject(value); break;
                case 'editTool': editTool(value); break;
                case 'deleteTool': deleteTool(value); break;
                case 'editMovie': editMovie(value); break;
                case 'deleteMovie': deleteMovie(value); break;
                case 'editBook': editBook(value); break;
                case 'deleteBook': deleteBook(value); break;
                case 'editMood': editMood(value); break;
                case 'deleteMood': deleteMood(value); break;
                case 'editSkill': editSkill(value); break;
                case 'deleteSkill': deleteSkill(value); break;
            }
        });
    });
}

function renderAdminLists() {
    var data = loadData();
    // 草稿箱
    document.getElementById('blogDraftList').innerHTML = (data.drafts || []).map(function(b) {
        return '<li><span>📝 ' + escapeHtml(b.title || '无标题') + '</span><span style="display:flex;gap:0.3rem;flex-shrink:0;">' + adminActionButton('editDraft', b.id, '编辑', 'edit-btn') + adminActionButton('publishDraft', b.id, '发布', 'edit-btn', 'border-color:var(--green);color:var(--green);') + adminActionButton('deleteDraft', b.id, '删除') + '</span></li>';
    }).join('') || '<li><span style="opacity:0.5">暂无草稿</span></li>';
    // 博客
    document.getElementById('blogAdminList').innerHTML = data.blogs.slice().reverse().map(function(b) {
        return '<li><span>' + escapeHtml(b.title) + '</span><span style="display:flex;gap:0.3rem;flex-shrink:0;">' + adminActionButton('editBlog', b.id, '编辑', 'edit-btn') + adminActionButton('deleteBlog', b.id, '删除') + '</span></li>';
    }).join('') || '<li><span style="opacity:0.5">暂无</span></li>';
    // 项目
    document.getElementById('projectAdminList').innerHTML = data.projects.map(function(p) {
        return '<li><span>' + escapeHtml(p.name) + '</span><span style="display:flex;gap:0.3rem;flex-shrink:0;">' + adminActionButton('editProject', p.id, '编辑', 'edit-btn') + adminActionButton('deleteProject', p.id, '删除') + '</span></li>';
    }).join('') || '<li><span style="opacity:0.5">暂无</span></li>';
    // 工具
    document.getElementById('toolAdminList').innerHTML = data.tools.map(function(tool) {
        return '<li><span>' + escapeHtml(tool.name) + '</span><span style="display:flex;gap:0.3rem;flex-shrink:0;">' + adminActionButton('editTool', tool.id, '编辑', 'edit-btn') + adminActionButton('deleteTool', tool.id, '删除') + '</span></li>';
    }).join('') || '<li><span style="opacity:0.5">暂无</span></li>';
    // 影视
    document.getElementById('movieAdminList').innerHTML = (data.movies || []).map(function(m) {
        var summary = [m.director, m.cast].filter(Boolean).join(' / ');
        return '<li><span>' + escapeHtml(m.title) + (summary ? '<span style="opacity:0.7;font-size:0.78rem;"> · ' + escapeHtml(summary) + '</span>' : '') + '</span><span style="display:flex;gap:0.3rem;flex-shrink:0;">' + adminActionButton('editMovie', m.id, '编辑', 'edit-btn') + adminActionButton('deleteMovie', m.id, '删除') + '</span></li>';
    }).join('') || '<li><span style="opacity:0.5">暂无</span></li>';
    // 书籍
    document.getElementById('bookAdminList').innerHTML = (data.books || []).map(function(b) {
        return '<li><span>' + escapeHtml(b.title) + '</span><span style="display:flex;gap:0.3rem;flex-shrink:0;">' + adminActionButton('editBook', b.id, '编辑', 'edit-btn') + adminActionButton('deleteBook', b.id, '删除') + '</span></li>';
    }).join('') || '<li><span style="opacity:0.5">暂无</span></li>';
    // 碎碎念
    document.getElementById('moodAdminList').innerHTML = data.moods.slice().reverse().map(function(m) {
        return '<li><span>' + escapeHtml(m.text) + '</span><span style="display:flex;gap:0.3rem;flex-shrink:0;">' + adminActionButton('editMood', m.id, '编辑', 'edit-btn') + adminActionButton('deleteMood', m.id, '删除') + '</span></li>';
    }).join('') || '<li><span style="opacity:0.5">暂无</span></li>';
    // 技能
    document.getElementById('skillAdminList').innerHTML = (data.skills || []).map(function(s) {
        return '<li><span>' + escapeHtml(s.name) + ' (' + s.level + '%)</span><span style="display:flex;gap:0.3rem;flex-shrink:0;">' + adminActionButton('editSkill', s.name, '编辑', 'edit-btn') + adminActionButton('deleteSkill', s.name, '删除') + '</span></li>';
    }).join('') || '<li><span style="opacity:0.5">暂无</span></li>';
    // 主题
    var currentTheme = data.theme || 'default';
    document.querySelectorAll('.theme-btn').forEach(function(btn) { btn.classList.toggle('active', btn.dataset.theme === currentTheme); });
    bindAdminActionButtons(document.getElementById('page-admin'));
}

// ===== CRUD 操作 (增强版 - 支持编辑) =====
function deleteDraft(id) { if (!requireAdminAccess()) return; var d = loadData(); d.drafts = (d.drafts || []).filter(function(b) { return b.id !== id; }); saveData(d); showToast('草稿已删除'); renderAdminLists(); }
function publishDraft(id) {
    if (!requireAdminAccess()) return;
    var d = loadData();
    var draft = (d.drafts || []).find(function(b) { return b.id === id; });
    if (!draft) return;
    draft.created = Date.now();
    draft.slug = getUniqueBlogSlug(draft.title, d.blogs, draft.id);
    d.blogs.push(draft);
    d.drafts = d.drafts.filter(function(b) { return b.id !== id; });
    saveData(d);
    showToast('草稿已发布');
    renderAdminLists();
}
function editDraft(id) {
    var d = loadData();
    var draft = (d.drafts || []).find(function(b) { return b.id === id; });
    if (!draft) return;
    document.getElementById('blogTitle').value = draft.title || '';
    document.getElementById('blogTags').value = (draft.tags || []).join(', ');
    document.getElementById('blogCategory').value = draft.category || '';
    setBlogEditorContent(draft.content || '');
    clearBlogImageHelper();
    showToast('草稿已加载到编辑器');
}
function deleteBlog(id) { if (!requireAdminAccess()) return; var d = loadData(); d.blogs = d.blogs.filter(function(b) { return b.id !== id; }); saveData(d); showToast('已删除'); renderAdminLists(); }
function deleteProject(id) { if (!requireAdminAccess()) return; var d = loadData(); d.projects = d.projects.filter(function(p) { return p.id !== id; }); saveData(d); showToast('已删除'); renderAdminLists(); }
function deleteTool(id) { if (!requireAdminAccess()) return; var d = loadData(); d.tools = d.tools.filter(function(tool) { return tool.id !== id; }); saveData(d); showToast('已删除'); renderAdminLists(); }
function deleteBook(id) { if (!requireAdminAccess()) return; var d = loadData(); d.books = (d.books || []).filter(function(b) { return b.id !== id; }); saveData(d); showToast('已删除'); renderAdminLists(); }
function deleteMood(id) { if (!requireAdminAccess()) return; var d = loadData(); d.moods = d.moods.filter(function(m) { return m.id !== id; }); saveData(d); showToast('已删除'); renderAdminLists(); }
function deleteSkill(name) { if (!requireAdminAccess()) return; var d = loadData(); d.skills = (d.skills || []).filter(function(s) { return s.name !== name; }); saveData(d); showToast('已删除'); renderAdminLists(); }
function deleteMovie(id) { if (!requireAdminAccess()) return; var d = loadData(); d.movies = (d.movies || []).filter(function(m) { return m.id !== id; }); saveData(d); showToast('已删除'); renderAdminLists(); }

// ===== 编辑功能 =====
function editBlog(id) {
    var d = loadData();
    var blog = d.blogs.find(function(b) { return b.id === id; });
    if (!blog) return;
    document.getElementById('blogEditTitle').textContent = '编辑博客';
    document.getElementById('blogEditId').value = id;
    document.getElementById('blogTitle').value = blog.title;
    document.getElementById('blogTags').value = (blog.tags || []).join(', ');
    document.getElementById('blogCategory').value = blog.category || '';
    setBlogEditorContent(blog.content || '');
    clearBlogImageHelper();
    document.getElementById('addBlog').textContent = '更新';
    document.getElementById('cancelEdit').style.display = '';
    showToast('正在编辑: ' + blog.title);
}

function editProject(id) {
    var d = loadData();
    var p = d.projects.find(function(proj) { return proj.id === id; });
    if (!p) return;
    document.getElementById('projEditTitle').textContent = '编辑项目';
    document.getElementById('projEditId').value = id;
    document.getElementById('projName').value = p.name;
    document.getElementById('projDesc').value = p.desc || '';
    document.getElementById('projUrl').value = p.url || '';
    document.getElementById('projTags').value = (p.tags || []).join(', ');
    document.getElementById('projStars').value = p.stars || '';
    document.getElementById('addProject').textContent = '更新';
    document.getElementById('cancelProjEdit').style.display = '';
}

function editTool(id) {
    var d = loadData();
    var tool = d.tools.find(function(t) { return t.id === id; });
    if (!tool) return;
    document.getElementById('toolEditTitle').textContent = '编辑工具';
    document.getElementById('toolEditId').value = id;
    document.getElementById('toolName').value = tool.name;
    document.getElementById('toolDesc').value = tool.desc || '';
    document.getElementById('toolUrl').value = tool.url || '';
    document.getElementById('toolCategory').value = tool.category || '';
    document.getElementById('addTool').textContent = '更新';
    document.getElementById('cancelToolEdit').style.display = '';
}

function editMovie(id) {
    var d = loadData();
    var m = (d.movies || []).find(function(movie) { return movie.id === id; });
    if (!m) return;
    document.getElementById('movieEditTitle').textContent = '编辑影视';
    document.getElementById('movieEditId').value = id;
    document.getElementById('movieTitle').value = m.title;
    document.getElementById('movieDirector').value = m.director || '';
    document.getElementById('movieCast').value = m.cast || '';
    document.getElementById('movieUrl').value = m.url || '';
    document.getElementById('movieType').value = m.type;
    document.getElementById('movieStatus').value = m.status;
    document.getElementById('movieRating').value = m.rating || '';
    document.getElementById('movieNote').value = m.note || '';
    document.getElementById('addMovie').textContent = '更新';
    document.getElementById('cancelMovieEdit').style.display = '';
}

function editBook(id) {
    var d = loadData();
    var book = (d.books || []).find(function(b) { return b.id === id; });
    if (!book) return;
    document.getElementById('bookEditTitle').textContent = '编辑书籍';
    document.getElementById('bookEditId').value = id;
    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookAuthor').value = book.author || '';
    document.getElementById('bookStatus').value = book.status;
    document.getElementById('bookRating').value = book.rating || '';
    document.getElementById('bookNote').value = book.note || '';
    document.getElementById('addBook').textContent = '更新';
    document.getElementById('cancelBookEdit').style.display = '';
}

function editMood(id) {
    var d = loadData();
    var m = d.moods.find(function(mood) { return mood.id === id; });
    if (!m) return;
    document.getElementById('moodEditTitle').textContent = '编辑碎碎念';
    document.getElementById('moodEditId').value = id;
    document.getElementById('moodText').value = m.text;
    document.getElementById('moodEmoji').value = m.emoji || '💭';
    document.getElementById('addMood').textContent = '更新';
    document.getElementById('cancelMoodEdit').style.display = '';
}

function editSkill(name) {
    var d = loadData();
    var s = (d.skills || []).find(function(sk) { return sk.name === name; });
    if (!s) return;
    document.getElementById('skillEditTitle').textContent = '编辑技能';
    document.getElementById('skillEditName').value = name;
    document.getElementById('skillName').value = s.name;
    document.getElementById('skillLevel').value = s.level;
    document.getElementById('skillColor').value = s.color;
    document.getElementById('addSkill').textContent = '更新';
    document.getElementById('cancelSkillEdit').style.display = '';
}

// ===== 取消编辑 =====
function resetBlogForm() {
    document.getElementById('blogEditTitle').textContent = '添加博客';
    document.getElementById('blogEditId').value = '';
    document.getElementById('blogTitle').value = '';
    document.getElementById('blogTags').value = '';
    document.getElementById('blogCategory').value = '';
    setBlogEditorContent('');
    clearBlogImageHelper();
    document.getElementById('addBlog').textContent = '发布';
    document.getElementById('cancelEdit').style.display = 'none';
}
function resetProjForm() {
    document.getElementById('projEditTitle').textContent = '添加项目';
    document.getElementById('projEditId').value = '';
    ['projName','projDesc','projUrl','projTags','projStars'].forEach(function(id) { document.getElementById(id).value = ''; });
    document.getElementById('addProject').textContent = '添加';
    document.getElementById('cancelProjEdit').style.display = 'none';
}
function resetToolForm() {
    document.getElementById('toolEditTitle').textContent = '添加工具';
    document.getElementById('toolEditId').value = '';
    ['toolName','toolDesc','toolUrl','toolCategory'].forEach(function(id) { document.getElementById(id).value = ''; });
    document.getElementById('addTool').textContent = '添加';
    document.getElementById('cancelToolEdit').style.display = 'none';
}
function resetMovieForm() {
    document.getElementById('movieEditTitle').textContent = '添加影视';
    document.getElementById('movieEditId').value = '';
    ['movieTitle','movieDirector','movieCast','movieUrl','movieRating','movieNote'].forEach(function(id) { document.getElementById(id).value = ''; });
    document.getElementById('addMovie').textContent = '添加';
    document.getElementById('cancelMovieEdit').style.display = 'none';
}
function resetBookForm() {
    document.getElementById('bookEditTitle').textContent = '添加书籍';
    document.getElementById('bookEditId').value = '';
    ['bookTitle','bookAuthor','bookRating','bookNote'].forEach(function(id) { document.getElementById(id).value = ''; });
    document.getElementById('addBook').textContent = '添加';
    document.getElementById('cancelBookEdit').style.display = 'none';
}
function resetMoodForm() {
    document.getElementById('moodEditTitle').textContent = '发一条碎碎念';
    document.getElementById('moodEditId').value = '';
    document.getElementById('moodText').value = '';
    document.getElementById('addMood').textContent = '发布';
    document.getElementById('cancelMoodEdit').style.display = 'none';
}
function resetSkillForm() {
    document.getElementById('skillEditTitle').textContent = '添加技能';
    document.getElementById('skillEditName').value = '';
    document.getElementById('skillName').value = '';
    document.getElementById('skillLevel').value = '';
    document.getElementById('addSkill').textContent = '添加';
    document.getElementById('cancelSkillEdit').style.display = 'none';
}

// ===== 弹幕墙 =====
function initDanmaku() {
    var stage = document.getElementById('danmakuStage');
    var input = document.getElementById('danmakuInput');
    var sendBtn = document.getElementById('danmakuSend');
    if (!stage || !input || !sendBtn) return;
    var DANMAKU_KEY = 'laozig_danmaku';
    var defaultBullets = ['Hello World!', '赛博朋克风太酷了', '逆向工程爱好者路过', 'BugFree!'];
    function getBullets() { try { var raw = localStorage.getItem(DANMAKU_KEY); return raw ? JSON.parse(raw) : defaultBullets; } catch(e) { return defaultBullets; } }
    function saveBullets(list) { localStorage.setItem(DANMAKU_KEY, JSON.stringify(list.slice(-100))); }
    function fire(text) {
        var el = document.createElement('div');
        el.className = 'danmaku-bullet';
        el.textContent = text;
        el.style.top = Math.random() * (stage.offsetHeight - 30) + 'px';
        el.style.animationDuration = (6 + Math.random() * 4) + 's';
        var colors = ['var(--cyan)', 'var(--pink)', 'var(--green)', 'var(--orange)', 'var(--purple)', 'var(--text-primary)'];
        el.style.color = colors[Math.floor(Math.random() * colors.length)];
        stage.appendChild(el);
        setTimeout(function() { el.remove(); }, 10000);
    }
    function autoFire() {
        var bullets = getBullets();
        if (bullets.length > 0) fire(bullets[Math.floor(Math.random() * bullets.length)]);
        setTimeout(autoFire, 2000 + Math.random() * 3000);
    }
    function send() {
        var text = input.value.trim();
        if (!text) return;
        fire(text);
        var bullets = getBullets();
        bullets.push(text);
        saveBullets(bullets);
        input.value = '';
        showToast(t('danmaku_sent'));
    }
    sendBtn.addEventListener('click', send);
    input.addEventListener('keydown', function(e) { if (e.key === 'Enter') send(); });
    var bullets = getBullets();
    for (var i = 0; i < 3; i++) { setTimeout(function() { fire(bullets[Math.floor(Math.random() * bullets.length)]); }, i * 800); }
    setTimeout(autoFire, 4000);
}

// ===== 阅读进度条 =====
function initReadingProgress() {
    var bar = document.getElementById('readingProgressBar');
    var wrap = document.getElementById('readingProgress');
    if (!bar || !wrap) return;
    window.addEventListener('scroll', function() {
        var detailPage = document.getElementById('page-blog-detail');
        if (!detailPage || !detailPage.classList.contains('active')) { wrap.classList.remove('active'); return; }
        wrap.classList.add('active');
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0) + '%';
    });
}

var _mdEditorState = null;

function deriveImageAlt(url) {
    try {
        var pathname = new URL(url).pathname;
        var name = pathname.split('/').pop() || 'image';
        return name.replace(/\.[a-z0-9]+$/i, '') || 'image';
    } catch (e) {
        return 'image';
    }
}

function looksLikeImageUrl(url) {
    if (/\.(png|jpe?g|gif|webp|bmp|svg|avif|tiff?)(\?.*)?$/i.test(url)) return true;
    var imageHosts = [
        'imgur.com', 'i.imgur.com',
        'smms.app', 's2.loli.net', 'sm.ms',
        'imgbb.com', 'i.ibb.co',
        'postimg.cc', 'i.postimg.cc',
        'pic.imgdb.cn',
        'telegraph-image',
        'cdn.jsdelivr.net',
        'raw.githubusercontent.com',
        'img.picgo.net',
        'mmbiz.qpic.cn',
        'img-blog.csdnimg.cn',
        'picx.zhimg.com'
    ];
    try {
        var host = new URL(url).hostname;
        return imageHosts.some(function(h) { return host === h || host.endsWith('.' + h); });
    } catch (e) {
        return false;
    }
}

function extractImageMarkdown(raw, altOverride) {
    var text = (raw || '').trim();
    if (!text) return '';
    var markdownMatch = text.match(/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)$/i);
    if (markdownMatch) {
        return '![' + (markdownMatch[1] || (altOverride || 'image')) + '](' + markdownMatch[2] + ')';
    }
    var urlMatch = text.match(/^https?:\/\/[^\s]+$/i);
    if (!urlMatch) return '';
    var url = urlMatch[0];
    if (!looksLikeImageUrl(url)) return '';
    var alt = (altOverride || '').trim() || deriveImageAlt(url);
    return '![' + alt + '](' + url + ')';
}

function updateBlogImageStatus(message, isError, isSuccess) {
    var status = document.getElementById('blogImageStatus');
    if (!status) return;
    status.textContent = message || '粘贴图床 Markdown 或图片 URL，支持自动转成 Markdown。';
    status.classList.remove('error', 'success');
    if (isError) status.classList.add('error');
    if (isSuccess) status.classList.add('success');
}

function clearBlogImageHelper() {
    var input = document.getElementById('blogImageInput');
    var alt = document.getElementById('blogImageAlt');
    if (input) input.value = '';
    if (alt) alt.value = '';
    updateBlogImageStatus();
}

function setBlogEditorContent(value) {
    var next = value || '';
    var blogContent = document.getElementById('blogContent');
    if (blogContent) blogContent.value = next;
    if (_mdEditorState && _mdEditorState.source) {
        _mdEditorState.source.value = next;
        _mdEditorState.updatePreview();
    }
}

function syncBlogEditorValue(sourceEl) {
    if (!sourceEl) return;
    var blogContent = document.getElementById('blogContent');
    var mdSource = _mdEditorState && _mdEditorState.source;
    if (sourceEl === mdSource) {
        if (blogContent) blogContent.value = sourceEl.value;
        if (_mdEditorState) _mdEditorState.updatePreview();
        return;
    }
    if (blogContent && sourceEl === blogContent && mdSource) {
        mdSource.value = sourceEl.value;
        _mdEditorState.updatePreview();
    }
}

function getActiveBlogEditor() {
    if (_mdEditorState && _mdEditorState.isActive()) {
        return _mdEditorState.source;
    }
    return document.getElementById('blogContent');
}

function insertTextAtCursor(target, text) {
    if (!target) return;
    var start = typeof target.selectionStart === 'number' ? target.selectionStart : target.value.length;
    var end = typeof target.selectionEnd === 'number' ? target.selectionEnd : target.value.length;
    var before = target.value.slice(0, start);
    var after = target.value.slice(end);
    var prefix = before && !/\n\n?$/.test(before) ? '\n' : '';
    var suffix = after && after.charAt(0) !== '\n' ? '\n' : '';
    target.value = before + prefix + text + suffix + after;
    var cursor = (before + prefix + text).length;
    target.focus();
    if (typeof target.setSelectionRange === 'function') {
        target.setSelectionRange(cursor, cursor);
    }
    syncBlogEditorValue(target);
}

function initBlogImageHelper() {
    var input = document.getElementById('blogImageInput');
    var alt = document.getElementById('blogImageAlt');
    var insertBtn = document.getElementById('insertBlogImage');
    var clearBtn = document.getElementById('clearBlogImage');
    var blogContent = document.getElementById('blogContent');
    var mdSource = document.getElementById('mdSource');
    if (!input || !insertBtn || !blogContent) return;

    function insertFromRaw(raw, forceInsert) {
        var markdown = extractImageMarkdown(raw, alt ? alt.value : '');
        if (!markdown && forceInsert) {
            var text = (raw || '').trim();
            var urlMatch = text.match(/^https?:\/\/[^\s]+$/i);
            if (urlMatch) {
                var altText = (alt ? alt.value : '').trim() || 'image';
                markdown = '![' + altText + '](' + urlMatch[0] + ')';
            }
        }
        if (!markdown) {
            updateBlogImageStatus('请输入图床 Markdown 或图片 URL', true);
            return false;
        }
        insertTextAtCursor(getActiveBlogEditor(), markdown);
        updateBlogImageStatus('图片 Markdown 已插入正文', false, true);
        input.value = '';
        return true;
    }

    [blogContent, mdSource].forEach(function(editor) {
        if (!editor) return;
        editor.addEventListener('paste', function(e) {
            var clipboard = e.clipboardData;
            if (!clipboard) return;
            var text = (clipboard.getData('text/plain') || '').trim();
            if (text) {
                var markdown = extractImageMarkdown(text);
                if (markdown) {
                    e.preventDefault();
                    insertTextAtCursor(editor, markdown);
                    updateBlogImageStatus('已将图床链接转成 Markdown 图片', false, true);
                    return;
                }
                var urlMatch = text.match(/^https?:\/\/[^\s]+$/i);
                if (urlMatch) {
                    e.preventDefault();
                    var altText = 'image';
                    insertTextAtCursor(editor, '![' + altText + '](' + urlMatch[0] + ')');
                    updateBlogImageStatus('已将 URL 转成 Markdown 图片', false, true);
                    return;
                }
            }
            var items = Array.from(clipboard.items || []);
            var hasBinaryImage = items.some(function(item) {
                return item.kind === 'file' && item.type.indexOf('image/') === 0;
            });
            if (hasBinaryImage && !text) {
                e.preventDefault();
                updateBlogImageStatus('检测到本地图片。请先上传到你的图床，再粘贴 Markdown 或 URL。', true);
                showToast('请先上传到图床，再粘贴链接', true);
            }
        });
    });

    insertBtn.addEventListener('click', function() {
        insertFromRaw(input.value, true);
    });
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            insertFromRaw(input.value, true);
        }
    });
    if (clearBtn) {
        clearBtn.addEventListener('click', clearBlogImageHelper);
    }
    clearBlogImageHelper();
}

// ===== Markdown 编辑器 =====
function initMdEditor() {
    var toggleBtn = document.getElementById('toggleMdEditor');
    var editor = document.getElementById('mdEditor');
    var source = document.getElementById('mdSource');
    var preview = document.getElementById('mdPreview');
    var blogContent = document.getElementById('blogContent');
    if (!toggleBtn || !editor || !source || !preview || !blogContent) return;
    var editorActive = false;
    function updatePreview() {
        try {
            preview.innerHTML = sanitizeMarkdown(source.value || '');
        } catch (e) {
            preview.innerHTML = '<p style="color:var(--text-secondary)">预览加载中...</p>';
        }
    }
    _mdEditorState = {
        source: source,
        updatePreview: updatePreview,
        isActive: function() { return editorActive; }
    };
    toggleBtn.addEventListener('click', function() {
        editorActive = !editorActive;
        if (editorActive) {
            editor.classList.add('active');
            blogContent.style.display = 'none';
            source.value = blogContent.value;
            updatePreview();
            toggleBtn.textContent = '切换为普通模式';
        } else {
            editor.classList.remove('active');
            blogContent.style.display = '';
            blogContent.value = source.value;
            toggleBtn.textContent = '切换编辑器模式';
        }
    });
    source.addEventListener('input', function() {
        blogContent.value = source.value;
        updatePreview();
    });
    updatePreview();
}

// ===== 快捷键系统 =====
function initShortcuts() {
    var helpBar = document.createElement('div');
    helpBar.id = 'shortcutHelp';
    helpBar.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:500;background:rgba(10,10,15,0.95);border-top:1px solid var(--border);padding:0.4rem 1rem;display:none;justify-content:center;gap:1.5rem;font-size:0.72rem;color:var(--text-secondary);backdrop-filter:blur(10px)';
    var helpItems = ['g+h 主页', 'g+b 博客', 'g+p 项目', 'g+t 工具', 'g+c 影视', 'g+k 搜索'];
    if (hasAdminPage()) helpItems.push('g+a 后台');
    helpItems.push('? 帮助');
    helpBar.innerHTML = helpItems.map(function(item) { return '<span>' + item + '</span>'; }).join('');
    document.body.appendChild(helpBar);
    var pendingG = false, gTimer = null;
    document.addEventListener('keydown', function(e) {
        var tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (document.getElementById('searchModal').classList.contains('open')) return;
        if (e.key === '?' && !e.ctrlKey && !e.metaKey) { e.preventDefault(); helpBar.style.display = helpBar.style.display === 'flex' ? 'none' : 'flex'; return; }
        if (e.key === 'g' && !e.ctrlKey && !e.metaKey) { pendingG = true; clearTimeout(gTimer); gTimer = setTimeout(function() { pendingG = false; }, 800); return; }
        if (pendingG) {
            pendingG = false; clearTimeout(gTimer); e.preventDefault();
            var map = { 'h': 'home', 'b': 'blog', 'p': 'projects', 't': 'tools', 'c': 'cinema', 'm': 'mood', 's': 'bookshelf' };
            if (hasAdminPage()) map.a = 'admin';
            if (map[e.key]) { router.navigate(map[e.key]); return; }
            if (e.key === 'k') { document.getElementById('navSearchBtn').click(); return; }
        }
        if (e.key >= '1' && e.key <= '8' && !e.ctrlKey && !e.metaKey) {
            var pages = ['home', 'blog', 'projects', 'tools', 'bookshelf', 'cinema', 'mood'];
            if (hasAdminPage()) pages.push('admin');
            var idx = parseInt(e.key) - 1;
            if (pages[idx]) { e.preventDefault(); router.navigate(pages[idx]); }
        }
    });
}

// ===== 自定义光标 =====
function initCustomCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    var cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    document.addEventListener('mousemove', function(e) { cursor.style.left = (e.clientX - 10) + 'px'; cursor.style.top = (e.clientY - 10) + 'px'; cursor.classList.add('active'); });
    document.addEventListener('mousedown', function() { cursor.classList.add('hover'); });
    document.addEventListener('mouseup', function() { cursor.classList.remove('hover'); });
}

// ===== 自定义 CSS 注入 =====
function initCustomCSS() {
    var textarea = document.getElementById('customCSS');
    var applyBtn = document.getElementById('applyCSS');
    var clearBtn = document.getElementById('clearCSS');
    var previewBtn = document.getElementById('previewCSS');
    var status = document.getElementById('cssStatus');
    if (!textarea || !applyBtn) return;
    var CSS_KEY = 'laozig_custom_css';
    var styleEl = document.getElementById('customCSSStyle');
    var saved = localStorage.getItem(CSS_KEY);
    if (saved) { textarea.value = saved; injectCSS(saved); }
    function injectCSS(css) { if (!styleEl) { styleEl = document.createElement('style'); styleEl.id = 'customCSSStyle'; document.head.appendChild(styleEl); } styleEl.textContent = css; }
    applyBtn.addEventListener('click', function() { localStorage.setItem(CSS_KEY, textarea.value); injectCSS(textarea.value); if (status) status.textContent = '✅ CSS 已应用并保存'; showToast(t('css_applied')); });
    clearBtn.addEventListener('click', function() { textarea.value = ''; localStorage.removeItem(CSS_KEY); if (styleEl) styleEl.textContent = ''; if (status) status.textContent = '🗑️ 已清除自定义 CSS'; showToast(t('css_cleared')); });
    previewBtn.addEventListener('click', function() { injectCSS(textarea.value); if (status) status.textContent = '👁️ 预览中（未保存）'; });
}

// ===== 动态 RSS 生成 =====
function generateRSS() {
    var data = loadData();
    var items = data.blogs.slice().reverse().slice(0, 20);
    var now = new Date().toUTCString();
    var siteOrigin = window.location.origin;
    var rss = '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>LAOZIG | 个人综合站</title>\n    <link>' + escapeXml(siteOrigin) + '</link>\n    <description>Security Researcher · Reverse Engineer · CTF Player</description>\n    <language>zh-CN</language>\n    <lastBuildDate>' + now + '</lastBuildDate>\n    <atom:link href="' + escapeXml(siteOrigin + '/rss.xml') + '" rel="self" type="application/rss+xml"/>';
    items.forEach(function(b) {
        var date = new Date(b.created).toUTCString();
        var desc = b.content.replace(/<[^>]*>/g, '').replace(/[#*`\[\]()!>_~\-|]/g, '').replace(/\s+/g, ' ').trim().slice(0, 200);
        rss += '\n    <item>\n      <title>' + escapeXml(b.title) + '</title>\n      <link>' + escapeXml(siteOrigin + '/blog/' + b.id) + '</link>\n      <description>' + escapeXml(desc) + '</description>\n      <pubDate>' + date + '</pubDate>\n      <guid>' + escapeXml(siteOrigin + '/blog/' + b.id) + '</guid>\n    </item>';
    });
    rss += '\n  </channel>\n</rss>';
    return rss;
}
function downloadRSS() {
    var rss = generateRSS();
    var blob = new Blob([rss], { type: 'application/xml' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'rss.xml'; a.click();
    URL.revokeObjectURL(url);
    showToast(t('rss_ok'));
}

// ===== GitHub 页面 =====
var _ghCache = null;
var _ghCacheTime = 0;
var _GH_CACHE_TTL = 5 * 60 * 1000;

function renderGitHub() {
    var data = loadData();
    var username = data.ghUsername;
    var profileEl = document.getElementById('ghProfile');
    var reposEl = document.getElementById('ghRepos');
    var statusEl = document.getElementById('ghStatus');
    if (!username) {
        profileEl.innerHTML = '<div class="card"><p style="text-align:center;color:var(--text-secondary);">在管理后台「关于我」中设置 GitHub 用户名后，此页面将自动拉取数据。</p></div>';
        reposEl.innerHTML = ''; statusEl.textContent = ''; return;
    }
    if (_ghCache && _ghCache.username === username && (Date.now() - _ghCacheTime) < _GH_CACHE_TTL) {
        profileEl.innerHTML = _ghCache.profileHtml;
        reposEl.innerHTML = _ghCache.reposHtml;
        statusEl.textContent = _ghCache.statusText;
        return;
    }
    statusEl.textContent = '加载中...';
    profileEl.innerHTML = '<div class="card"><p style="text-align:center;color:var(--text-secondary);">正在连接 GitHub API...</p></div>';
    fetch('https://api.github.com/users/' + username)
        .then(function(r) {
            if (r.status === 403) throw new Error('rate_limit');
            return r.json();
        })
        .then(function(user) {
            profileEl.innerHTML = '<img class="gh-avatar" src="' + escapeHtml(safeUrl(user.avatar_url)) + '" alt="' + escapeHtml(user.login) + '" /><div class="gh-info"><h3>' + escapeHtml(user.name || user.login) + '</h3><p>' + escapeHtml(user.bio || '') + '</p><div class="gh-stats"><div class="gh-stat"><span class="gh-stat-num">' + user.public_repos + '</span><span class="gh-stat-label">Repos</span></div><div class="gh-stat"><span class="gh-stat-num">' + user.followers + '</span><span class="gh-stat-label">Followers</span></div><div class="gh-stat"><span class="gh-stat-num">' + user.following + '</span><span class="gh-stat-label">Following</span></div></div></div>';
            statusEl.textContent = '@' + user.login;
        })
        .catch(function(e) {
            if (e.message === 'rate_limit') {
                profileEl.innerHTML = '<div class="card"><p style="color:var(--pink);">GitHub API 请求频率超限，请稍后再试。</p></div>';
            } else {
                profileEl.innerHTML = '<div class="card"><p style="color:var(--pink);">GitHub API 请求失败，请检查用户名或网络。</p></div>';
            }
            statusEl.textContent = '连接失败';
        });
    fetch('https://api.github.com/users/' + username + '/repos?sort=updated&per_page=30')
        .then(function(r) {
            if (r.status === 403) throw new Error('rate_limit');
            return r.json();
        })
        .then(function(repos) {
            if (!Array.isArray(repos) || repos.length === 0) { reposEl.innerHTML = '<div class="card"><p style="text-align:center;color:var(--text-secondary);">暂无公开仓库</p></div>'; return; }
            reposEl.innerHTML = repos.map(function(repo) {
                var repoUrl = safeUrl(repo.html_url);
                return '<div class="gh-repo"><h4>' + (repoUrl ? '<a href="' + escapeHtml(repoUrl) + '" target="_blank" rel="noopener">' + escapeHtml(repo.name) + '</a>' : escapeHtml(repo.name)) + '</h4><p>' + escapeHtml(repo.description || '暂无描述') + '</p><div class="gh-repo-meta">' + (repo.language ? '<span class="gh-repo-lang">● ' + escapeHtml(repo.language) + '</span>' : '') + '<span class="gh-repo-stars">★ ' + repo.stargazers_count + '</span><span>Fork: ' + repo.forks_count + '</span><span>' + timeAgo(new Date(repo.updated_at).getTime()) + '</span></div></div>';
            }).join('');
            _ghCache = { username: username, profileHtml: profileEl.innerHTML, reposHtml: reposEl.innerHTML, statusText: statusEl.textContent };
            _ghCacheTime = Date.now();
        })
        .catch(function(e) {
            if (e.message === 'rate_limit') {
                reposEl.innerHTML = '<div class="card"><p style="color:var(--pink);">GitHub API 请求频率超限，请稍后再试。</p></div>';
            } else {
                reposEl.innerHTML = '<div class="card"><p style="color:var(--pink);">仓库列表加载失败</p></div>';
            }
        });
}

// ===== 主题 =====
function applyTheme(theme) {
    if (theme === 'default') { document.documentElement.removeAttribute('data-theme'); }
    else { document.documentElement.setAttribute('data-theme', theme); }
}

// ===== 实时时钟 =====
function updateClock() {
    var now = new Date();
    var pad = function(n) { return String(n).padStart(2, '0'); };
    document.getElementById('navClock').textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
}

// ===== 运行时间 =====
var startTime = Date.now();
function updateUptime() {
    var diff = Math.floor((Date.now() - startTime) / 1000);
    var h = Math.floor(diff / 3600), m = Math.floor((diff % 3600) / 60), s = diff % 60;
    var text = '运行 ';
    if (h > 0) text += h + 'h ';
    if (m > 0 || h > 0) text += m + 'm ';
    text += s + 's';
    document.getElementById('uptimeCounter').textContent = text;
}

// ===== 初始化 =====
var router;

document.addEventListener('DOMContentLoaded', function() {
    // 访客追踪
    trackVisitor();

    // 粒子
    var canvas = document.getElementById('particleCanvas');
    if (canvas) new ParticleNetwork(canvas);

    // 路由
    router = new Router();

    // 从服务端加载数据（所有人共享）
    loadFromServer().then(function(serverData) {
        var data = serverData || loadData();
        applyTheme(data.theme || 'default');
        applyLang();
        if (isAdminEntry() && hasAdminPage()) {
            router.navigate('admin');
        } else if (!openBlogFromLocation()) {
            renderHome();
        }
    });

    // 导航滚动
    var navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
        document.getElementById('backToTop').classList.toggle('show', window.scrollY > 300);
    });

    // 移动端菜单
    document.getElementById('navToggle').addEventListener('click', function() {
        document.querySelector('.nav-links').classList.toggle('open');
    });

    // 回到顶部
    document.getElementById('backToTop').addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 博客返回按钮
    document.getElementById('blogBack').addEventListener('click', function() { router.navigate('blog'); });

    // 初始化各模块
    initTerminal();
    initSearch();
    initDanmaku();
    initReadingProgress();
    initMdEditor();
    initBlogImageHelper();
    initShortcuts();
    initCustomCSS();
    initAdminAuth();
    var langBtn = document.getElementById('navLangBtn');
    if (langBtn) langBtn.addEventListener('click', toggleLang);
    initCustomCursor();
    initTypingEffect();

    // 实时时钟
    updateClock();
    setInterval(updateClock, 1000);
    setInterval(updateUptime, 1000);

    if (hasAdminPage()) {
    // ===== 后台事件绑定 =====
    // 保存关于我
    document.getElementById('saveAbout').addEventListener('click', function() {
        if (!requireAdminAccess()) return;
        var data = loadData();
        data.about = document.getElementById('editAbout').value;
        data.subtitle = document.getElementById('editSubtitle').value;
        var tagsRaw = document.getElementById('editTags').value;
        data.tags = tagsRaw ? tagsRaw.split(/[,，]/).map(function(s) { return s.trim(); }).filter(Boolean) : [];
        data.ghUsername = (document.getElementById('editGH').value || '').trim();
        saveData(data);
        showToast(t('saved'));
        renderHome();
    });

    // 保存草稿
    document.getElementById('saveDraft').addEventListener('click', function() {
        if (!requireAdminAccess()) return;
        var title = document.getElementById('blogTitle').value.trim();
        var content = document.getElementById('blogContent').value.trim();
        var tagsRaw = document.getElementById('blogTags').value.trim();
        var category = document.getElementById('blogCategory').value.trim();
        if (!title && !content) { showToast(t('empty_warning'), true); return; }
        var data = loadData();
        if (!data.drafts) data.drafts = [];
        data.drafts.push({ id: genId(), title: title || '无标题', content: content, category: category, tags: tagsRaw ? tagsRaw.split(/[,，]/).map(function(s) { return s.trim(); }).filter(Boolean) : [], created: Date.now() });
        saveData(data);
        resetBlogForm();
        showToast(t('draft_saved'));
        renderAdminLists();
    });

    // 添加/更新博客
    document.getElementById('addBlog').addEventListener('click', function() {
        if (!requireAdminAccess()) return;
        var editId = document.getElementById('blogEditId').value;
        var title = document.getElementById('blogTitle').value.trim();
        var content = document.getElementById('blogContent').value.trim();
        var tagsRaw = document.getElementById('blogTags').value.trim();
        var category = document.getElementById('blogCategory').value.trim();
        if (!title || !content) { showToast(t('empty_warning'), true); return; }
        var data = loadData();
        var tags = tagsRaw ? tagsRaw.split(/[,，]/).map(function(s) { return s.trim(); }).filter(Boolean) : [];
        if (editId) {
            var blog = data.blogs.find(function(b) { return b.id === editId; });
            if (blog) { blog.title = title; blog.slug = blog.slug || getUniqueBlogSlug(title, data.blogs, editId); blog.content = content; blog.category = category; blog.tags = tags; }
            delete _mdCache['blog:' + editId];
            showToast(t('blog_updated'));
        } else {
            data.blogs.push({ id: genId(), slug: getUniqueBlogSlug(title, data.blogs), title: title, content: content, category: category, tags: tags, created: Date.now() });
            showToast(t('blog_published'));
        }
        saveData(data);
        resetBlogForm();
        renderAdminLists();
    });

    // 取消编辑
    document.getElementById('cancelEdit').addEventListener('click', resetBlogForm);

    // 添加/更新项目
    document.getElementById('addProject').addEventListener('click', function() {
        if (!requireAdminAccess()) return;
        var editId = document.getElementById('projEditId').value;
        var name = document.getElementById('projName').value.trim();
        var desc = document.getElementById('projDesc').value.trim();
        var url = document.getElementById('projUrl').value.trim();
        var tagsRaw = document.getElementById('projTags').value.trim();
        var stars = document.getElementById('projStars').value.trim();
        if (!name) { showToast('项目名称不能为空', true); return; }
        var data = loadData();
        var tags = tagsRaw ? tagsRaw.split(/[,，]/).map(function(s) { return s.trim(); }).filter(Boolean) : [];
        if (editId) {
            var p = data.projects.find(function(proj) { return proj.id === editId; });
            if (p) { p.name = name; p.desc = desc; p.url = url; p.tags = tags; p.stars = stars ? parseInt(stars) : 0; }
            showToast(t('project_updated'));
        } else {
            data.projects.push({ id: genId(), name: name, desc: desc, url: url, tags: tags, stars: stars ? parseInt(stars) : 0, created: Date.now() });
            showToast(t('project_added'));
        }
        saveData(data);
        resetProjForm();
        renderAdminLists();
    });
    document.getElementById('cancelProjEdit').addEventListener('click', resetProjForm);

    // 添加/更新工具
    document.getElementById('addTool').addEventListener('click', function() {
        if (!requireAdminAccess()) return;
        var editId = document.getElementById('toolEditId').value;
        var name = document.getElementById('toolName').value.trim();
        var desc = document.getElementById('toolDesc').value.trim();
        var url = document.getElementById('toolUrl').value.trim();
        var category = document.getElementById('toolCategory').value.trim();
        if (!name) { showToast('工具名称不能为空', true); return; }
        var data = loadData();
        if (editId) {
            var tool = data.tools.find(function(t) { return t.id === editId; });
            if (tool) { tool.name = name; tool.desc = desc; tool.url = url; tool.category = category; }
            showToast(t('tool_updated'));
        } else {
            data.tools.push({ id: genId(), name: name, desc: desc, url: url, category: category, created: Date.now() });
            showToast(t('tool_added'));
        }
        saveData(data);
        resetToolForm();
        renderAdminLists();
    });
    document.getElementById('cancelToolEdit').addEventListener('click', resetToolForm);

    // 添加/更新影视
    document.getElementById('addMovie').addEventListener('click', function() {
        if (!requireAdminAccess()) return;
        var editId = document.getElementById('movieEditId').value;
        var title = document.getElementById('movieTitle').value.trim();
        var director = document.getElementById('movieDirector').value.trim();
        var cast = document.getElementById('movieCast').value.trim();
        var url = document.getElementById('movieUrl').value.trim();
        var type = document.getElementById('movieType').value;
        var status = document.getElementById('movieStatus').value;
        var rating = document.getElementById('movieRating').value;
        var note = document.getElementById('movieNote').value.trim();
        if (!title) { showToast('影片名称不能为空', true); return; }
        var data = loadData();
        if (!data.movies) data.movies = [];
        if (editId) {
            var m = data.movies.find(function(movie) { return movie.id === editId; });
            if (m) { m.title = title; m.director = director; m.cast = cast; m.url = url; m.type = type; m.status = status; m.rating = rating ? parseInt(rating) : 0; m.note = note; }
            showToast(t('movie_updated'));
        } else {
            data.movies.push({ id: genId(), title: title, director: director, cast: cast, url: url, type: type, status: status, rating: rating ? parseInt(rating) : 0, note: note, created: Date.now() });
            showToast(t('movie_added'));
        }
        saveData(data);
        resetMovieForm();
        renderAdminLists();
    });
    document.getElementById('cancelMovieEdit').addEventListener('click', resetMovieForm);

    // 添加/更新书籍
    document.getElementById('addBook').addEventListener('click', function() {
        if (!requireAdminAccess()) return;
        var editId = document.getElementById('bookEditId').value;
        var title = document.getElementById('bookTitle').value.trim();
        var author = document.getElementById('bookAuthor').value.trim();
        var status = document.getElementById('bookStatus').value;
        var rating = document.getElementById('bookRating').value;
        var note = document.getElementById('bookNote').value.trim();
        if (!title) { showToast('书名不能为空', true); return; }
        var data = loadData();
        if (editId) {
            var book = data.books.find(function(b) { return b.id === editId; });
            if (book) { book.title = title; book.author = author; book.status = status; book.rating = rating ? parseInt(rating) : 0; book.note = note; }
            showToast(t('book_updated'));
        } else {
            data.books.push({ id: genId(), title: title, author: author, status: status, rating: rating ? parseInt(rating) : 0, note: note, created: Date.now() });
            showToast(t('book_added'));
        }
        saveData(data);
        resetBookForm();
        renderAdminLists();
    });
    document.getElementById('cancelBookEdit').addEventListener('click', resetBookForm);

    // 添加/更新碎碎念
    document.getElementById('addMood').addEventListener('click', function() {
        if (!requireAdminAccess()) return;
        var editId = document.getElementById('moodEditId').value;
        var text = document.getElementById('moodText').value.trim();
        var emoji = document.getElementById('moodEmoji').value;
        if (!text) { showToast('内容不能为空', true); return; }
        var data = loadData();
        if (editId) {
            var m = data.moods.find(function(mood) { return mood.id === editId; });
            if (m) { m.text = text; m.emoji = emoji; }
            showToast(t('mood_updated'));
        } else {
            data.moods.push({ id: genId(), text: text, emoji: emoji, created: Date.now() });
            showToast(t('mood_published'));
        }
        saveData(data);
        resetMoodForm();
        renderAdminLists();
    });
    document.getElementById('cancelMoodEdit').addEventListener('click', resetMoodForm);

    // 添加/更新技能
    document.getElementById('addSkill').addEventListener('click', function() {
        if (!requireAdminAccess()) return;
        var editName = document.getElementById('skillEditName').value;
        var name = document.getElementById('skillName').value.trim();
        var level = parseInt(document.getElementById('skillLevel').value);
        var color = document.getElementById('skillColor').value;
        if (!name || isNaN(level)) { showToast('请填写技能名称和熟练度', true); return; }
        var data = loadData();
        if (!data.skills) data.skills = [];
        if (editName) {
            var s = data.skills.find(function(sk) { return sk.name === editName; });
            if (s) { s.name = name; s.level = Math.min(100, Math.max(0, level)); s.color = color; }
            showToast(t('skill_updated'));
        } else {
            data.skills.push({ name: name, level: Math.min(100, Math.max(0, level)), color: color });
            showToast(t('skill_added'));
        }
        saveData(data);
        resetSkillForm();
        renderAdminLists();
    });
    document.getElementById('cancelSkillEdit').addEventListener('click', resetSkillForm);

    // 后台标签切换
    document.querySelectorAll('.admin-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.admin-tab').forEach(function(t) { t.classList.remove('active'); });
            document.querySelectorAll('.admin-panel').forEach(function(p) { p.classList.remove('active'); });
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // 主题切换
    document.querySelectorAll('.theme-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (!requireAdminAccess()) return;
            var theme = btn.dataset.theme;
            var data = loadData();
            data.theme = theme;
            saveData(data);
            applyTheme(theme);
            document.querySelectorAll('.theme-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            showToast(t('theme_changed'));
        });
    });

    // 数据导出
    document.getElementById('exportData').addEventListener('click', function() {
        var data = loadData();
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'laozig-data-' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();
        URL.revokeObjectURL(url);
        showToast(t('export_ok'));
    });

    // 数据导入
    document.getElementById('importBtn').addEventListener('click', function() { document.getElementById('importFile').click(); });
    document.getElementById('importFile').addEventListener('change', function(e) {
        if (!requireAdminAccess()) { e.target.value = ''; return; }
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
            try {
                var imported = JSON.parse(ev.target.result);
                if (imported.blogs || imported.projects || imported.tools || imported.moods || imported.about) {
                    saveData(imported);
                    showToast(t('import_ok'));
                    document.getElementById('importStatus').textContent = '✅ 已导入 ' + (imported.blogs || []).length + ' 篇博客、' + (imported.projects || []).length + ' 个项目、' + (imported.tools || []).length + ' 个工具、' + (imported.moods || []).length + ' 条动态';
                    renderHome();
                    renderAdmin();
                } else { showToast('无效的数据格式', true); }
            } catch (err) { showToast('文件解析失败: ' + err.message, true); }
        };
        reader.readAsText(file);
        e.target.value = '';
    });

    // RSS 导出
    document.getElementById('exportRSS').addEventListener('click', downloadRSS);

    // 清空数据（使用 cloneNode 清除旧监听器）
    var clearBtn = document.getElementById('clearData');
    if (clearBtn) {
        var clearReplacement = clearBtn.cloneNode(true);
        clearBtn.parentNode.replaceChild(clearReplacement, clearBtn);
        clearReplacement.addEventListener('click', function() {
            if (!requireAdminAccess()) return;
            if (!confirm(t('clear_confirm'))) return;
            var previousData = loadData();
            var resetData = cloneData(defaultData);
            saveData(resetData).then(function(result) {
                if (!result || !result.ok) {
                    _serverData = withDefaultData(previousData);
                    _serverDataReady = true;
                    savePublicCache(previousData);
                    showToast('清空失败，请检查服务端状态后重试', true);
                    renderHome();
                    renderAdmin();
                    return;
                }
                document.getElementById('importStatus').textContent = '';
                renderHome();
                renderAdmin();
                showToast(t('clear_ok'));
            });
        });
    }

    // 管理页面认证与数据恢复
    if (hasAdminPage() && hasAdminKey() && !hasAdminAccess()) {
        updateAdminAuthStatus('正在验证管理密钥...', false);
        loadAdminDataFromServer().then(function() {
            renderHome();
            renderAdmin();
        }).catch(function() {});
    }

    waitForInitialData(5000).then(openBlogFromLocation);
    window.addEventListener('hashchange', openBlogFromLocation);

    }

    // 辅助功能模块初始化
    initCodeCopyButtons();
    initPWAInstall();
    initOfflineDetection();
    initMobileNav();
    initLazyImages();
    initTerminalTabComplete();
    initGestureNavigation();
    initTocHighlight();
    initSearchKeyNav();
    initRandomBlog();
    // 数字动画延迟执行
    setTimeout(animateNumbers, 1600);

    // 注册 Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(function() {});
    }
});

function initAdminAuth() {
    if (!hasAdminPage()) return;
    var form = document.getElementById('adminAuthForm');
    var input = document.getElementById('adminKeyInput');
    var authBtn = document.getElementById('adminAuthBtn');
    var logoutBtn = document.getElementById('adminLogoutBtn');
    syncAdminKeyInput();
    updateAdminAuthStatus();
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            var key = input ? input.value.trim() : '';
            if (!key) {
                updateAdminAuthStatus('请输入管理密钥', true);
                showToast('请输入管理密钥', true);
                return;
            }
            persistAdminKey(key);
            updateAdminAuthStatus('正在验证管理密钥...', false);
            loadAdminDataFromServer().then(function(data) {
                _serverData = data;
                renderHome();
                renderAdmin();
                showToast('管理认证成功');
            }).catch(function(e) {
                if (e.message !== 'Unauthorized') {
                    updateAdminAuthStatus('认证失败，请检查管理密钥', true);
                    showToast('认证失败，请检查管理密钥', true);
                }
            });
        });
    } else if (authBtn) {
        authBtn.addEventListener('click', function() {
            if (form) return;
            var key = input ? input.value.trim() : '';
            if (!key) {
                updateAdminAuthStatus('请输入管理密钥', true);
                showToast('请输入管理密钥', true);
                return;
            }
            persistAdminKey(key);
            updateAdminAuthStatus('正在验证管理密钥...', false);
            loadAdminDataFromServer().then(function(data) {
                _serverData = data;
                renderHome();
                renderAdmin();
                showToast('管理认证成功');
            }).catch(function(e) {
                if (e.message !== 'Unauthorized') {
                    updateAdminAuthStatus('认证失败，请检查管理密钥', true);
                    showToast('认证失败，请检查管理密钥', true);
                }
            });
        });
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            persistAdminKey('');
            updateAdminAuthStatus('已断开管理认证', false);
            loadFromServer().then(function() {
                renderHome();
                renderAdmin();
                showToast('已断开管理认证');
            });
        });
    }
    if (hasAdminAccess()) {
        loadAdminDataFromServer().then(function() {
            renderHome();
            renderAdmin();
        }).catch(function() {});
    }
}

// ===== 新增功能模块 =====

// 代码复制按钮
function initCodeCopyButtons() {
    var observer = new MutationObserver(function() {
        document.querySelectorAll('.blog-content pre').forEach(function(pre) {
            if (pre.querySelector('.code-copy-btn')) return;
            var btn = document.createElement('button');
            btn.className = 'code-copy-btn';
            btn.textContent = '复制';
            btn.addEventListener('click', function() {
                var code = pre.querySelector('code');
                var text = code ? code.textContent : pre.textContent;
                navigator.clipboard.writeText(text).then(function() {
                    btn.textContent = '已复制 ✓';
                    btn.classList.add('copied');
                    setTimeout(function() { btn.textContent = '复制'; btn.classList.remove('copied'); }, 2000);
                });
            });
            pre.style.position = 'relative';
            pre.appendChild(btn);
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// 博客分页
var blogCurrentPage = 1;
var BLOG_PAGE_SIZE = 8;

function renderBlogListPaginated(filter) {
    filter = filter || 'all';
    var data = loadData();
    var blogs = data.blogs.slice().reverse();
    var categories = [...new Set(data.blogs.map(b => b.category).filter(Boolean))];
    var filterBar = document.getElementById('blogFilter');
    filterBar.innerHTML = '<button class="filter-btn ' + (filter === 'all' ? 'active' : '') + '" data-filter="all">全部</button>' +
        categories.map(c => '<button class="filter-btn ' + (filter === c ? 'active' : '') + '" data-filter="' + escapeHtml(c) + '">' + escapeHtml(c) + '</button>').join('');
    filterBar.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() { blogCurrentPage = 1; renderBlogListPaginated(btn.dataset.filter); });
    });

    // 标签云
    renderTagCloud(data);

    // 存储警告
    checkStorageUsage();

    var filtered = filter === 'all' ? blogs : blogs.filter(b => b.category === filter);
    document.getElementById('blogCount').textContent = '共 ' + filtered.length + ' 篇';

    if (filtered.length === 0) {
        document.getElementById('blogList').innerHTML = '<div class="card"><p style="text-align:center;color:var(--text-secondary);">暂无博客</p></div>';
        document.getElementById('blogPagination').innerHTML = '';
        return;
    }

    var totalPages = Math.ceil(filtered.length / BLOG_PAGE_SIZE);
    if (blogCurrentPage > totalPages) blogCurrentPage = totalPages;
    var start = (blogCurrentPage - 1) * BLOG_PAGE_SIZE;
    var pageItems = filtered.slice(start, start + BLOG_PAGE_SIZE);

    var list = document.getElementById('blogList');
    list.innerHTML = pageItems.map(function(b) {
        return '<div class="blog-item ripple-effect" data-id="' + b.id + '"><div class="blog-item-title">' + escapeHtml(b.title) + '</div><div class="blog-item-meta"><span>' + formatTime(b.created) + '</span>' + (b.category ? '<span class="blog-item-category">' + escapeHtml(b.category) + '</span>' : '') + (b.tags && b.tags.length ? '<div class="blog-item-tags">' + b.tags.map(tag => '<span>' + escapeHtml(tag) + '</span>').join('') + '</div>' : '') + '</div></div>';
    }).join('');
    list.querySelectorAll('.blog-item').forEach(function(item) {
        item.addEventListener('click', function() { showBlogDetail(item.dataset.id); });
    });

    // 分页控件
    var pagination = document.getElementById('blogPagination');
    if (totalPages <= 1) { pagination.innerHTML = ''; return; }
    var html = '';
    for (var i = 1; i <= totalPages; i++) {
        html += '<button class="page-btn ' + (i === blogCurrentPage ? 'active' : '') + '" data-page="' + i + '">' + i + '</button>';
    }
    pagination.innerHTML = html;
    pagination.querySelectorAll('.page-btn').forEach(function(btn) {
        btn.addEventListener('click', function() { blogCurrentPage = parseInt(btn.dataset.page); renderBlogListPaginated(filter); });
    });
}

// 标签云
function renderTagCloud(data) {
    var tagCloud = document.getElementById('tagCloud');
    if (!tagCloud) return;
    var allTags = {};
    data.blogs.forEach(function(b) {
        (b.tags || []).forEach(function(t) {
            allTags[t] = (allTags[t] || 0) + 1;
        });
    });
    var entries = Object.entries(allTags).sort(function(a, b) { return b[1] - a[1]; });
    if (entries.length === 0) { tagCloud.innerHTML = ''; return; }
    var maxCount = entries[0][1];
    tagCloud.innerHTML = entries.map(function(e) {
        var size = e[1] >= maxCount * 0.7 ? 'size-lg' : (e[1] >= maxCount * 0.3 ? 'size-md' : 'size-sm');
        return '<span class="tag-cloud-item ' + size + '" data-tag="' + escapeHtml(e[0]) + '">' + escapeHtml(e[0]) + ' (' + e[1] + ')</span>';
    }).join('');
    tagCloud.querySelectorAll('.tag-cloud-item').forEach(function(item) {
        item.addEventListener('click', function() {
            var tag = item.dataset.tag;
            blogCurrentPage = 1;
            renderBlogListByTag(tag);
        });
    });
}

function renderBlogListByTag(tag) {
    var data = loadData();
    var blogs = data.blogs.slice().reverse().filter(function(b) { return (b.tags || []).indexOf(tag) !== -1; });
    var filtered = blogs;
    document.getElementById('blogCount').textContent = '共 ' + filtered.length + ' 篇 (标签: ' + tag + ')';
    document.getElementById('blogFilter').innerHTML = '<button class="filter-btn" id="clearTagFilterBtn">← 清除标签筛选</button><button class="filter-btn active">' + escapeHtml(tag) + '</button>';
    var clearBtn = document.getElementById('clearTagFilterBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            blogCurrentPage = 1;
            renderBlogListPaginated('all');
        });
    }
    var list = document.getElementById('blogList');
    list.innerHTML = filtered.map(function(b) {
        return '<div class="blog-item ripple-effect" data-id="' + b.id + '"><div class="blog-item-title">' + escapeHtml(b.title) + '</div><div class="blog-item-meta"><span>' + formatTime(b.created) + '</span>' + (b.category ? '<span class="blog-item-category">' + escapeHtml(b.category) + '</span>' : '') + (b.tags && b.tags.length ? '<div class="blog-item-tags">' + b.tags.map(t => '<span>' + escapeHtml(t) + '</span>').join('') + '</div>' : '') + '</div></div>';
    }).join('');
    list.querySelectorAll('.blog-item').forEach(function(item) { item.addEventListener('click', function() { showBlogDetail(item.dataset.id); }); });
    document.getElementById('blogPagination').innerHTML = '';
}

// localStorage 容量监控
function checkStorageUsage() {
    var warning = document.getElementById('storageWarning');
    if (!warning) return;
    try {
        var total = 0;
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            total += (localStorage.getItem(key) || '').length * 2; // UTF-16
        }
        var usedPercent = Math.round((total / (5 * 1024 * 1024)) * 100);
        // Dashboard storage
        var dashStorage = document.getElementById('dashStorage');
        if (dashStorage) dashStorage.textContent = usedPercent + '%';
        if (usedPercent > 80) {
            warning.classList.add('show');
            warning.textContent = '⚠️ localStorage 已使用 ' + usedPercent + '%，请及时导出数据备份！';
        } else {
            warning.classList.remove('show');
        }
    } catch (e) { warning.classList.remove('show'); }
}

// PWA 安装提示
var deferredPrompt = null;
function initPWAInstall() {
    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        deferredPrompt = e;
        var banner = document.getElementById('pwaInstallBanner');
        if (banner) {
            setTimeout(function() { banner.classList.add('show'); }, 3000);
        }
    });
    var installBtn = document.getElementById('pwaInstallBtn');
    var dismissBtn = document.getElementById('pwaDismissBtn');
    if (installBtn) {
        installBtn.addEventListener('click', function() {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(function() { deferredPrompt = null; });
            }
            document.getElementById('pwaInstallBanner').classList.remove('show');
        });
    }
    if (dismissBtn) {
        dismissBtn.addEventListener('click', function() {
            document.getElementById('pwaInstallBanner').classList.remove('show');
        });
    }
}

// 离线检测
function initOfflineDetection() {
    var toast = document.getElementById('offlineToast');
    if (!toast) return;
    function update() {
        if (!navigator.onLine) { toast.classList.add('show'); }
        else { toast.classList.remove('show'); }
    }
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    update();
}

// 底部移动端导航
function initMobileNav() {
    var nav = document.getElementById('mobileNav');
    if (!nav) return;
    nav.querySelectorAll('.mobile-nav-item').forEach(function(item) {
        item.addEventListener('click', function() {
            var page = item.dataset.page;
            if (page) {
                router.navigate(page);
                nav.querySelectorAll('.mobile-nav-item').forEach(function(i) { i.classList.remove('active'); });
                item.classList.add('active');
            }
        });
    });
}

// 数字滚动动画
function animateNumbers() {
    document.querySelectorAll('.stat-num').forEach(function(el) {
        var target = parseInt(el.textContent) || 0;
        if (target === 0) return;
        el.textContent = '0';
        var duration = 800;
        var start = 0;
        var startTime = performance.now();
        function step(time) {
            var progress = Math.min((time - startTime) / duration, 1);
            el.textContent = Math.floor(progress * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }
        requestAnimationFrame(step);
    });
}

// 图片懒加载
function initLazyImages() {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    document.querySelectorAll('img[data-src]').forEach(function(img) { observer.observe(img); });
    // Also handle dynamically added images
    var mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
            m.addedNodes.forEach(function(node) {
                if (node.querySelectorAll) {
                    node.querySelectorAll('img[data-src]').forEach(function(img) { observer.observe(img); });
                }
            });
        });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
}

// 手势导航（移动端左右滑动切换页面）
function initGestureNavigation() {
    var touchStartX = 0, touchStartY = 0;
    var container = document.getElementById('app');
    if (!container) return;
    var pages = ['home', 'blog', 'projects', 'tools', 'bookshelf', 'cinema', 'mood'];
    if (hasAdminPage()) pages.push('admin');
    container.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    container.addEventListener('touchend', function(e) {
        var diffX = e.changedTouches[0].screenX - touchStartX;
        var diffY = e.changedTouches[0].screenY - touchStartY;
        if (Math.abs(diffX) < 80 || Math.abs(diffX) < Math.abs(diffY)) return;
        var idx = pages.indexOf(router ? router.currentPage : 'home');
        if (idx === -1) return;
        if (diffX > 0 && idx > 0) router.navigate(pages[idx - 1]);
        else if (diffX < 0 && idx < pages.length - 1) router.navigate(pages[idx + 1]);
    }, { passive: true });
}

// 终端 Tab 补全
function initTerminalTabComplete() {
    var input = document.getElementById('terminalInput');
    if (!input) return;
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            var partial = input.value.trim().toLowerCase();
            if (!partial) return;
            var allCmds = Object.keys(terminalCommands).concat(['history', 'sudo', 'rm -rf', 'hack', 'coffee', 'hello', 'exit', 'pwd', 'cat flag', 'ls -la', 'neofetch', 'ping']);
            var matches = allCmds.filter(function(c) { return c.startsWith(partial); });
            if (matches.length === 1) {
                input.value = matches[0];
            } else if (matches.length > 1) {
                var body = document.getElementById('terminalBody');
                body.innerHTML += '<div class="t-line output">' + matches.join('  ') + '</div>';
                body.scrollTop = body.scrollHeight;
            }
        }
    });
}

// 相关文章推荐
function renderRelatedPosts(blog) {
    var container = document.getElementById('relatedPostsGrid');
    if (!container) return;
    var data = loadData();
    var related = data.blogs.filter(function(b) {
        if (b.id === blog.id) return false;
        // 相同分类优先
        if (blog.category && b.category === blog.category) return true;
        // 有共同标签
        var commonTags = (blog.tags || []).filter(function(t) { return (b.tags || []).indexOf(t) !== -1; });
        return commonTags.length > 0;
    }).slice(0, 4);
    // 如果不够，补充最新博客
    if (related.length < 3) {
        var extra = data.blogs.filter(function(b) { return b.id !== blog.id && related.indexOf(b) === -1; }).slice(0, 3 - related.length);
        related = related.concat(extra);
    }
    if (related.length === 0) {
        document.getElementById('relatedPosts').style.display = 'none';
        return;
    }
    document.getElementById('relatedPosts').style.display = '';
    container.innerHTML = related.map(function(b) {
        return '<div class="related-post-item" data-blog-id="' + encodeURIComponent(b.id) + '">' + (b.category ? '<div class="related-post-cat">' + escapeHtml(b.category) + '</div>' : '') + '<div>' + escapeHtml(b.title) + '</div></div>';
    }).join('');
    container.querySelectorAll('.related-post-item').forEach(function(item) {
        item.addEventListener('click', function() {
            showBlogDetail(decodeURIComponent(item.getAttribute('data-blog-id') || ''));
        });
    });
}

// TOC 滚动高亮
function initTocHighlight() {
    window.addEventListener('scroll', function() {
        var tocLinks = document.querySelectorAll('.toc-list a');
        if (tocLinks.length === 0) return;
        var headings = document.querySelectorAll('.blog-content h2, .blog-content h3');
        if (headings.length === 0) return;
        var current = null;
        headings.forEach(function(h) {
            var rect = h.getBoundingClientRect();
            if (rect.top <= 120) current = h.id;
        });
        tocLinks.forEach(function(link) {
            link.classList.toggle('toc-active', link.getAttribute('href') === '#' + current);
        });
    });
}

// 搜索键盘导航
function initSearchKeyNav() {
    var searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    var focusedIdx = -1;
    searchInput.addEventListener('keydown', function(e) {
        var items = document.querySelectorAll('.search-result-item');
        if (items.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            focusedIdx = Math.min(focusedIdx + 1, items.length - 1);
            items.forEach(function(item, i) { item.classList.toggle('kb-focused', i === focusedIdx); });
            items[focusedIdx].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            focusedIdx = Math.max(focusedIdx - 1, 0);
            items.forEach(function(item, i) { item.classList.toggle('kb-focused', i === focusedIdx); });
            items[focusedIdx].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter' && focusedIdx >= 0) {
            e.preventDefault();
            items[focusedIdx].click();
        }
    });
    // Reset focus when input changes
    searchInput.addEventListener('input', function() { focusedIdx = -1; });
}

// 随机博客
function initRandomBlog() {
    var btn = document.getElementById('randomBlogBtn');
    if (!btn) return;
    function toggleBtn() {
        var data = loadData();
        btn.classList.toggle('show', data.blogs.length > 1);
    }
    btn.addEventListener('click', function() {
        var data = loadData();
        if (data.blogs.length === 0) return;
        var random = data.blogs[Math.floor(Math.random() * data.blogs.length)];
        showBlogDetail(random.id);
    });
    toggleBtn();
    // Re-check when navigating
    var origOnPageChange = router.onPageChange.bind(router);
    router.onPageChange = function(page) {
        origOnPageChange(page);
        toggleBtn();
    };
}

// 博客阅读时间徽章（在列表中显示）
function getReadTimeBadge(content) {
    var plainText = (content || '').replace(/<[^>]*>/g, '').replace(/[#*`\[\]()!>_~\-|]/g, '');
    var charCount = plainText.length;
    var mins = Math.max(1, Math.ceil(charCount / 500));
    return '<span class="blog-read-time">' + mins + ' min</span>';
}

// 覆盖默认 renderBlogList 为分页版本
var _originalRenderBlogList = renderBlogList;
renderBlogList = renderBlogListPaginated;

// ===== 初始化新模块 =====
// (已合并到上方 DOMContentLoaded 块中)

// 暴露全局函数
if (hasAdminPage()) {
window.deleteBlog = deleteBlog;
window.deleteProject = deleteProject;
window.deleteTool = deleteTool;
window.deleteBook = deleteBook;
window.deleteMood = deleteMood;
window.deleteSkill = deleteSkill;
window.deleteMovie = deleteMovie;
window.editBlog = editBlog;
window.editProject = editProject;
window.editTool = editTool;
window.editMovie = editMovie;
window.editBook = editBook;
window.editMood = editMood;
window.editSkill = editSkill;
window.editDraft = editDraft;
window.publishDraft = publishDraft;
window.deleteDraft = deleteDraft;
}
window.renderBlogListPaginated = renderBlogListPaginated;
window.renderBlogListByTag = renderBlogListByTag;
window.blogCurrentPage = 1;

// ===== Security and routing fixes =====
function cloneData(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
}

function withDefaultData(data) {
    var merged = data && typeof data === 'object' ? cloneData(data) : {};
    Object.keys(defaultData).forEach(function(key) {
        if (merged[key] === undefined) merged[key] = cloneData(defaultData[key]);
    });
    return merged;
}

function getPublicDataSnapshot(data) {
    var snapshot = withDefaultData(data);
    snapshot.drafts = [];
    return snapshot;
}

function savePublicCache(data) {
    try {
        localStorage.setItem(DB_KEY, JSON.stringify(getPublicDataSnapshot(data)));
    } catch (e) {}
}

ADMIN_KEY_STORAGE = 'laozig_admin_key_session';
var LEGACY_ADMIN_KEY_STORAGE = 'laozig_admin_key';
var _adminVerified = false;
try {
    var _sessionKey = sessionStorage.getItem(ADMIN_KEY_STORAGE) || '';
    var _legacyKey = localStorage.getItem(LEGACY_ADMIN_KEY_STORAGE) || '';
    if (_sessionKey) {
        _adminKey = _sessionKey;
    } else if (_legacyKey) {
        _adminKey = _legacyKey;
        sessionStorage.setItem(ADMIN_KEY_STORAGE, _legacyKey);
    } else {
        _adminKey = '';
    }
    localStorage.removeItem(LEGACY_ADMIN_KEY_STORAGE);
} catch (e) {
    _adminKey = '';
}

function hasAdminKey() {
    return !!_adminKey;
}

hasAdminAccess = function() {
    return hasAdminKey() && _adminVerified;
};

updateAdminAuthStatus = function(message, isError) {
    var el = document.getElementById('adminAuthStatus');
    if (!el) return;
    if (message) {
        el.textContent = message;
        el.style.color = isError ? 'var(--pink)' : 'var(--text-secondary)';
        return;
    }
    if (hasAdminAccess()) {
        el.textContent = '已通过管理认证，可读取草稿并修改共享数据';
        el.style.color = 'var(--green)';
    } else if (hasAdminKey()) {
        el.textContent = '已加载管理密钥，请先连接验证';
        el.style.color = 'var(--text-secondary)';
    } else {
        el.textContent = '当前未认证';
        el.style.color = 'var(--text-secondary)';
    }
};

persistAdminKey = function(key) {
    _adminKey = (key || '').trim();
    _adminVerified = false;
    try {
        if (_adminKey) sessionStorage.setItem(ADMIN_KEY_STORAGE, _adminKey);
        else sessionStorage.removeItem(ADMIN_KEY_STORAGE);
        localStorage.removeItem(LEGACY_ADMIN_KEY_STORAGE);
    } catch (e) {}
    syncAdminKeyInput();
    updateAdminAuthStatus();
};

requireAdminAccess = function() {
    if (hasAdminAccess()) return true;
    if (hasAdminKey()) {
        updateAdminAuthStatus('管理密钥待验证，请先连接', true);
        showToast('请先完成管理认证', true);
    } else {
        updateAdminAuthStatus('未认证：请输入管理密钥', true);
        showToast('请先输入管理密钥', true);
    }
    return false;
};

handleAuthFailure = function(message) {
    persistAdminKey('');
    updateAdminAuthStatus(message || '认证失败，请重新输入管理密钥', true);
    showToast(message || '管理密钥无效，请重新认证', true);
    return loadFromServer().then(function() {
        renderHome();
        renderAdmin();
    }).catch(function() {});
};

loadData = function() {
    if (_serverDataReady && _serverData) {
        return withDefaultData(_serverData);
    }
    try {
        var raw = localStorage.getItem(DB_KEY);
        if (raw) return withDefaultData(JSON.parse(raw));
    } catch (e) {
        console.error('Load error:', e);
    }
    return cloneData(defaultData);
};

saveToServer = function(data) {
    if (!hasAdminAccess()) {
        return Promise.resolve({ ok: false, localOnly: true });
    }
    return fetch('/api/admin/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-admin-key': _adminKey
        },
        body: JSON.stringify(data)
    }).then(function(r) {
        if (r.status === 401) {
            return handleAuthFailure('管理密钥无效，请重新认证').then(function() {
                return { ok: false, unauthorized: true };
            });
        }
        if (!r.ok) {
            return { ok: false, error: new Error('Save failed') };
        }
        return r.json().then(function(payload) {
            return {
                ok: true,
                data: payload && payload.data ? payload.data : data,
                response: payload
            };
        });
    }).catch(function(error) {
        console.warn('[SYNC] server save failed, data only exists locally');
        return { ok: false, error: error };
    });
};

saveData = function(data) {
    var previousData = loadData();
    var shouldRollback = hasAdminAccess();
    var nextData = withDefaultData(data);
    _serverData = cloneData(nextData);
    _serverDataReady = true;
    savePublicCache(nextData);
    return saveToServer(nextData).then(function(result) {
        if (result && result.ok && result.data) {
            _serverData = withDefaultData(result.data);
            _serverDataReady = true;
            savePublicCache(result.data);
        } else if (shouldRollback && !(result && result.unauthorized)) {
            _serverData = withDefaultData(previousData);
            _serverDataReady = true;
            savePublicCache(previousData);
            renderHome();
            renderAdmin();
            showToast('保存失败，已回滚到上次成功状态', true);
        }
        return result;
    });
};

loadFromServer = function() {
    return fetch('/api/data')
        .then(function(r) {
            if (!r.ok) throw new Error('API error');
            return r.json();
        })
        .then(function(data) {
            _serverData = withDefaultData(data);
            _serverDataReady = true;
            savePublicCache(data);
            return _serverData;
        })
        .catch(function() {
            console.warn('[SYNC] server unavailable, using local cached public data');
            _serverDataReady = true;
            _serverData = null;
            return null;
        });
};

loadAdminDataFromServer = function() {
    if (!hasAdminKey()) return Promise.reject(new Error('No admin key'));
    return fetch('/api/admin/data', {
        headers: { 'x-admin-key': _adminKey }
    }).then(function(r) {
        if (r.status === 401) {
            return handleAuthFailure('管理密钥无效，请重新输入').then(function() {
                throw new Error('Unauthorized');
            });
        }
        if (!r.ok) throw new Error('API error');
        return r.json();
    }).then(function(data) {
        _adminVerified = true;
        _serverData = withDefaultData(data);
        _serverDataReady = true;
        savePublicCache(data);
        updateAdminAuthStatus('认证成功，已加载管理数据', false);
        return _serverData;
    });
};

var _originalShowBlogDetail = showBlogDetail;
var _originalRouterNavigate = Router.prototype.navigate;

function getBlogPermalink(blogOrId) {
    var blog = typeof blogOrId === 'object'
        ? blogOrId
        : loadData().blogs.find(function(item) { return item.id === blogOrId; });
    var segment = blog ? (blog.slug || blog.title || blog.id) : blogOrId;
    return window.location.origin + '/blog/' + encodeURIComponent(createBlogSlug(segment));
}

function clearBlogLocation() {
    if (window.location.pathname.indexOf('/blog/') === 0 || window.location.hash.indexOf('#blog-') === 0) {
        history.replaceState(null, '', window.location.origin + '/');
    }
    updateDocumentMetadata(null);
}

showBlogDetail = function(id) {
    var blog = loadData().blogs.find(function(item) {
        return item.id === id || createBlogSlug(item.slug || item.title || item.id) === id || (item.aliases || []).indexOf(id) !== -1;
    });
    if (!blog) return;
    history.replaceState(null, '', getBlogPermalink(blog));
    _originalShowBlogDetail(blog.id);
};

Router.prototype.navigate = function(page) {
    if (page !== 'blog-detail') clearBlogLocation();
    return _originalRouterNavigate.call(this, page);
};

function openBlogFromLocation() {
    var id = '';
    if (window.location.pathname.indexOf('/blog/') === 0) {
        id = decodeURIComponent(window.location.pathname.slice('/blog/'.length));
    } else if (window.location.hash.indexOf('#blog-') === 0) {
        id = decodeURIComponent(window.location.hash.slice(6));
    }
    if (!id) return false;
    var blog = loadData().blogs.find(function(item) {
        return String(item.id) === id || createBlogSlug(item.slug || item.title || item.id) === id || (item.aliases || []).indexOf(id) !== -1;
    });
    if (!blog) return false;
    showBlogDetail(blog.id);
    return true;
}

function waitForInitialData(timeoutMs) {
    var deadline = Date.now() + (timeoutMs || 4000);
    return new Promise(function(resolve) {
        function check() {
            if (_serverDataReady || Date.now() >= deadline) {
                resolve();
                return;
            }
            setTimeout(check, 50);
        }
        check();
    });
}
