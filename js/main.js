document.addEventListener('DOMContentLoaded', function() {
  const themeButton = document.getElementById('theme-toggle');
  
  // 从 localStorage 读取主题状态（默认为浅色）
  let isDarkMode = localStorage.getItem('darkMode') === 'true';

  // 初始化主题
  updateTheme();

  themeButton.addEventListener('click', function() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode); // 存储状态
    updateTheme();
  });

  function updateTheme() {
    const body = document.body;
    
    if (isDarkMode) {
      body.classList.add('dark-mode');
      themeButton.textContent = '切换为浅色模式';
    } else {
      body.classList.remove('dark-mode');
      themeButton.textContent = '切换为深色模式';
    }
  }
});