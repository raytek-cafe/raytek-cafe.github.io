const themes = [
  "theme-red",
  "theme-orange",
  "theme-yellow",
  "theme-green",
  "theme-aquamarine",
  "theme-blue",
  "theme-violet",
  "theme-pink",
  "theme-gray",
]; // List of available themes
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

// Get the current script's directory
const scriptPath = document.currentScript.src; // Get the path of the currently executing script
const scriptDir = scriptPath.substring(0, scriptPath.lastIndexOf("/") + 1); // Extract the directory path from the script path

// Header background image changer on 10 clicks
document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");
  if (!header) return;

  let clickCount = 0;
  const images = [
    scriptDir + "../styles/img/header-bg.jpg", // original
    scriptDir + "../styles/img/header-bg-alt1.jpg",
    scriptDir + "../styles/img/header-bg-alt2.jpg",
  ];

  // Load persisted image index or default to 0
  let currentImage = parseInt(localStorage.getItem("headerImageIndex")) || 0;

  // Set initial background on page load
  header.style.background = `linear-gradient(to right, black 200px, transparent 70%), url("${images[currentImage]}") no-repeat center 35%`;
  header.style.backgroundSize = "cover"; // Ensure the background covers the header

  header.addEventListener("click", function () {
    clickCount++;
    if (clickCount === 10) {
      // Cycle to next image
      currentImage = (currentImage + 1) % images.length;
      header.style.background = `linear-gradient(to right, black 200px, transparent 70%), url("${images[currentImage]}") no-repeat center 35%`;
      header.style.backgroundSize = "cover"; // Ensure the background covers the header
      localStorage.setItem("headerImageIndex", currentImage); // Persist selection
      clickCount = 0;
    }
  });
});
