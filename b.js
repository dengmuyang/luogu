// ==UserScript==
// @name         洛谷深度主题定制器
// @namespace    https://github.com/dengmuyang/luogu
// @version      2.0.0
// @description  为洛谷提供完整的主题系统：深色模式、自定义配色、护眼模式、代码高亮等
// @author       dengmuyang
// @match        https://www.luogu.com.cn/*
// @icon         https://www.luogu.com.cn/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_addElement
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    
    // 主题系统核心
    class LuoguThemeSystem {
        constructor() {
            this.themes = {
                // 内置主题
                'dark-pro': {
                    name: '专业深色',
                    colors: {
                        primary: '#1a1a1a',
                        secondary: '#2d2d2d',
                        accent: '#667eea',
                        text: '#e4e4e7',
                        border: '#3f3f46',
                        success: '#10b981',
                        warning: '#f59e0b',
                        error: '#ef4444',
                        codeBg: '#1e1e1e'
                    }
                },
                'midnight-blue': {
                    name: '午夜蓝',
                    colors: {
                        primary: '#0f172a',
                        secondary: '#1e293b',
                        accent: '#3b82f6',
                        text: '#cbd5e1',
                        border: '#334155',
                        codeBg: '#1e293b'
                    }
                },
                'forest-green': {
                    name: '森林绿',
                    colors: {
                        primary: '#022c22',
                        secondary: '#064e3b',
                        accent: '#10b981',
                        text: '#d1fae5',
                        border: '#047857',
                        codeBg: '#064e3b'
                    }
                },
                'solarized-dark': {
                    name: 'Solarized深色',
                    colors: {
                        primary: '#002b36',
                        secondary: '#073642',
                        accent: '#2aa198',
                        text: '#839496',
                        border: '#586e75',
                        codeBg: '#073642'
                    }
                },
                'github-light': {
                    name: 'GitHub浅色',
                    colors: {
                        primary: '#ffffff',
                        secondary: '#f6f8fa',
                        accent: '#0969da',
                        text: '#24292f',
                        border: '#d0d7de',
                        codeBg: '#f6f8fa'
                    }
                }
            };
            
            this.currentTheme = GM_getValue('luogu_theme', 'dark-pro');
            this.customThemes = GM_getValue('luogu_custom_themes', []);
            this.init();
        }
        
        init() {
            // 立即应用主题防止闪烁
            this.applyTheme(this.currentTheme);
            
            // 等待DOM加载完成后添加控制面板
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.createControlPanel());
            } else {
                this.createControlPanel();
            }
            
            // 监听页面变化（SPA）
            this.observePageChanges();
        }
        
        applyTheme(themeName) {
            const theme = this.themes[themeName] || this.getCustomTheme(themeName);
            if (!theme) return;
            
            const css = this.generateThemeCSS(theme);
            
            // 移除旧的样式
            const oldStyle = document.getElementById('luogu-theme-style');
            if (oldStyle) oldStyle.remove();
            
            // 添加新样式
            const style = document.createElement('style');
            style.id = 'luogu-theme-style';
            style.textContent = css;
            document.head.appendChild(style);
            
            // 保存设置
            this.currentTheme = themeName;
            GM_setValue('luogu_theme', themeName);
            
            // 触发主题切换事件
            document.dispatchEvent(new CustomEvent('luoguThemeChanged', {
                detail: { theme: themeName }
            }));
        }
        
        generateThemeCSS(theme) {
            return `
                /* 全局主题 */
                :root {
                    --luogu-primary: ${theme.colors.primary} !important;
                    --luogu-secondary: ${theme.colors.secondary} !important;
                    --luogu-accent: ${theme.colors.accent} !important;
                    --luogu-text: ${theme.colors.text} !important;
                    --luogu-border: ${theme.colors.border} !important;
                    --luogu-code-bg: ${theme.colors.codeBg} !important;
                }
                
                /* 页面背景 */
                body, .main-container, .wrapper {
                    background-color: var(--luogu-primary) !important;
                    color: var(--luogu-text) !important;
                }
                
                /* 卡片和面板 */
                .card, .panel, .am-panel, .section,
                .problem-sidebar, .record-panel,
                .am-u-sm-12, .lg-content {
                    background-color: var(--luogu-secondary) !important;
                    border-color: var(--luogu-border) !important;
                    color: var(--luogu-text) !important;
                }
                
                /* 头部导航 */
                .header, .top-nav, .nav,
                .am-topbar, .lg-header {
                    background-color: var(--luogu-secondary) !important;
                    border-bottom-color: var(--luogu-border) !important;
                }
                
                /* 按钮 */
                .am-btn, .btn, button,
                .am-btn-primary, .primary-btn {
                    background-color: var(--luogu-accent) !important;
                    border-color: var(--luogu-accent) !important;
                    color: white !important;
                }
                
                .am-btn-default {
                    background-color: var(--luogu-secondary) !important;
                    border-color: var(--luogu-border) !important;
                    color: var(--luogu-text) !important;
                }
                
                /* 链接 */
                a, .am-link, .problem-title a {
                    color: var(--luogu-accent) !important;
                }
                
                a:hover {
                    opacity: 0.8;
                }
                
                /* 代码编辑器 */
                .monaco-editor,
                .code-editor,
                .input-wrapper,
                textarea.code {
                    background-color: var(--luogu-code-bg) !important;
                    color: var(--luogu-text) !important;
                }
                
                /* 代码高亮 */
                pre, code, .highlight {
                    background-color: var(--luogu-code-bg) !important;
                    color: var(--luogu-text) !important;
                }
                
                /* 表格 */
                table, .am-table {
                    background-color: var(--luogu-secondary) !important;
                    color: var(--luogu-text) !important;
                }
                
                .am-table-bordered td,
                .am-table-bordered th {
                    border-color: var(--luogu-border) !important;
                }
                
                /* 输入框 */
                input, textarea, select,
                .am-form-field {
                    background-color: var(--luogu-secondary) !important;
                    border-color: var(--luogu-border) !important;
                    color: var(--luogu-text) !important;
                }
                
                /* 滚动条 */
                ::-webkit-scrollbar {
                    width: 10px;
                    height: 10px;
                }
                
                ::-webkit-scrollbar-track {
                    background: var(--luogu-primary);
                }
                
                ::-webkit-scrollbar-thumb {
                    background: var(--luogu-accent);
                    border-radius: 5px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: ${this.lightenColor(theme.colors.accent, 20)};
                }
                
                /* 特殊状态 */
                .am-selected-btn {
                    background-color: var(--luogu-accent) !important;
                }
                
                /* 难度标签 */
                .difficulty-tag {
                    filter: brightness(0.9);
                }
                
                /* 夜间模式额外优化 */
                @media (prefers-color-scheme: dark) {
                    img, .am-img {
                        filter: brightness(0.9);
                    }
                }
            `;
        }
        
        lightenColor(color, percent) {
            const num = parseInt(color.replace('#', ''), 16);
            const amt = Math.round(2.55 * percent);
            const R = (num >> 16) + amt;
            const G = (num >> 8 & 0x00FF) + amt;
            const B = (num & 0x0000FF) + amt;
            return `#${(
                0x1000000 +
                (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
                (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
                (B < 255 ? (B < 1 ? 0 : B) : 255)
            )
            .toString(16)
            .slice(1)}`;
        }
        
        createControlPanel() {
            // 创建浮动控制按钮
            const controlBtn = document.createElement('div');
            controlBtn.id = 'luogu-theme-btn';
            controlBtn.innerHTML = '🎨';
            controlBtn.title = '主题设置';
            
            Object.assign(controlBtn.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                cursor: 'pointer',
                zIndex: '9999',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
                userSelect: 'none'
            });
            
            controlBtn.addEventListener('mouseenter', () => {
                controlBtn.style.transform = 'scale(1.1)';
                controlBtn.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
            });
            
            controlBtn.addEventListener('mouseleave', () => {
                controlBtn.style.transform = 'scale(1)';
                controlBtn.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
            });
            
            controlBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleThemePanel();
            });
            
            document.body.appendChild(controlBtn);
        }
        
        toggleThemePanel() {
            let panel = document.getElementById('luogu-theme-panel');
            
            if (panel) {
                panel.remove();
                return;
            }
            
            // 创建主题面板
            panel = document.createElement('div');
            panel.id = 'luogu-theme-panel';
            
            // 构建面板内容
            panel.innerHTML = `
                <div class="theme-header">
                    <h3>🎨 洛谷主题设置</h3>
                    <button class="close-btn">×</button>
                </div>
                
                <div class="theme-section">
                    <h4>内置主题</h4>
                    <div class="theme-grid" id="builtin-themes"></div>
                </div>
                
                <div class="theme-section">
                    <h4>自定义主题</h4>
                    <div class="theme-grid" id="custom-themes">
                        <div class="theme-add" id="add-theme-btn">
                            + 创建新主题
                        </div>
                    </div>
                </div>
                
                <div class="theme-section">
                    <h4>自定义颜色</h4>
                    <div class="color-pickers">
                        <div class="color-picker">
                            <label>主背景</label>
                            <input type="color" id="color-primary" value="#1a1a1a">
                        </div>
                        <div class="color-picker">
                            <label>次背景</label>
                            <input type="color" id="color-secondary" value="#2d2d2d">
                        </div>
                        <div class="color-picker">
                            <label>强调色</label>
                            <input type="color" id="color-accent" value="#667eea">
                        </div>
                        <div class="color-picker">
                            <label>文字颜色</label>
                            <input type="color" id="color-text" value="#e4e4e7">
                        </div>
                    </div>
                    <button id="apply-custom-colors">应用自定义颜色</button>
                </div>
                
                <div class="theme-section">
                    <h4>其他设置</h4>
                    <div class="theme-options">
                        <label>
                            <input type="checkbox" id="auto-dark" checked>
                            跟随系统深色模式
                        </label>
                        <label>
                            <input type="checkbox" id="smooth-transition" checked>
                            平滑过渡动画
                        </label>
                        <label>
                            <input type="checkbox" id="highlight-code">
                            增强代码高亮
                        </label>
                    </div>
                </div>
            `;
            
            // 添加面板样式
            GM_addStyle(`
                #luogu-theme-panel {
                    position: fixed;
                    bottom: 80px;
                    right: 20px;
                    width: 400px;
                    max-height: 80vh;
                    background: var(--luogu-secondary, #2d2d2d);
                    border-radius: 12px;
                    padding: 20px;
                    z-index: 10000;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    border: 1px solid var(--luogu-border, #3f3f46);
                    color: var(--luogu-text, #e4e4e7);
                    overflow-y: auto;
                    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                }
                
                .theme-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid var(--luogu-border, #3f3f46);
                }
                
                .theme-header h3 {
                    margin: 0;
                    font-size: 18px;
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    color: var(--luogu-text);
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                .theme-section {
                    margin-bottom: 25px;
                }
                
                .theme-section h4 {
                    margin: 0 0 15px 0;
                    font-size: 14px;
                    opacity: 0.9;
                }
                
                .theme-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }
                
                .theme-item {
                    padding: 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 2px solid transparent;
                    background: rgba(255, 255, 255, 0.05);
                }
                
                .theme-item:hover {
                    transform: translateY(-2px);
                    background: rgba(255, 255, 255, 0.1);
                }
                
                .theme-item.active {
                    border-color: var(--luogu-accent, #667eea);
                    background: rgba(102, 126, 234, 0.1);
                }
                
                .theme-preview {
                    width: 100%;
                    height: 60px;
                    border-radius: 6px;
                    margin-bottom: 8px;
                }
                
                .theme-name {
                    font-size: 12px;
                    font-weight: 500;
                }
                
                .theme-add {
                    padding: 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px dashed var(--luogu-border);
                    color: var(--luogu-text);
                    opacity: 0.7;
                    transition: all 0.2s;
                }
                
                .theme-add:hover {
                    opacity: 1;
                    border-color: var(--luogu-accent);
                }
                
                .color-pickers {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                    margin-bottom: 15px;
                }
                
                .color-picker label {
                    display: block;
                    font-size: 12px;
                    margin-bottom: 5px;
                    opacity: 0.8;
                }
                
                .color-picker input {
                    width: 100%;
                    height: 40px;
                    border-radius: 6px;
                    border: 2px solid var(--luogu-border);
                    background: transparent;
                    cursor: pointer;
                }
                
                #apply-custom-colors {
                    width: 100%;
                    padding: 12px;
                    background: var(--luogu-accent);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                }
                
                .theme-options label {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    cursor: pointer;
                    font-size: 14px;
                }
                
                .theme-options input {
                    margin-right: 10px;
                }
            `);
            
            document.body.appendChild(panel);
            
            // 填充主题
            this.populateThemes(panel);
            
            // 绑定事件
            this.bindPanelEvents(panel);
            
            // 点击外部关闭
            setTimeout(() => {
                document.addEventListener('click', (e) => {
                    if (!panel.contains(e.target) && 
                        e.target.id !== 'luogu-theme-btn') {
                        panel.remove();
                    }
                }, { once: true });
            }, 100);
        }
        
        populateThemes(panel) {
            const builtinContainer = panel.querySelector('#builtin-themes');
            const customContainer = panel.querySelector('#custom-themes');
            
            // 内置主题
            Object.entries(this.themes).forEach(([id, theme]) => {
                const themeEl = document.createElement('div');
                themeEl.className = 'theme-item';
                if (id === this.currentTheme) themeEl.classList.add('active');
                
                themeEl.innerHTML = `
                    <div class="theme-preview" style="background: linear-gradient(135deg, 
                        ${theme.colors.primary}, ${theme.colors.secondary})"></div>
                    <div class="theme-name">${theme.name}</div>
                `;
                
                themeEl.addEventListener('click', () => {
                    this.applyTheme(id);
                    panel.querySelectorAll('.theme-item').forEach(el => {
                        el.classList.remove('active');
                    });
                    themeEl.classList.add('active');
                });
                
                builtinContainer.appendChild(themeEl);
            });
            
            // 自定义主题
            this.customThemes.forEach((theme, index) => {
                const themeEl = document.createElement('div');
                themeEl.className = 'theme-item';
                if (`custom-${index}` === this.currentTheme) {
                    themeEl.classList.add('active');
                }
                
                themeEl.innerHTML = `
                    <div class="theme-preview" style="background: linear-gradient(135deg, 
                        ${theme.colors.primary}, ${theme.colors.secondary})"></div>
                    <div class="theme-name">${theme.name}</div>
                    <div style="font-size: 10px; opacity: 0.6; margin-top: 2px;">
                        自定义
                    </div>
                `;
                
                themeEl.addEventListener('click', () => {
                    this.applyTheme(`custom-${index}`);
                    panel.querySelectorAll('.theme-item').forEach(el => {
                        el.classList.remove('active');
                    });
                    themeEl.classList.add('active');
                });
                
                // 右键删除
                themeEl.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    if (confirm(`删除主题 "${theme.name}"？`)) {
                        this.customThemes.splice(index, 1);
                        GM_setValue('luogu_custom_themes', this.customThemes);
                        themeEl.remove();
                    }
                });
                
                customContainer.insertBefore(themeEl, customContainer.firstChild);
            });
        }
        
        bindPanelEvents(panel) {
            // 关闭按钮
            panel.querySelector('.close-btn').addEventListener('click', () => {
                panel.remove();
            });
            
            // 添加主题按钮
            panel.querySelector('#add-theme-btn').addEventListener('click', () => {
                const name = prompt('请输入主题名称：', '我的主题');
                if (name) {
                    const theme = {
                        name: name,
                        colors: {
                            primary: panel.querySelector('#color-primary').value,
                            secondary: panel.querySelector('#color-secondary').value,
                            accent: panel.querySelector('#color-accent').value,
                            text: panel.querySelector('#color-text').value,
                            border: this.lightenColor(panel.querySelector('#color-secondary').value, -10),
                            codeBg: this.lightenColor(panel.querySelector('#color-secondary').value, -5)
                        }
                    };
                    
                    this.customThemes.push(theme);
                    GM_setValue('luogu_custom_themes', this.customThemes);
                    
                    // 重新加载面板
                    panel.remove();
                    this.toggleThemePanel();
                    
                    // 应用新主题
                    this.applyTheme(`custom-${this.customThemes.length - 1}`);
                }
            });
            
            // 应用自定义颜色
            panel.querySelector('#apply-custom-colors').addEventListener('click', () => {
                const colors = {
                    primary: panel.querySelector('#color-primary').value,
                    secondary: panel.querySelector('#color-secondary').value,
                    accent: panel.querySelector('#color-accent').value,
                    text: panel.querySelector('#color-text').value
                };
                
                // 创建临时主题
                const tempTheme = {
                    name: '临时主题',
                    colors: {
                        ...colors,
                        border: this.lightenColor(colors.secondary, -10),
                        codeBg: this.lightenColor(colors.secondary, -5)
                    }
                };
                
                // 临时应用
                const css = this.generateThemeCSS(tempTheme);
                const tempStyle = document.createElement('style');
                tempStyle.id = 'luogu-temp-theme';
                tempStyle.textContent = css;
                
                const oldStyle = document.getElementById('luogu-temp-theme');
                if (oldStyle) oldStyle.remove();
                document.head.appendChild(tempStyle);
            });
        }
        
        getCustomTheme(themeName) {
            if (themeName.startsWith('custom-')) {
                const index = parseInt(themeName.replace('custom-', ''));
                return this.customThemes[index];
            }
            return null;
        }
        
        observePageChanges() {
            // 监听URL变化（SPA）
            let lastUrl = location.href;
            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    // 页面切换后重新应用主题
                    setTimeout(() => this.applyTheme(this.currentTheme), 100);
                }
            }).observe(document, { subtree: true, childList: true });
            
            // 监听系统主题变化
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                const autoDark = GM_getValue('luogu_auto_dark', true);
                if (autoDark) {
                    this.applyTheme(e.matches ? 'dark-pro' : 'github-light');
                }
            });
        }
    }
    
    // 启动主题系统
    window.addEventListener('load', () => {
        new LuoguThemeSystem();
    });
    
    // 立即开始防止闪烁
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new LuoguThemeSystem();
        });
    } else {
        new LuoguThemeSystem();
    }
    
})();
