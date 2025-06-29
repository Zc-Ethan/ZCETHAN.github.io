document.addEventListener('DOMContentLoaded', function() {
  // 拦截链接点击
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (isValidLink(link)) {
      e.preventDefault();
      transitionToPage(link.href);
    }
  });

  // 初始加载动画 - 仅对主要内容应用
  const main = document.querySelector('main') || document.querySelector('.card-section');
  if(main) main.classList.add('page-enter');
});

function isValidLink(link) {  // 排除目录导航链接
  if (link && link.dataset.tocNavigation === 'true') return false;
  if (link && (link.hasAttribute('download') || link.href.match(/\.(zip|rar|7z|tar|gz|exe|pdf|docx?|xlsx?|pptx?|mp3|mp4|avi|mov|wmv|flv|mkv|apk|dmg|iso)(\?|#|$)/i))) return false;
  return link && 
         link.href && 
         !link.hasAttribute('target') && 
         link.href.startsWith(window.location.origin);
}

function transitionToPage(url) {
  // 创建覆盖层 - 仅覆盖可滚动内容区域
  const overlay = document.createElement('div');
  overlay.className = 'page-overlay';
  document.body.appendChild(overlay);

  // 仅对主要内容应用退出动画
  const main = document.querySelector('main') || document.querySelector('.card-section');
  if(main) {
    main.classList.add('page-exit');
    
    // 确保固定定位元素不受影响
    const fixedElements = document.querySelectorAll('.left-sidebar, .right-sidebar, #theme-toggle');
    fixedElements.forEach(el => {
      el.style.pointerEvents = 'none'; // 防止过渡期间交互
    });
  }

  // 延迟跳转
  setTimeout(() => {
    window.location.href = url;
  }, 500);
}