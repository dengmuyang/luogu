// ==UserScript==
// @name         洛谷超级主题引擎
// @namespace    https://github.com/dengmuyang/luogu
// @version      3.0.0
// @description  深度覆盖洛谷所有元素的主题系统，支持强制样式覆盖
// @author       dengmuyang
// @match        https://www.luogu.com.cn/*
// @icon         https://www.luogu.com.cn/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    
    // 超级主题引擎
    class SuperThemeEngine {
        constructor() {
            this.themes = this.getAllThemes();
            this.currentTheme = GM_getValue('luogu_super_theme', 'deep-dark');
            this.forceOverride = GM_getValue('luogu_force_override', true);
            this.init();
        }
        
        getAllThemes() {
            return {
                'deep-dark': {
                    name: '深度深色',
                    type: 'dark',
                    priority: 9999,
                    css: this.generateDeepDarkCSS()
                },
                'midnight-purple': {
                    name: '午夜紫',
                    type: 'dark', 
                    priority: 9999,
                    css: this.generateMidnightPurpleCSS()
                },
                'oled-black': {
                    name: 'OLED纯黑',
                    type: 'dark',
                    priority: 9999,
                    css: this.generateOLEDBlackCSS()
                },
                'light-pro': {
                    name: '专业浅色',
                    type: 'light',
                    priority: 9999,
                    css: this.generateLightProCSS()
                },
                'github-dark': {
                    name: 'GitHub深色',
                    type: 'dark',
                    priority: 9999,
                    css: this.generateGitHubDarkCSS()
                },
                'matrix-green': {
                    name: '矩阵绿',
                    type: 'dark',
                    priority: 9999,
                    css: this.generateMatrixGreenCSS()
                }
            };
        }
        
        generateDeepDarkCSS() {
            return `
                /* 深度深色主题 - 强制覆盖 */
                * {
                    transition: background-color 0.3s, color 0.3s, border-color 0.3s !important;
                }
                
                /* 强制重置所有背景 */
                body, div, section, article, main, header, footer,
                .am-g, .am-container, .am-topbar, .am-panel,
                .card, .panel, .section, .wrapper,
                .problem-sidebar, .record-panel, .lg-content,
                .am-u-sm-12, .am-u-md-6, .am-u-lg-4,
                .am-form, .am-table, .am-btn-group {
                    background-color: #0a0a0a !important;
                    color: #e0e0e0 !important;
                }
                
                /* 卡片层级 */
                .card, .am-panel, .panel {
                    background-color: #1a1a1a !important;
                    border-color: #2a2a2a !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
                }
                
                /* 头部区域 */
                .header, .top-nav, .am-topbar,
                .lg-header, .nav, .navbar {
                    background-color: #111 !important;
                    border-bottom-color: #333 !important;
                }
                
                /* 文字和链接 */
                h1, h2, h3, h4, h5, h6,
                p, span, li, td, th {
                    color: #e0e0e0 !important;
                }
                
                a, .am-link, .problem-title a,
                .user-name a, .comment-author a {
                    color: #64b5f6 !important;
                    text-decoration: none !important;
                }
                
                a:hover {
                    color: #90caf9 !important;
                    text-decoration: underline !important;
                }
                
                /* 按钮 */
                .am-btn, button, .btn,
                .am-btn-primary, .primary-btn,
                input[type="submit"], input[type="button"] {
                    background: linear-gradient(135deg, #667eea, #764ba2) !important;
                    color: white !important;
                    border: none !important;
                    border-radius: 6px !important;
                    padding: 8px 16px !important;
                    font-weight: 500 !important;
                }
                
                .am-btn-default {
                    background: #2a2a2a !important;
                    color: #e0e0e0 !important;
                    border-color: #444 !important;
                }
                
                /* 输入框 */
                input, textarea, select,
                .am-form-field, .search-input {
                    background-color: #1a1a1a !important;
                    color: #e0e0e0 !important;
                    border-color: #444 !important;
                    border-radius: 4px !important;
                    padding: 8px 12px !important;
                }
                
                /* 代码区域 */
                pre, code, .highlight,
                .code-block, .source-code {
                    background-color: #121212 !important;
                    color: #f8f8f2 !important;
                    border-color: #333 !important;
                }
                
                /* 编辑器 */
                .monaco-editor, .code-editor,
                .input-wrapper, textarea.code {
                    background-color: #1e1e1e !important;
                }
                
                /* 表格 */
                table, .am-table {
                    background-color: #1a1a1a !important;
                }
                
                .am-table-bordered td,
                .am-table-bordered th {
                    border-color: #333 !important;
                }
                
                /* 难度标签 */
                .difficulty-tag, .tag,
                .am-badge, .label {
                    background-color: #333 !important;
                    color: #fff !important;
                    border-radius: 12px !important;
                    padding: 2px 8px !important;
                }
                
                /* 滚动条 */
                ::-webkit-scrollbar {
                    width: 12px;
                    height: 12px;
                }
                
                ::-webkit-scrollbar-track {
                    background: #111;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: #444;
                    border-radius: 6px;
                    border: 2px solid #111;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
                
                /* 特殊元素 - 针对你的截图 */
                /* 运势卡片 */
                .user-card, .profile-card {
                    background: linear-gradient(135deg, #1a237e, #311b92) !important;
                    color: white !important;
                }
                
                /* 比赛列表 */
                .contest-item, .event-card {
                    background: #1a1a1a !important;
                    border-left: 4px solid #667eea !important;
                }
                
                /* 公告区域 */
                .announcement, .notice {
                    background: #1b5e20 !important;
                    color: #c8e6c9 !important;
                }
                
                /* 搜索框 */
                .search-box {
                    background: #1a1a1a !important;
                    border: 2px solid #667eea !important;
                }
                
                /* 图片优化 */
                img {
                    filter: brightness(0.9) contrast(1.1);
                }
                
                /* 响应式优化 */
                @media (max-width: 768px) {
                    body {
                        font-size: 14px;
                    }
                }
            `;
        }
        
        generateMidnightPurpleCSS() {
            return `
                /* 午夜紫主题 */
                body, .wrapper, .main-container {
                    background: linear-gradient(135deg, #0c0c1d, #1a0b2e) !important;
                    color: #d8c7ff !important;
                }
                
                .card, .panel {
                    background: rgba(30, 15, 60, 0.9) !important;
                    backdrop-filter: blur(10px);
                    border: 1px solid #4a2c8c !important;
                }
                
                .am-btn-primary {
                    background: linear-gradient(135deg, #8a2be2, #4b0082) !important;
                }
            `;
        }
        
        generateOLEDBlackCSS() {
            return `
                /* OLED纯黑主题 - 省电模式 */
                body, div, section, .card {
                    background-color: #000000 !important;
                    color: #ffffff !important;
                }
                
                .card, .panel {
                    background-color: #111111 !important;
                    border-color: #222222 !important;
                }
            `;
        }
        
        generateLightProCSS() {
            return `
                /* 专业浅色主题 */
                body {
                    background-color: #f8fafc !important;
                    color: #1e293b !important;
                }
                
                .card, .panel {
                    background: white !important;
                    border: 1px solid #e2e8f0 !important;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
                }
                
                .am-btn-primary {
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
                }
                
                a {
                    color: #2563eb !important;
                }
            `;
        }
        
        init() {
            // 立即注入基础样式防止闪烁
            this.injectBaseStyle();
            
            // 应用主题
            this.applyTheme(this.currentTheme);
            
            // 创建控制界面
            this.createSuperControlPanel();
            
            // 监听页面变化
            this.observeAndOverride();
            
            // 增强强制覆盖
            if (this.forceOverride) {
                this.enhanceOverride();
            }
        }
        
        injectBaseStyle() {
            // 立即注入一个基础样式防止页面闪烁
            const baseStyle = document.createElement('style');
            baseStyle.id = 'luogu-base-theme';
            baseStyle.textContent = `
                body {
                    visibility: hidden !important;
                }
                
                body.theme-loaded {
                    visibility: visible !important;
                    transition: opacity 0.5s ease !important;
                }
            `;
            document.head.appendChild(baseStyle);
        }
        
        applyTheme(themeName) {
            const theme = this.themes[themeName];
            if (!theme) return;
            
            // 移除旧主题
            const oldStyle = document.getElementById('luogu-super-theme');
            if (oldStyle) oldStyle.remove();
            
            // 添加新主题
            const style = document.createElement('style');
            style.id = 'luogu-super-theme';
            style.setAttribute('data-theme', themeName);
            style.setAttribute('data-priority', theme.priority);
            style.textContent = theme.css;
            
            // 插入到最前面确保覆盖
            document.head.insertBefore(style, document.head.firstChild);
            
            // 保存设置
            this.currentTheme = themeName;
            GM_setValue('luogu_super_theme', themeName);
            
            // 标记页面已加载主题
            setTimeout(() => {
                document.body.classList.add('theme-loaded');
            }, 100);
            
            console.log(`应用主题: ${theme.name}`);
        }
        
        createSuperControlPanel() {
            // 创建迷你控制条（更隐蔽）
            const controlBar = document.createElement('div');
            controlBar.id = 'luogu-mini-control';
            
            controlBar.innerHTML = `
                <div class="mini-theme-switcher">
                    <select id="mini-theme-select">
                        ${Object.entries(this.themes).map(([id, theme]) => 
                            `<option value="${id}" ${id === this.currentTheme ? 'selected' : ''}>
                                ${theme.name}
                            </option>`
                        ).join('')}
                    </select>
                    <button id="mini-settings-btn" title="主题设置">⚙️</button>
                    <button id="mini-toggle-btn" title="切换主题">🎨</button>
                </div>
            `;
            
            GM_addStyle(`
                #luogu-mini-control {
                    position: fixed;
                    bottom: 10px;
                    right: 10px;
                    z-index: 10000;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 5px 10px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s ease;
                }
                
                #luogu-mini-control:hover {
                    background: rgba(0, 0, 0, 0.9);
                    transform: translateY(-2px);
                }
                
                .mini-theme-switcher {
                    display: flex;
                    gap: 5px;
                    align-items: center;
                }
                
                #mini-theme-select {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    padding: 5px 10px;
                    font-size: 12px;
                    max-width: 120px;
                    cursor: pointer;
                }
                
                #mini-settings-btn,
                #mini-toggle-btn {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border: none;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                }
                
                #mini-settings-btn:hover,
                #mini-toggle-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `);
            
            document.body.appendChild(controlBar);
            
            // 绑定事件
            document.getElementById('mini-theme-select').addEventListener('change', (e) => {
                this.applyTheme(e.target.value);
            });
            
            document.getElementById('mini-toggle-btn').addEventListener('click', () => {
                const themes = Object.keys(this.themes);
                const currentIndex = themes.indexOf(this.currentTheme);
                const nextIndex = (currentIndex + 1) % themes.length;
                this.applyTheme(themes[nextIndex]);
                document.getElementById('mini-theme-select').value = themes[nextIndex];
            });
            
            document.getElementById('mini-settings-btn').addEventListener('click', () => {
                this.showAdvancedSettings();
            });
        }
        
        showAdvancedSettings() {
            // 简单设置面板
            const settings = `
                <div style="
                    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.95); color: white; padding: 20px;
                    border-radius: 15px; z-index: 10001; min-width: 300px;
                    border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px);
                ">
                    <h3 style="margin-top: 0;">🎨 主题高级设置</h3>
                    
                    <label style="display: block; margin: 10px 0;">
                        <input type="checkbox" id="force-override" ${this.forceOverride ? 'checked' : ''}>
                        强制样式覆盖（修复主题不生效）
                    </label>
                    
                    <label style="display: block; margin: 10px 0;">
                        <input type="checkbox" id="auto-dark-mode" checked>
                        跟随系统深色模式
                    </label>
                    
                    <label style="display: block; margin: 10px 0;">
                        <input type="checkbox" id="smooth-transitions" checked>
                        平滑过渡动画
                    </label>
                    
                    <div style="margin-top: 20px; display: flex; gap: 10px;">
                        <button id="save-settings" style="
                            background: #667eea; color: white; border: none;
                            padding: 10px 20px; border-radius: 8px; cursor: pointer;
                        ">保存设置</button>
                        <button id="close-settings" style="
                            background: transparent; color: #999; border: 1px solid #666;
                            padding: 10px 20px; border-radius: 8px; cursor: pointer;
                        ">关闭</button>
                    </div>
                </div>
            `;
            
            const overlay = document.createElement('div');
            overlay.id = 'luogu-settings-overlay';
            overlay.innerHTML = settings;
            
            // 点击外部关闭
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            document.body.appendChild(overlay);
            
            // 绑定事件
            document.getElementById('save-settings').addEventListener('click', () => {
                this.forceOverride = document.getElementById('force-override').checked;
                GM_setValue('luogu_force_override', this.forceOverride);
                
                if (this.forceOverride) {
                    this.enhanceOverride();
                }
                
                overlay.remove();
            });
            
            document.getElementById('close-settings').addEventListener('click', () => {
                overlay.remove();
            });
            
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                }
            });
        }
        
        observeAndOverride() {
            // 持续监控并覆盖新元素
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        // 延迟执行确保DOM完全加载
                        setTimeout(() => {
                            this.applyTheme(this.currentTheme);
                        }, 100);
                    }
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        
        enhanceOverride() {
            // 增强强制覆盖：使用更具体的选择器
            const enhancedCSS = `
                /* 增强覆盖 - 使用!important和具体选择器 */
                body * {
                    background-color: inherit !important;
                    color: inherit !important;
                }
                
                /* 针对常见框架类名 */
                [class*="am-"], [class*="lg-"], [class*="luogu-"] {
                    background-color: inherit !important;
                    color: inherit !important;
                }
                
                /* 内联样式覆盖 */
                [style] {
                    background-color: inherit !important;
                    color: inherit !important;
                    border-color: inherit !important;
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'luogu-force-override';
            style.textContent = enhancedCSS;
            document.head.appendChild(style);
        }
    }
    
    // 立即启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new SuperThemeEngine();
        });
    } else {
        new SuperThemeEngine();
    }
    
    // 添加一个全局函数方便调试
    unsafeWindow.luoguTheme = {
        reload: () => new SuperThemeEngine(),
        getCurrentTheme: () => GM_getValue('luogu_super_theme', 'deep-dark'),
        setTheme: (name) => {
            const engine = new SuperThemeEngine();
            engine.applyTheme(name);
        }
    };
    
})();
