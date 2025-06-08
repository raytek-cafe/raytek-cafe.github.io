const themes = ["theme-red", "theme-blue", "theme-green", "theme-violet"];
// "theme-red" is now the default

function getCurrentThemeIndex() {
  const current = localStorage.getItem("theme") || "theme-red";
  return themes.indexOf(current);
}

function setTheme(idx) {
  // Remove all theme classes
  themes.forEach((t) => t && document.documentElement.classList.remove(t));
  // Add new theme class if not default
  if (themes[idx]) document.documentElement.classList.add(themes[idx]);
  localStorage.setItem("theme", themes[idx]);
}

// Restore theme on page load
const savedTheme = localStorage.getItem("theme") || "theme-red";
setTheme(themes.indexOf(savedTheme));

// Theme toggle button
document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) {
    toggleBtn.onclick = function () {
      let idx = getCurrentThemeIndex();
      idx = (idx + 1) % themes.length;
      setTheme(idx);
    };
  }
});