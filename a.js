// 筛选提交记录
class LuoguSubmissionFilter {
  constructor() {
    this.filters = {
      status: 'all',
      language: 'all',
      problem: ''
    };
    
    this.init();
  }
  
  init() {
    this.createFilterPanel();
    this.applyFilters();
  }
  
  createFilterPanel() {
    const panel = document.createElement('div');
    panel.style.cssText = `
      background: #f8f9fa;
      padding: 15px;
      margin: 15px 0;
      border-radius: 8px;
      border: 1px solid #ddd;
    `;
    
    panel.innerHTML = `
      <h4 style="margin-top: 0">提交记录筛选</h4>
      <div style="display: flex; gap: 15px; flex-wrap: wrap;">
        <div>
          <label>状态：</label>
          <select id="status-filter">
            <option value="all">全部</option>
            <option value="AC">Accepted</option>
            <option value="WA">Wrong Answer</option>
            <option value="TLE">Time Limit Exceeded</option>
            <option value="MLE">Memory Limit Exceeded</option>
            <option value="RE">Runtime Error</option>
          </select>
        </div>
        <div>
          <label>语言：</label>
          <select id="language-filter">
            <option value="all">全部</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>
        <div>
          <label>题目：</label>
          <input type="text" id="problem-filter" placeholder="输入题目ID">
        </div>
        <button id="apply-filter">应用筛选</button>
        <button id="reset-filter">重置</button>
      </div>
    `;
    
    const target = document.querySelector('.submission-list')?.parentElement;
    if (target) {
      target.insertBefore(panel, target.firstChild);
      
      document.getElementById('apply-filter').addEventListener('click', () => {
        this.filters.status = document.getElementById('status-filter').value;
        this.filters.language = document.getElementById('language-filter').value;
        this.filters.problem = document.getElementById('problem-filter').value;
        this.applyFilters();
      });
      
      document.getElementById('reset-filter').addEventListener('click', () => {
        document.getElementById('status-filter').value = 'all';
        document.getElementById('language-filter').value = 'all';
        document.getElementById('problem-filter').value = '';
        this.filters = { status: 'all', language: 'all', problem: '' };
        this.applyFilters();
      });
    }
  }
  
  applyFilters() {
    const submissions = document.querySelectorAll('.submission-row');
    
    submissions.forEach(row => {
      let show = true;
      
      // 状态筛选
      if (this.filters.status !== 'all') {
        const status = row.querySelector('.status').textContent;
        if (!status.includes(this.filters.status)) show = false;
      }
      
      // 语言筛选
      if (this.filters.language !== 'all') {
        const language = row.querySelector('.language').textContent;
        if (!language.toLowerCase().includes(this.filters.language)) show = false;
      }
      
      // 题目筛选
      if (this.filters.problem) {
        const problem = row.querySelector('.problem').textContent;
        if (!problem.includes(this.filters.problem)) show = false;
      }
      
      row.style.display = show ? '' : 'none';
    });
  }
}

// 使用
new LuoguSubmissionFilter();
