// 为代码块添加复制按钮
class LuoguCodeCopy {
  constructor() {
    this.addCopyButtons();
  }
  
  addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach((codeBlock, index) => {
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      
      const copyBtn = document.createElement('button');
      copyBtn.textContent = '复制';
      copyBtn.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        background: #3498db;
        color: white;
        border: none;
        padding: 4px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        opacity: 0.8;
        transition: opacity 0.2s;
      `;
      
      copyBtn.addEventListener('mouseenter', () => {
        copyBtn.style.opacity = '1';
      });
      
      copyBtn.addEventListener('mouseleave', () => {
        copyBtn.style.opacity = '0.8';
      });
      
      copyBtn.addEventListener('click', () => {
        const code = codeBlock.textContent;
        navigator.clipboard.writeText(code)
          .then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '已复制!';
            copyBtn.style.background = '#2ecc71';
            
            setTimeout(() => {
              copyBtn.textContent = originalText;
              copyBtn.style.background = '#3498db';
            }, 2000);
          })
          .catch(err => {
            console.error('复制失败:', err);
            copyBtn.textContent = '复制失败';
            copyBtn.style.background = '#e74c3c';
          });
      });
      
      codeBlock.parentNode.insertBefore(wrapper, codeBlock);
      wrapper.appendChild(codeBlock);
      wrapper.appendChild(copyBtn);
    });
  }
}

// 使用
new LuoguCodeCopy();
