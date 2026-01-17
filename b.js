// ==UserScript==
// @name         洛谷全站深色主题 (精简增强版)
// @namespace    https://github.com/dengmuyang/luogu
// @version      1.2.0
// @description  全站适配，包含题目页、讨论区，支持即时切换
// @author       dengmuyang
// @match        https://www.luogu.com.cn/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const styleId = 'luogu-custom-dark-theme';
    
    // 核心 CSS 样式
    const css = `
        /* 全局背景与文字颜色 */
        html, body, .lfe-body, .main-container { 
            background-color: #0f172a !important; 
            color: #e2e8f0 !important; 
        }

        /* 题目描述区域、卡片、面板 */
        .card, .am-panel, .lg-article, .md-inline-block, .padding-default {
            background-color: #1e293b !important;
            border: 1px solid #334155 !important;
            color: #e2e8f0 !important;
        }

        /* 题目内容中的特定颜色修复 (Markdown 渲染区) */
        .lg-article h1, .lg-article h2, .lg-article h3, .lg-article p {
            color: #e2e8f0 !important;
        }

        /* 侧边栏与头部 */
        .lfe-header, #app-header, .side-navigation {
            background-color: #1e293b !important;
            border-bottom: 1px solid #334155 !important;
        }

        /* 输入框与编辑器占位 */
        input, textarea, .edited-container {
            background-color: #0f172a !important;
            color: #f1f5f9 !important;
            border: 1px solid #475569 !important;
        }

        /* 代码块适配 */
        pre, code {
            background-color: #1e293b !important;
            border: 1px solid #475569 !important;
        }

        /* 强制隐藏原本的白底 */
        section { background-color: transparent !important; }
        
        /* 针对题目页面的特殊适配：通过特定类名强制覆盖 */
        .marked, .problem-content, .problem-content-container {
            background: #1e293b !important;
            color: #e2e8f0 !important;
        }
    `;

    // 逻辑：应用主题
    function applyTheme() {
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
        }
    }

    // 逻辑：移除主题
    function removeTheme() {
        const style = document.getElementById(styleId);
        if (style) style.remove();
    }

    // 初始化状态检查
    const currentTheme = localStorage.getItem('luogu-theme-status') || 'dark';
    if (currentTheme === 'dark') {
        applyTheme();
    }

    // 创建切换按钮 (在 DOMContentLoaded 之后执行)
    function createBtn() {
        const btn = document.createElement('div');
        btn.innerHTML = localStorage.getItem('luogu-theme-status') === 'light' ? '🌞' : '🌙';
        Object.assign(btn.style, {
            position: 'fixed', bottom: '20px', left: '20px',
            width: '40px', height: '40px', background: '#3b82f6',
            color: 'white', borderRadius: '50%', textAlign: 'center',
            lineHeight: '40px', cursor: 'pointer', zIndex: '99999',
            fontSize: '20px'
        });

        btn.onclick = () => {
            const status = localStorage.getItem('luogu-theme-status') || 'dark';
            if (status === 'dark') {
                removeTheme();
                localStorage.setItem('luogu-theme-status', 'light');
                btn.innerHTML = '🌞';
            } else {
                applyTheme();
                localStorage.setItem('luogu-theme-status', 'dark');
                btn.innerHTML = '🌙';
            }
        };
        document.body.appendChild(btn);
    }

    // 确保按钮能加载出来
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        createBtn();
    } else {
        document.addEventListener('DOMContentLoaded', createBtn);
    }

})();
