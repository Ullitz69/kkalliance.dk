// Auto-detect and set base path for GitHub Pages
(function setupBase() {
  let basePath = '/';
  
  // Check if we're on GitHub Pages with a repo path
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  
  // If URL is https://username.github.io/repo-name/, use /repo-name/
  if (pathParts.length > 0 && !pathParts[0].includes('.github.io')) {
    basePath = '/' + pathParts[0] + '/';
  }
  
  // Create and insert base tag at the very beginning of head
  const base = document.createElement('base');
  base.href = basePath;
  document.head.insertBefore(base, document.head.firstChild);
  
  // Store globally for JavaScript use
  window.APP_BASE = basePath;
})();
