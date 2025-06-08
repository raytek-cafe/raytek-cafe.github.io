const themes = ["theme-red", "theme-blue", "theme-green", "theme-violet"];
// "theme-red" is now the default

function getCurrentThemeIndex() {
  // Get the current theme index
  const current = localStorage.getItem("theme") || "theme-red"; // Default to "theme-red" if no theme is set
  return themes.indexOf(current); // Return the index of the current theme
}

function setTheme(idx) {
  // Set the theme based on the index
  themes.forEach((t) => t && document.documentElement.classList.remove(t)); // Remove all theme classes from the document element
  if (themes[idx]) document.documentElement.classList.add(themes[idx]); // Add the new theme class to the document element
  localStorage.setItem("theme", themes[idx]); // Save the current theme to localStorage
}

// Restore theme on page load
const savedTheme = localStorage.getItem("theme") || "theme-red"; // Default to "theme-red" if no theme is saved
setTheme(themes.indexOf(savedTheme)); // Set the theme based on the saved theme

// Theme toggle button
document.addEventListener("DOMContentLoaded", function () {
  // Ensure the DOM is fully loaded before attaching the event listener
  const toggleBtn = document.getElementById("theme-toggle"); // Get the theme toggle button by its ID
  if (toggleBtn) {
    // Check if the toggle button exists
    toggleBtn.onclick = function () {
      // Attach a click event listener to the toggle button
      let idx = getCurrentThemeIndex(); // Get the current theme index
      idx = (idx + 1) % themes.length; // Increment the index and wrap around if it exceeds the number of themes
      setTheme(idx); // Set the new theme based on the updated index
    };
  }
});
