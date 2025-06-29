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
    rightSidebar.appendChild(tocContainer);
    
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
  // 滚动高亮当前章节（优化版）
  let lastActive = null;

  const highlightSection = () => {
    let activeHeading = null;
    const scrollThreshold = 100; // 视口顶部偏移量
    
    // 1. 找到当前激活的标题
    for (const heading of headings) {
      const section = document.getElementById(heading.id);
      const rect = section.getBoundingClientRect();
      
      if (rect.top <= scrollThreshold && rect.bottom > 0) {
        activeHeading = heading;
        break;
      }
    }

    // 2. 如果找到激活标题且不同于上次
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
        
        // 3. 自动滚动到激活项（核心代码）
        const scrollWrapper = document.querySelector('.toc-scroll-wrapper');
        const wrapperRect = scrollWrapper.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        
        // 计算需要滚动的距离
        const scrollPosition = linkRect.top - wrapperRect.top + scrollWrapper.scrollTop;
        const middlePosition = scrollPosition - (wrapperRect.height / 2) + (linkRect.height / 2);
        
        // 平滑滚动
        scrollWrapper.scrollTo({
          top: middlePosition,
          behavior: 'smooth'
        });
      }
    }
  };

  // 使用防抖优化性能
  const debounce = (func, wait) => {
    let timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  };

  // 初始化执行一次
  highlightSection();
  
  // 监听滚动事件
  window.addEventListener('scroll', debounce(highlightSection, 20));
});