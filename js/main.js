// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  const themeButton = document.getElementById('theme-toggle');
  let isDarkMode = false;

  themeButton.addEventListener('click', function() {
    const body = document.body;
    
    if (isDarkMode) {
      body.classList.remove('dark-mode');
      themeButton.textContent = '切换为深色模式';
    } else {
      body.classList.add('dark-mode');
      themeButton.textContent = '切换为浅色模式';
    }
    
    isDarkMode = !isDarkMode;
  });
});