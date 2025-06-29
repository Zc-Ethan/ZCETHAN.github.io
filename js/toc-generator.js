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
  tocContainer.innerHTML = `
    <h3 class="toc-title">目录</h3>
    <div class="toc-scroll-wrapper">
      <ul class="toc-list"></ul>
    </div>
  `;
  rightSidebar.insertBefore(tocContainer, rightSidebar.firstChild);
    
    // 添加动态高度调整（可选）
    const updateTocHeight = () => {
      const viewportHeight = window.innerHeight;
      const headerHeight = document.querySelector('header').offsetHeight;
      tocContainer.style.maxHeight = `calc(${viewportHeight}px - ${headerHeight}px - 40px)`;
    };
    
    window.addEventListener('resize', updateTocHeight);
    updateTocHeight();
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
      e.stopImmediatePropagation();
      e.target.dataset.tocNavigation = 'true';
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      history.pushState(null, null, e.target.getAttribute('href'));
    }
  });

  // 滚动高亮当前章节（优化版）
  let lastActive = null; // 缓存上次高亮的标题

  window.addEventListener('scroll', function() {
    const scrollThreshold = 100; // 视口顶部区域阈值
    const scrollPosition = window.scrollY;
    let activeHeading = null;

    // 查找第一个进入视口顶部区域的标题
    for (const heading of headings) {
      const section = document.getElementById(heading.id);
      const rect = section.getBoundingClientRect();
      
      if (rect.top <= scrollThreshold && rect.bottom > 0) {
        activeHeading = heading;
        break; // 找到第一个符合条件的就停止
      }
    }

    // 避免频繁DOM操作
    if (activeHeading && activeHeading !== lastActive) {
      // 移除所有高亮
      tocList.querySelectorAll('.toc-link').forEach(link => {
        link.classList.remove('active');
      });
      
      // 添加新高亮
      const activeLink = tocList.querySelector(`a[href="#${activeHeading.id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
        lastActive = activeHeading;
      }
    }
  });function debounce(func, wait) {
    let timeout;
    return function() {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  }

  window.addEventListener('scroll', debounce(highlightSection, 50));
});