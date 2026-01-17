// ==UserScript==
// @name         洛谷主页深色主题
// @namespace    https://github.com/dengmuyang/luogu
// @version      1.0.0
// @description  专门为洛谷主页设计的深色主题
// @author       dengmuyang
// @match        https://www.luogu.com.cn/
// @match        https://www.luogu.com.cn
// @icon         https://www.luogu.com.cn/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    
    // 根据你的截图精准定位的CSS
    const css = `
        /* === 全局重置 === */
        body {
            background-color: #0f172a !important;
            color: #e2e8f0 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        
        /* === 头部区域 === */
        .header, 
        .am-topbar,
        .lfe-header {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;
            border-bottom: 1px solid #334155 !important;
            color: #e2e8f0 !important;
        }
        
        /* 导航链接 */
        .header a,
        .am-topbar a,
        .nav-link,
        .am-nav > li > a {
            color: #94a3b8 !important;
        }
        
        .header a:hover,
        .am-topbar a:hover {
            color: #cbd5e1 !important;
        }
        
        /* === 主要内容区域 === */
        .am-container,
        .main-container,
        .wrapper {
            background-color: #0f172a !important;
        }
        
        /* === 卡片样式 === */
        .card,
        .am-panel,
        .panel,
        .section {
            background-color: #1e293b !important;
            border: 1px solid #334155 !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3) !important;
            color: #e2e8f0 !important;
            margin-bottom: 20px !important;
            overflow: hidden !important;
        }
        
        /* 卡片标题 */
        .card h2,
        .card h3,
        .card h4,
        .am-panel-hd,
        .panel-heading {
            background: linear-gradient(135deg, #334155 0%, #475569 100%) !important;
            color: #f1f5f9 !important;
            padding: 15px 20px !important;
            margin: 0 !important;
            border-bottom: 1px solid #475569 !important;
        }
        
        /* 卡片内容 */
        .card-body,
        .am-panel-bd,
        .panel-body {
            padding: 20px !important;
        }
        
        /* === 运势卡片 === */
        .user-card,
        .profile-card,
        .lucky-card {
            background: linear-gradient(135deg, #3730a3 0%, #5b21b6 100%) !important;
            color: white !important;
            border: none !important;
            box-shadow: 0 10px 25px rgba(91, 33, 182, 0.3) !important;
        }
        
        /* 运势标题 */
        .user-card h4,
        .lucky-card h4 {
            color: #c7d2fe !important;
            font-size: 16px !important;
        }
        
        /* 运势内容 */
        .lucky-content {
            color: #e9d5ff !important;
            font-size: 14px !important;
            line-height: 1.6 !important;
        }
        
        /* 宜/忌列表 */
        .lucky-item {
            background: rgba(255, 255, 255, 0.1) !important;
            padding: 8px 12px !important;
            border-radius: 6px !important;
            margin: 5px 0 !important;
        }
        
        /* === 比赛列表 === */
        .contest-list,
        .event-list {
            background: transparent !important;
        }
        
        .contest-item,
        .event-item {
            background: #1e293b !important;
            border-left: 4px solid #3b82f6 !important;
            margin-bottom: 12px !important;
            padding: 15px !important;
            border-radius: 8px !important;
            transition: all 0.3s ease !important;
        }
        
        .contest-item:hover,
        .event-item:hover {
            background: #334155 !important;
            transform: translateX(5px) !important;
        }
        
        /* 比赛标题 */
        .contest-title {
            color: #60a5fa !important;
            font-weight: 600 !important;
            font-size: 16px !important;
        }
        
        /* 比赛信息 */
        .contest-info,
        .event-info {
            color: #94a3b8 !important;
            font-size: 14px !important;
            margin-top: 5px !important;
        }
        
        /* Rated标签 */
        .rated-tag {
            background: #10b981 !important;
            color: white !important;
            padding: 2px 8px !important;
            border-radius: 12px !important;
            font-size: 12px !important;
            font-weight: bold !important;
        }
        
        /* === 教材推广区域 === */
        .book-promo,
        .promotion-card {
            background: linear-gradient(135deg, #065f46 0%, #047857 100%) !important;
            color: white !important;
            border: none !important;
        }
        
        .book-title {
            color: #a7f3d0 !important;
            font-size: 18px !important;
            font-weight: bold !important;
        }
        
        .book-subtitle {
            color: #d1fae5 !important;
            font-size: 14px !important;
        }
        
        /* === 搜索框 === */
        .search-box,
        .search-container {
            background: #1e293b !important;
            border: 2px solid #3b82f6 !important;
            border-radius: 25px !important;
            padding: 10px 20px !important;
        }
        
        .search-input {
            background: transparent !important;
            color: #e2e8f0 !important;
            border: none !important;
            outline: none !important;
            font-size: 16px !important;
            width: 100% !important;
        }
        
        .search-input::placeholder {
            color: #94a3b8 !important;
        }
        
        .search-button {
            background: #3b82f6 !important;
            color: white !important;
            border: none !important;
            border-radius: 20px !important;
            padding: 8px 20px !important;
            cursor: pointer !important;
            font-weight: 600 !important;
        }
        
        /* === 按钮 === */
        .am-btn,
        button,
        .btn {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 10px 20px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
        }
        
        .am-btn:hover,
        button:hover {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3) !important;
        }
        
        .am-btn-default {
            background: #334155 !important;
            color: #e2e8f0 !important;
            border: 1px solid #475569 !important;
        }
        
        /* === 链接 === */
        a {
            color: #60a5fa !important;
            text-decoration: none !important;
            transition: color 0.3s ease !important;
        }
        
        a:hover {
            color: #93c5fd !important;
            text-decoration: underline !important;
        }
        
        /* === 列表 === */
        ul, ol {
            color: #cbd5e1 !important;
        }
        
        li {
            margin-bottom: 8px !important;
            line-height: 1.6 !important;
        }
        
        /* === 公告区域 === */
        .announcement,
        .notice {
            background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: 12px !important;
            padding: 20px !important;
        }
        
        .announcement-title {
            color: #ddd6fe !important;
            font-size: 16px !important;
            font-weight: bold !important;
        }
        
        .announcement-content {
            color: #f5f3ff !important;
            font-size: 14px !important;
        }
        
        /* === 分隔线 === */
        hr {
            border-color: #475569 !important;
            margin: 30px 0 !important;
        }
        
        /* === 网格布局 === */
        .am-g,
        .row {
            margin-left: -10px !important;
            margin-right: -10px !important;
        }
        
        .am-u-*,
        .col-* {
            padding-left: 10px !important;
            padding-right: 10px !important;
        }
        
        /* === 页脚 === */
        .footer,
        .lfe-footer {
            background: #1e293b !important;
            color: #94a3b8 !important;
            border-top: 1px solid #334155 !important;
            padding: 30px 0 !important;
            margin-top: 50px !important;
        }
        
        /* === 响应式调整 === */
        @media (max-width: 768px) {
            .card, .am-panel {
                border-radius: 10px !important;
                margin-bottom: 15px !important;
            }
            
            .card-body, .am-panel-bd {
                padding: 15px !important;
            }
        }
        
        /* === 滚动条美化 === */
        ::-webkit-scrollbar {
            width: 10px !important;
            height: 10px !important;
        }
        
        ::-webkit-scrollbar-track {
            background: #1e293b !important;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #475569 !important;
            border-radius: 5px !important;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: #64748b !important;
        }
        
        /* === 强制覆盖内联样式 === */
        [style*="background-color"]:not(.exclude-theme),
        [style*="background"]:not(.exclude-theme) {
            background-color: inherit !important;
            background: inherit !important;
        }
        
        [style*="color"]:not(.exclude-theme) {
            color: inherit !important;
        }
    `;
    
    // 立即注入CSS
    function injectTheme() {
        // 移除可能存在的旧样式
        const oldStyle = document.getElementById('luogu-home-theme');
        if (oldStyle) oldStyle.remove();
        
        // 创建新样式
        const style = document.createElement('style');
        style.id = 'luogu-home-theme';
        style.textContent = css;
        
        // 插入到head最前面
        document.head.insertBefore(style, document.head.firstChild);
        
        console.log('洛谷主页主题已应用');
        
        // 添加主题标记
        document.body.classList.add('luogu-dark-home');
    }
    
    // 等待DOM加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectTheme);
    } else {
        injectTheme();
    }
    
    // 监听动态内容加载
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                // 重新注入以确保新内容被样式化
                setTimeout(injectTheme, 100);
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // 创建一个简单的主题切换按钮
    function createThemeToggle() {
        const toggleBtn = document.createElement('button');
        toggleBtn.innerHTML = '🌙';
        toggleBtn.title = '切换主题';
        
        Object.assign(toggleBtn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px',
            zIndex: '9999',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease'
        });
        
        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.transform = 'scale(1.1)';
            toggleBtn.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
        });
        
        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.transform = 'scale(1)';
        });
        
        toggleBtn.addEventListener('click', () => {
            const isDark = document.body.classList.contains('luogu-dark-home');
            
            if (isDark) {
                // 切换到浅色主题
                document.getElementById('luogu-home-theme').remove();
                document.body.classList.remove('luogu-dark-home');
                toggleBtn.innerHTML = '🌞';
                localStorage.setItem('luogu-home-theme', 'light');
            } else {
                // 切换到深色主题
                injectTheme();
                toggleBtn.innerHTML = '🌙';
                localStorage.setItem('luogu-home-theme', 'dark');
            }
        });
        
        // 检查本地存储的主题偏好
        const savedTheme = localStorage.getItem('luogu-home-theme');
        if (savedTheme === 'light') {
            toggleBtn.innerHTML = '🌞';
        }
        
        document.body.appendChild(toggleBtn);
    }
    
    // 添加切换按钮
    setTimeout(createThemeToggle, 2000);
    
})();
