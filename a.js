// ==UserScript==
// @name         洛谷智能学习助手
// @namespace    https://github.com/dengmuyang/luogu
// @version      1.0.0
// @description  分析你的提交记录，提供个性化刷题建议和弱点分析
// @author       dengmuyang
// @match        https://www.luogu.com.cn/record/list*
// @match        https://www.luogu.com.cn/user*
// @match        https://www.luogu.com.cn/problem/list*
// @icon         https://www.luogu.com.cn/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @connect      www.luogu.com.cn
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    
    // 添加样式
    GM_addStyle(`
        .luogu-smart-panel {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            margin: 25px 0;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .smart-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            font-size: 22px;
            font-weight: bold;
        }
        
        .smart-header .ai-icon {
            font-size: 28px;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .recommendation-card {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 15px;
            border-left: 5px solid #52c41a;
            transition: transform 0.3s;
        }
        
        .recommendation-card:hover {
            transform: translateY(-3px);
            background: rgba(255, 255, 255, 0.2);
        }
        
        .rec-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .rec-content {
            font-size: 14px;
            line-height: 1.6;
            opacity: 0.9;
        }
        
        .rec-tags {
            display: flex;
            gap: 8px;
            margin-top: 12px;
            flex-wrap: wrap;
        }
        
        .rec-tag {
            background: rgba(255, 255, 255, 0.2);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
        }
        
        .progress-bar {
            height: 8px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            margin: 10px 0;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #52c41a, #1890ff);
            border-radius: 4px;
            transition: width 1s ease;
        }
        
        .action-button {
            background: #1890ff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            margin-top: 15px;
            transition: background 0.3s;
        }
        
        .action-button:hover {
            background: #096dd9;
        }
        
        .weakness-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            margin-bottom: 8px;
        }
    `);
    
    class LuoguSmartAssistant {
        constructor() {
            this.userData = {
                submissions: [],
                problems: new Set(),
                weaknesses: {},
                stats: {}
            };
            this.init();
        }
        
        async init() {
            await this.loadUserData();
            this.createSmartPanel();
            this.analyzeData();
        }
        
        async loadUserData() {
            // 从页面提取用户提交记录
            this.extractSubmissions();
            
            // 尝试获取更多数据（如果可能）
            await this.fetchAdditionalData();
        }
        
        extractSubmissions() {
            // 从当前页面提取提交记录
            const rows = document.querySelectorAll('.record-row, [data-record-id]');
            
            rows.forEach(row => {
                try {
                    const statusEl = row.querySelector('.status, .record-status');
                    const problemEl = row.querySelector('.problem a, .record-problem a');
                    const languageEl = row.querySelector('.language, .record-language');
                    
                    if (statusEl && problemEl) {
                        const submission = {
                            status: statusEl.textContent.trim(),
                            problemId: problemEl.textContent.trim(),
                            problemUrl: problemEl.href,
                            language: languageEl ? languageEl.textContent.trim() : 'Unknown',
                            time: new Date().toISOString() // 实际应该从页面提取时间
                        };
                        
                        this.userData.submissions.push(submission);
                        this.userData.problems.add(submission.problemId);
                        
                        // 统计弱点
                        if (submission.status.includes('WA') || 
                            submission.status.includes('TLE') || 
                            submission.status.includes('RE')) {
                            
                            const problemType = this.guessProblemType(submission.problemId);
                            if (!this.userData.weaknesses[problemType]) {
                                this.userData.weaknesses[problemType] = 0;
                            }
                            this.userData.weaknesses[problemType]++;
                        }
                    }
                } catch (e) {
                    console.log('提取提交记录出错:', e);
                }
            });
        }
        
        guessProblemType(problemId) {
            // 根据题目ID猜测题目类型（简化版）
            const patterns = {
                'P': '基础题',
                'B': '入门题',
                'T': '模板题',
                'U': '提高题',
                'CF': 'Codeforces风格',
                'AT': 'AtCoder风格'
            };
            
            for (const [prefix, type] of Object.entries(patterns)) {
                if (problemId.startsWith(prefix)) {
                    return type;
                }
            }
            
            // 根据数字范围猜测
            const num = parseInt(problemId.replace(/\D/g, ''));
            if (num < 2000) return '基础算法';
            if (num < 4000) return '数据结构';
            if (num < 6000) return '动态规划';
            return '综合题';
        }
        
        async fetchAdditionalData() {
            // 这里可以扩展：调用洛谷API获取更多用户数据
            // 由于跨域限制，实际实现可能需要代理或浏览器扩展权限
        }
        
        analyzeData() {
            // 分析数据并生成洞察
            const stats = this.userData.stats;
            
            // 计算AC率
            const total = this.userData.submissions.length;
            const acCount = this.userData.submissions.filter(s => s.status.includes('AC')).length;
            stats.acRate = total > 0 ? (acCount / total * 100).toFixed(1) : 0;
            
            // 找出最常见的错误类型
            const weaknesses = Object.entries(this.userData.weaknesses)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);
            stats.topWeaknesses = weaknesses;
            
            // 语言使用统计
            const langStats = {};
            this.userData.submissions.forEach(s => {
                const lang = s.language;
                langStats[lang] = (langStats[lang] || 0) + 1;
            });
            stats.languageStats = langStats;
            
            // 活跃时段分析（简化）
            const now = new Date();
            stats.suggestedTime = now.getHours() < 12 ? '上午' : '下午';
        }
        
        createSmartPanel() {
            // 创建智能推荐面板
            const panel = document.createElement('div');
            panel.className = 'luogu-smart-panel';
            panel.innerHTML = `
                <div class="smart-header">
                    <span class="ai-icon">🤖</span>
                    <span>洛谷智能学习助手</span>
                </div>
                <div id="smart-recommendations"></div>
            `;
            
            // 插入到页面合适位置
            const container = document.querySelector('.main, .wrapper, .content') || document.body;
            if (container) {
                const firstChild = container.firstChild;
                container.insertBefore(panel, firstChild);
                
                // 延迟显示推荐内容
                setTimeout(() => this.showRecommendations(), 500);
            }
        }
        
        showRecommendations() {
            const container = document.getElementById('smart-recommendations');
            if (!container) return;
            
            const recommendations = this.generateRecommendations();
            
            container.innerHTML = recommendations.map(rec => `
                <div class="recommendation-card">
                    <div class="rec-title">
                        ${rec.icon} ${rec.title}
                    </div>
                    <div class="rec-content">
                        ${rec.content}
                    </div>
                    ${rec.progress ? `
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${rec.progress}%"></div>
                        </div>
                        <div style="font-size: 12px; text-align: right;">${rec.progress}% 掌握度</div>
                    ` : ''}
                    ${rec.tags ? `
                        <div class="rec-tags">
                            ${rec.tags.map(tag => `<span class="rec-tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                    ${rec.action ? `
                        <button class="action-button" onclick="${rec.action}">
                            ${rec.actionText || '立即行动'}
                        </button>
                    ` : ''}
                </div>
            `).join('');
        }
        
        generateRecommendations() {
            const stats = this.userData.stats;
            const recs = [];
            
            // 推荐1：弱点专项训练
            if (stats.topWeaknesses && stats.topWeaknesses.length > 0) {
                const [weakType, count] = stats.topWeaknesses[0];
                recs.push({
                    icon: '🎯',
                    title: '专项突破建议',
                    content: `你在<strong>${weakType}</strong>类题目上已有${count}次错误提交，建议集中练习此类题目。`,
                    tags: ['弱点分析', '专项训练'],
                    action: 'window.open("https://www.luogu.com.cn/problem/list?type=' + encodeURIComponent(weakType) + '")',
                    actionText: '练习相关题目'
                });
            }
            
            // 推荐2：AC率提升
            recs.push({
                icon: '📈',
                title: 'AC率分析',
                content: `当前AC率：<strong>${stats.acRate}%</strong>。${this.getAcRateAdvice(stats.acRate)}`,
                progress: Math.min(stats.acRate, 100),
                tags: ['数据分析', '效率提升']
            });
            
            // 推荐3：题目推荐
            const nextProblem = this.recommendNextProblem();
            recs.push({
                icon: '🚀',
                title: '今日推荐题目',
                content: nextProblem.reason,
                tags: ['智能推荐', nextProblem.difficulty],
                action: `window.open("${nextProblem.url}")`,
                actionText: '开始挑战'
            });
            
            // 推荐4：学习时间建议
            recs.push({
                icon: '⏰',
                title: '最佳学习时段',
                content: `根据你的活跃模式，建议在<strong>${stats.suggestedTime}</strong>进行刷题训练，此时注意力更集中。`,
                tags: ['时间管理', '效率']
            });
            
            // 推荐5：语言优化
            if (Object.keys(stats.languageStats || {}).length > 0) {
                const bestLang = Object.entries(stats.languageStats)
                    .sort((a, b) => b[1] - a[1])[0];
                
                if (bestLang) {
                    recs.push({
                        icon: '💻',
                        title: '编程语言分析',
                        content: `你最擅长的语言是<strong>${bestLang[0]}</strong>（使用${bestLang[1]}次）。保持优势！`,
                        tags: ['语言分析', bestLang[0]]
                    });
                }
            }
            
            return recs;
        }
        
        getAcRateAdvice(rate) {
            if (rate < 30) return '建议从简单题开始，注重代码正确性而非速度。';
            if (rate < 50) return '不错的起点！尝试中等难度题目，提升解题思维。';
            if (rate < 70) return '表现良好！可以挑战更多动态规划和图论题目。';
            if (rate < 85) return '优秀！考虑参加比赛检验实战能力。';
            return '大神级别！可以尝试出题或帮助他人。';
        }
        
        recommendNextProblem() {
            // 智能推荐下一道题目（简化逻辑）
            const solved = Array.from(this.userData.problems);
            let difficulty = '普及-';
            let reason = '';
            
            if (solved.length < 20) {
                difficulty = '入门';
                reason = '你正处于起步阶段，建议巩固基础算法。';
            } else if (solved.length < 50) {
                difficulty = '普及-';
                reason = '基础已掌握，可以尝试更复杂的数据结构题目。';
            } else {
                difficulty = '普及/提高-';
                reason = '具备一定实力，挑战动态规划等进阶算法吧！';
            }
            
            // 实际中这里应该调用洛谷API获取具体题目
            // 现在返回一个示例题目
            return {
                url: 'https://www.luogu.com.cn/problem/P1001',
                reason: reason,
                difficulty: difficulty
            };
        }
        
        // 高级功能：生成学习报告
        generateLearningReport() {
            return {
                date: new Date().toLocaleDateString(),
                totalSubmissions: this.userData.submissions.length,
                uniqueProblems: this.userData.problems.size,
                acRate: this.userData.stats.acRate,
                weaknesses: this.userData.stats.topWeaknesses,
                recommendations: this.generateRecommendations()
            };
        }
    }
    
    // 主程序
    function initSmartAssistant() {
        // 等待页面加载
        setTimeout(() => {
            try {
                new LuoguSmartAssistant();
                console.log('洛谷智能助手已启动');
                
                // 添加一个按钮到页面，可以手动刷新分析
                const refreshBtn = document.createElement('button');
                refreshBtn.textContent = '🔄 重新分析';
                refreshBtn.style.cssText = `
                    position: fixed;
                    bottom: 80px;
                    right: 20px;
                    z-index: 9999;
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 12px;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
                `;
                refreshBtn.onclick = () => {
                    document.querySelector('.luogu-smart-panel')?.remove();
                    new LuoguSmartAssistant();
                };
                document.body.appendChild(refreshBtn);
                
            } catch (error) {
                console.error('智能助手初始化失败:', error);
            }
        }, 2000);
    }
    
    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSmartAssistant);
    } else {
        initSmartAssistant();
    }
    
})();
