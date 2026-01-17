// ==UserScript==
// @name         洛谷提交记录筛选器
// @namespace    https://github.com/dengmuyang/luogu
// @version      1.0.0
// @description  为洛谷添加提交记录筛选功能，可按状态、语言、题目ID筛选
// @author       dengmuyang
// @match        https://www.luogu.com.cn/record/list*
// @match        https://www.luogu.com.cn/record*
// @match        https://luogu.com.cn/record/list*
// @match        https://luogu.com.cn/record*
// @icon         https://www.luogu.com.cn/favicon.ico
// @grant        none
// @license      MIT
// @supportURL   https://github.com/dengmuyang/luogu/issues
// ==/UserScript==

(function() {
    'use strict';
    
    // 等待页面加载完成
    function waitForElement(selector, callback, maxAttempts = 50, interval = 200) {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(checkInterval);
                callback(element);
            } else if (++attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.log('未找到元素:', selector);
            }
        }, interval);
    }
    
    // 判断是否在提交记录页面
    function isSubmissionPage() {
        const path = window.location.pathname;
        return path.includes('/record') || path.includes('/record/list');
    }
    
    // 筛选提交记录
    class LuoguSubmissionFilter {
        constructor() {
            this.filters = {
                status: 'all',
                language: 'all',
                problem: ''
            };
            
            this.enhanceSelectors();
            this.init();
        }
        
        // 增强CSS选择器，适配洛谷不同页面结构
        enhanceSelectors() {
            // 尝试不同的选择器
            this.selectors = {
                submissionRow: '.record-row, .submission-row, tr[data-record-id]',
                status: '.status, .record-status, .result',
                language: '.language, .record-language',
                problem: '.problem, .record-problem',
                submissionList: '.record-list, .submission-list, table'
            };
        }
        
        init() {
            if (!isSubmissionPage()) return;
            
            // 等待提交记录表格加载
            waitForElement(this.selectors.submissionList, () => {
                this.createFilterPanel();
                this.applyFilters();
                this.observeDOMChanges();
            });
        }
        
        createFilterPanel() {
            // 防止重复创建
            if (document.getElementById('luogu-filter-panel')) return;
            
            const panel = document.createElement('div');
            panel.id = 'luogu-filter-panel';
            panel.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 20px;
                margin: 20px 0;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            `;
            
            panel.innerHTML = `
                <h4 style="margin-top: 0; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">🔍</span>
                    <span>提交记录筛选器</span>
                    <span style="font-size: 12px; opacity: 0.8; margin-left: auto;">v1.0.0</span>
                </h4>
                <div style="display: flex; gap: 20px; flex-wrap: wrap; align-items: end;">
                    <div style="flex: 1; min-width: 180px;">
                        <div style="margin-bottom: 8px; font-size: 14px; opacity: 0.9;">状态筛选</div>
                        <select id="luogu-status-filter" style="width: 100%; padding: 10px; border-radius: 6px; border: none; background: rgba(255, 255, 255, 0.9);">
                            <option value="all">全部状态</option>
                            <option value="AC" style="color: #52c41a;">✅ Accepted</option>
                            <option value="WA" style="color: #f5222d;">❌ Wrong Answer</option>
                            <option value="TLE" style="color: #fa8c16;">⏱️ Time Limit Exceeded</option>
                            <option value="MLE" style="color: #722ed1;">💾 Memory Limit Exceeded</option>
                            <option value="RE" style="color: #eb2f96;">💥 Runtime Error</option>
                            <option value="CE" style="color: #faad14;">📝 Compile Error</option>
                        </select>
                    </div>
                    
                    <div style="flex: 1; min-width: 180px;">
                        <div style="margin-bottom: 8px; font-size: 14px; opacity: 0.9;">语言筛选</div>
                        <select id="luogu-language-filter" style="width: 100%; padding: 10px; border-radius: 6px; border: none; background: rgba(255, 255, 255, 0.9);">
                            <option value="all">全部语言</option>
                            <option value="cpp">C++</option>
                            <option value="c">C</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="pascal">Pascal</option>
                            <option value="go">Go</option>
                        </select>
                    </div>
                    
                    <div style="flex: 2; min-width: 250px;">
                        <div style="margin-bottom: 8px; font-size: 14px; opacity: 0.9;">题目筛选</div>
                        <input type="text" id="luogu-problem-filter" 
                               placeholder="输入题目ID，如：P1001" 
                               style="width: 100%; padding: 10px; border-radius: 6px; border: none; background: rgba(255, 255, 255, 0.9);">
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button id="luogu-apply-filter" style="padding: 10px 20px; border-radius: 6px; border: none; background: #1890ff; color: white; cursor: pointer; font-weight: bold;">
                            应用筛选
                        </button>
                        <button id="luogu-reset-filter" style="padding: 10px 20px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.3); background: transparent; color: white; cursor: pointer;">
                            重置
                        </button>
                    </div>
                </div>
                
                <div id="luogu-filter-stats" style="margin-top: 15px; font-size: 13px; opacity: 0.8; display: none;">
                    显示 <span id="luogu-visible-count">0</span> / <span id="luogu-total-count">0</span> 条记录
                </div>
            `;
            
            // 插入到页面中合适的位置
            const target = document.querySelector('.content-header, .main, .record-list, .wrapper') || 
                          document.querySelector('body');
            
            if (target) {
                const header = target.querySelector('h1, h2, .title');
                if (header) {
                    header.parentNode.insertBefore(panel, header.nextElementSibling);
                } else {
                    target.insertBefore(panel, target.firstChild);
                }
                
                // 绑定事件
                this.bindEvents();
            }
        }
        
        bindEvents() {
            document.getElementById('luogu-apply-filter').addEventListener('click', () => this.updateFilters());
            document.getElementById('luogu-reset-filter').addEventListener('click', () => this.resetFilters());
            
            // 输入框回车触发筛选
            document.getElementById('luogu-problem-filter').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.updateFilters();
            });
            
            // 下拉框变更自动筛选（可选）
            document.getElementById('luogu-status-filter').addEventListener('change', () => this.updateFilters());
            document.getElementById('luogu-language-filter').addEventListener('change', () => this.updateFilters());
        }
        
        updateFilters() {
            this.filters.status = document.getElementById('luogu-status-filter').value;
            this.filters.language = document.getElementById('luogu-language-filter').value;
            this.filters.problem = document.getElementById('luogu-problem-filter').value.trim();
            
            this.applyFilters();
            this.updateStats();
            
            // 保存筛选条件到本地存储
            try {
                localStorage.setItem('luogu-filter-settings', JSON.stringify(this.filters));
            } catch (e) {
                console.log('本地存储失败:', e);
            }
        }
        
        resetFilters() {
            document.getElementById('luogu-status-filter').value = 'all';
            document.getElementById('luogu-language-filter').value = 'all';
            document.getElementById('luogu-problem-filter').value = '';
            
            this.filters = { status: 'all', language: 'all', problem: '' };
            this.applyFilters();
            this.updateStats();
            
            try {
                localStorage.removeItem('luogu-filter-settings');
            } catch (e) {
                // 忽略错误
            }
        }
        
        applyFilters() {
            const submissions = this.getSubmissionElements();
            let visibleCount = 0;
            
            submissions.forEach(row => {
                let show = true;
                
                // 状态筛选
                if (this.filters.status !== 'all') {
                    const statusEl = row.querySelector(this.selectors.status);
                    if (statusEl && !statusEl.textContent.includes(this.filters.status)) {
                        show = false;
                    }
                }
                
                // 语言筛选
                if (this.filters.language !== 'all') {
                    const languageEl = row.querySelector(this.selectors.language);
                    if (languageEl) {
                        const languageText = languageEl.textContent.toLowerCase();
                        if (!languageText.includes(this.filters.language.toLowerCase())) {
                            show = false;
                        }
                    }
                }
                
                // 题目筛选
                if (this.filters.problem) {
                    const problemEl = row.querySelector(this.selectors.problem);
                    if (problemEl) {
                        const problemText = problemEl.textContent;
                        if (!problemText.includes(this.filters.problem)) {
                            show = false;
                        }
                    }
                }
                
                if (show) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });
            
            // 更新统计信息
            const statsEl = document.getElementById('luogu-filter-stats');
            if (statsEl) {
                statsEl.style.display = 'block';
                document.getElementById('luogu-visible-count').textContent = visibleCount;
                document.getElementById('luogu-total-count').textContent = submissions.length;
            }
        }
        
        getSubmissionElements() {
            // 尝试多种选择器获取提交记录行
            let submissions = document.querySelectorAll(this.selectors.submissionRow);
            
            if (submissions.length === 0) {
                // 备用选择器：表格中的行
                submissions = document.querySelectorAll('table tr:has(td)');
            }
            
            return Array.from(submissions);
        }
        
        updateStats() {
            const submissions = this.getSubmissionElements();
            const visible = submissions.filter(row => row.style.display !== 'none').length;
            
            const statsEl = document.getElementById('luogu-filter-stats');
            if (statsEl) {
                statsEl.style.display = 'block';
                document.getElementById('luogu-visible-count').textContent = visible;
                document.getElementById('luogu-total-count').textContent = submissions.length;
            }
        }
        
        observeDOMChanges() {
            // 监听DOM变化，当有新记录加载时重新应用筛选
            const observer = new MutationObserver(() => {
                if (this.getSubmissionElements().length > 0) {
                    this.applyFilters();
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        
        // 从本地存储加载设置
        loadSettings() {
            try {
                const saved = localStorage.getItem('luogu-filter-settings');
                if (saved) {
                    this.filters = JSON.parse(saved);
                    
                    // 更新UI
                    if (document.getElementById('luogu-status-filter')) {
                        document.getElementById('luogu-status-filter').value = this.filters.status;
                        document.getElementById('luogu-language-filter').value = this.filters.language;
                        document.getElementById('luogu-problem-filter').value = this.filters.problem;
                        
                        // 应用保存的筛选条件
                        setTimeout(() => {
                            this.applyFilters();
                            this.updateStats();
                        }, 500);
                    }
                }
            } catch (e) {
                console.log('加载设置失败:', e);
            }
        }
    }
    
    // 主入口
    function main() {
        if (!isSubmissionPage()) return;
        
        // 延迟初始化，确保页面完全加载
        setTimeout(() => {
            const filter = new LuoguSubmissionFilter();
            
            // 加载保存的设置
            setTimeout(() => filter.loadSettings(), 1000);
            
            // 监听页面切换（如翻页）
            window.addEventListener('popstate', () => {
                setTimeout(() => {
                    if (isSubmissionPage()) {
                        filter.init();
                    }
                }, 300);
            });
        }, 1000);
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
    
})();
