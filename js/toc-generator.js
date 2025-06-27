// 文章目录生成器（仅对文章页生效）
document.addEventListener('DOMContentLoaded', function() {
  // 检测文章容器和目录容器
  const articleContent = document.querySelector('.article-content');
  const rightSidebar = document.querySelector('.right-sidebar');
  
  // 仅在文章页执行（同时存在文章内容和右侧栏时）
  if (!articleContent || !rightSidebar) return;

  // 创建目录容器（如果不存在）
  let tocContainer = rightSidebar.querySelector('.toc-container');
  if (!tocContainer) {
    tocContainer = document.createElement('div');
    tocContainer.className = 'toc-container';
    tocContainer.innerHTML = '<h3 class="toc-title">文章目录</h3><ul class="toc-list"></ul>';
    rightSidebar.insertBefore(tocContainer, rightSidebar.firstChild);
  }

  const tocList = tocContainer.querySelector('.toc-list');
  
  // 获取所有标题元素（支持多级）
  const headings = articleContent.querySelectorAll('h2, h3, h4');
  if (headings.length === 0) {
    tocContainer.style.display = 'none'; // 没有标题时隐藏目录
    return;
  }

  // 生成目录
  tocList.innerHTML = '';
  headings.forEach((heading, index) => {
    // 确保标题有ID
    const id = heading.id || `section-${index}`;
    heading.id = id;

    // 创建目录项
    const listItem = document.createElement('li');
    listItem.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
    
    const link = document.createElement('a');
    link.href = `#${id}`;
    link.textContent = heading.textContent;
    link.className = 'toc-link';
    
    listItem.appendChild(link);
    tocList.appendChild(listItem);
  });

  // 平滑滚动效果
  tocList.addEventListener('click', function(e) {
    if (e.target.classList.contains('toc-link')) {
      e.preventDefault();
      const target = document.querySelector(e.target.getAttribute('href'));
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });

  // 滚动高亮当前章节
  window.addEventListener('scroll', function() {
    const fromTop = window.scrollY + 100;
    
    headings.forEach(heading => {
      const section = document.querySelector(`#${heading.id}`);
      if (
        section.offsetTop <= fromTop &&
        section.offsetTop + section.offsetHeight > fromTop
      ) {
        tocList.querySelectorAll('.toc-link').forEach(link => {
          link.classList.remove('active');
        });
        tocList.querySelector(`a[href="#${heading.id}"]`).classList.add('active');
      }
    });
  });
});