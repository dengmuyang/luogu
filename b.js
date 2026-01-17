// ==UserScript==
// @name         洛谷主页深色主题 (Pro)
// @namespace    https://github.com/dengmuyang/luogu
// @version      1.1.0
// @description  优化性能，消除闪烁，支持系统自动切换
// @author       dengmuyang
// @match        https://www.luogu.com.cn/*
// @icon         https://www.luogu.com.cn/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // 1. 定义颜色变量 (集中管理，方便修改)
    const cssVars = `
        :root {
            --lg-bg: #0f172a;
            --lg-card-bg: #1e293b;
            --lg-text: #e2e8f0;
            --lg-text-dim: #94a3b8;
            --lg-border: #334155;
            --lg-primary: #3b82f6;
            --lg-accent: #6366f1;
        }
        .luogu-dark-home body { background-color: var(--lg-bg) !important; color: var(--lg-text) !important; }
    `;

    // 2. 核心 CSS 样式
    const cssBody = `
        /* 全局适配 */
        .luogu-dark-home .lfe-body { background: var(--lg-bg) !important; }
        .luogu-dark-home .card, 
        .luogu-dark-home .am-panel,
        .luogu-dark-home .lg-article { 
            background: var(--lg-card-bg) !important; 
            border: 1px solid var(--lg-border) !important;
            color: var(--lg-text) !important;
            border-radius: 12px !important;
        }

        /* 头部与导航 */
        .luogu-dark-home .lfe-header,
        .luogu-dark-home #app-header {
            background: rgba(30, 41, 59, 0.8) !important;
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--lg-border) !important;
        }

        /* 运势卡片精准美化 */
        .luogu-dark-home .lg-punch {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
            border: none !important;
        }

        /* 按钮与交互 */
        .luogu-dark-home .am-btn-primary,
        .luogu-dark-home button.lfe-form-sz-middle {
            background: var(--lg-primary) !important;
            border: none !important;
            transition: all 0.2s !important;
        }
        
        /* 链接 */
        .luogu-dark-home a { color: var(--lg-primary) !important; }
        
        /* 滚动条 */
        .luogu-dark-home ::-webkit-scrollbar { width: 8px; }
        .luogu-dark-home ::-webkit-scrollbar-track { background: var(--lg-bg); }
        .luogu-dark-home ::-webkit-scrollbar-thumb { background: var(--lg-border); border-radius: 4px; }
    `;

    // 3. 立即执行：判断并应用主题 (解决白屏闪烁的关键)
    const applySavedTheme = () => {
        const savedTheme = localStorage.getItem('luogu-home-theme') || 'dark';
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('luogu-dark-home');
        }
    };
    applySavedTheme();

    // 4. 注入 CSS
    const styleElement = document.createElement('style');
    styleElement.textContent = cssVars + cssBody;
    document.documentElement.appendChild(styleElement);

    // 5. 创建 UI 切换按钮
    const initUI = () => {
        if (document.getElementById('theme-toggle-btn')) return;

        const btn = document.createElement('div');
        btn.id = 'theme-toggle-btn';
        btn.innerHTML = localStorage.getItem('luogu-home-theme') === 'light' ? '🌞' : '🌙';
        
        Object.assign(btn.style, {
            position: 'fixed', bottom: '30px', left: '30px',
            width: '44px', height: '44px', borderRadius: '50%',
            backgroundColor: '#3b82f6', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: '10000', fontSize: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)', transition: 'transform 0.2s'
        });

        btn.onclick = () => {
            const isDark = document.documentElement.classList.toggle('luogu-dark-home');
            const newTheme = isDark ? 'dark' : 'light';
            localStorage.setItem('luogu-home-theme', newTheme);
            btn.innerHTML = isDark ? '🌙' : '🌞';
        };

        btn.onmouseenter = () => btn.style.transform = 'scale(1.1)';
        btn.onmouseleave = () => btn.style.transform = 'scale(1)';

        document.body.appendChild(btn);
    };

    // 等待 body 可用时注入 UI
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }
})();
