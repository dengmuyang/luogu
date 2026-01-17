// ==UserScript==
// @name         洛谷全站深色模式 (强力覆盖版)
// @namespace    https://github.com/dengmuyang/luogu
// @version      1.3.0
// @description  采用滤镜技术实现 100% 覆盖，针对题目描述、代码编辑器进行专项优化
// @author       dengmuyang
// @match        *://www.luogu.com.cn/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const styleId = 'luogu-mega-dark-theme';

    // 核心样式：使用 CSS Filter 翻转色调，再翻转回来以保持图片和颜色正常
    const css = `
        /* 1. 核心逻辑：翻转整个 HTML 的颜色 */
        html.luogu-dark-mode {
            filter: invert(0.9) hue-rotate(180deg) !important;
            background-color: #fff !important;
        }

        /* 2. 反翻转：恢复图片、视频、图表、代码编辑器和特殊元素的原始颜色 */
        html.luogu-dark-mode img,
        html.luogu-dark-mode video,
        html.luogu-dark-mode .am-badge,
        html.luogu-dark-mode .lg-fg-bluelight,
        html.luogu-dark-mode .lg-fg-green,
        html.luogu-dark-mode .lg-fg-purple,
        html.luogu-dark-mode [class*="tag"],
        html.luogu-dark-mode .color-default,
        html.luogu-dark-mode .monaco-editor, 
        html.luogu-dark-mode .katex {
            filter: invert(1) hue-rotate(180deg) !important;
        }

        /* 3. 修正题目页面的代码块背景，避免对比度太低 */
        html.luogu-dark-mode pre, 
        html.luogu-dark-mode code {
            background-color: #f0f0f0 !important;
            border-radius: 4px;
        }

        /* 4. 彻底去除滚动条白边 */
        html.luogu-dark-mode ::-webkit-scrollbar { width: 8px; background: #eee; }
        html.luogu-dark-mode ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
        
        /* 按钮修正 */
        #theme-toggle-btn {
            filter: invert(1) hue-rotate(180deg) !important;
        }
    `;

    // 应用主题
    function applyTheme() {
        document.documentElement.classList.add('luogu-dark-mode');
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = css;
            document.documentElement.appendChild(style);
        }
    }

    // 状态初始化
    const isDark = (localStorage.getItem('luogu-theme-status') || 'dark') === 'dark';
    if (isDark) applyTheme();

    // 按钮逻辑
    function initUI() {
        const btn = document.createElement('div');
        btn.id = 'theme-toggle-btn';
        btn.innerHTML = localStorage.getItem('luogu-theme-status') === 'light' ? '🌞' : '🌙';
        
        Object.assign(btn.style, {
            position: 'fixed', bottom: '30px', left: '30px',
            width: '45px', height: '45px', borderRadius: '50%',
            backgroundColor: '#3b82f6', color: 'white', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: '999999', fontSize: '24px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        });

        btn.onclick = () => {
            const wasDark = document.documentElement.classList.contains('luogu-dark-mode');
            if (wasDark) {
                document.documentElement.classList.remove('luogu-dark-mode');
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

    if (document.readyState === 'complete') initUI();
    else document.addEventListener('DOMContentLoaded', initUI);

})();
