// List of available themes
const themes = [
  "theme-red",
  "theme-orange",
  "theme-yellow",
  "theme-lime",
  "theme-mint",
  "theme-cyan",
  "theme-blue",
  "theme-violet",
  "theme-pink",
  "theme-gray",
]; // "theme-red" is now the default

// Get the current theme index from localStorage or default
function getCurrentThemeIndex() {
  const current = localStorage.getItem("theme") || "theme-red"; // Get current theme or default
  return themes.indexOf(current); // Return the index of the current theme
}

// Set the theme based on the index
function setTheme(idx) {
  themes.forEach((t) => t && document.documentElement.classList.remove(t)); // Remove all theme classes from the document element
  if (themes[idx]) document.documentElement.classList.add(themes[idx]); // Add the new theme class to the document element
  localStorage.setItem("theme", themes[idx]); // Save the current theme to localStorage
}

// Restore theme on page load
const savedTheme = localStorage.getItem("theme") || "theme-red"; // Default to "theme-red" if no theme is saved
setTheme(themes.indexOf(savedTheme)); // Set the theme based on the saved theme

// ========== Theme toggle button logic with rainbow mode activation and animated theme variables ============== //
document.addEventListener("DOMContentLoaded", function () {
  // Ensure the DOM is fully loaded before executing this code
  const toggleBtn = document.getElementById("theme-toggle"); // Get the theme toggle button by its ID
  if (toggleBtn) {
    // Check if the toggle button exists
    let clickTimes = []; // Array to store timestamps of recent clicks
    let rainbowActive = false; // Track if rainbow mode is active
    let rainbowTimeout = null; // Timeout for rainbow mode

    function activateRainbowMode() {
      // Function to activate rainbow mode
      if (rainbowActive) return; // If rainbow mode is already active, do nothing
      rainbowActive = true; // Set rainbow mode to active
      document.body.classList.add("rainbow-theme"); // Add rainbow-theme to body
      rainbowTimeout = setTimeout(() => {
        // Set a timeout to remove rainbow mode after 30 seconds
        document.body.classList.remove("rainbow-theme"); // Remove after 5 seconds
        rainbowActive = false; // Set rainbow mode to inactive
      }, 30000); // 30 seconds
    }

    toggleBtn.onclick = function () {
      // Attach a click event listener to the toggle button
      const now = Date.now(); // Get the current timestamp
      clickTimes.push(now); // Add the current timestamp to the clickTimes array
      // Keep only clicks in the last 1.2 seconds
      clickTimes = clickTimes.filter((t) => now - t < 1200); // Filter out clicks older than 1.2 seconds

      // If 7 or more clicks in 1.2 seconds, activate rainbow mode
      if (clickTimes.length >= 7) {
        // If there are 7 or more clicks in the last 1.2 seconds
        activateRainbowMode(); // Activate rainbow mode
        clickTimes = []; // Reset clickTimes to prevent repeated activation
        return; // Exit the function to prevent normal theme change
      }

      if (!rainbowActive) {
        // If rainbow mode is not active, proceed with normal theme change
        let idx = getCurrentThemeIndex(); // Get the current theme index
        idx = (idx + 1) % themes.length; // Increment the index and wrap around if it exceeds the number of themes
        setTheme(idx); // Set the new theme based on the updated index
      }
    };
  }
});

// ====== Subtitle randomizer and toggler with persistence, loading subtitles from external files ============== //
document.addEventListener("DOMContentLoaded", function () {
  const subtitle = document.querySelector(".subtitle"); // Get the subtitle element
  if (!subtitle) return; // Exit if subtitle element does not exist

  // Helper to fetch and parse subtitles from a text file (one per line)
  function fetchSubtitles(url) {
    return fetch(url) // Fetch the file at the given URL
      .then((res) => res.text()) // Get the text content
      .then(
        (text) =>
          text
            .split("\n") // Split into lines
            .map((line) => line.trim()) // Trim whitespace
            .filter(Boolean) // Remove empty lines
      );
  }

  // Load all three sets, then initialize logic
  Promise.all([
    fetchSubtitles("../scripts/subtitles-normal.txt"), // Load normal subtitles
    fetchSubtitles("../scripts/subtitles-alt.txt"), // Load alt subtitles
    fetchSubtitles("../scripts/subtitles-meme.txt"), // Load meme subtitles
  ]).then(([normalSubtitles, altSubtitles, memeSubtitles]) => {
    // 0 = normal, 1 = alt, 2 = meme
    let mode = parseInt(localStorage.getItem("subtitleMode")); // Get mode from localStorage
    if (![0, 1, 2].includes(mode)) mode = 0; // Default to normal if invalid
    let subtitles = [normalSubtitles, altSubtitles, memeSubtitles][mode]; // Select current set
    let lastIdx = parseInt(localStorage.getItem("subtitleLastIdx")); // Get last subtitle index
    if (isNaN(lastIdx)) lastIdx = -1; // Default if not set

    // Function to set a random subtitle, avoiding repeats
    function setRandomSubtitle() {
      let idx;
      do {
        idx = Math.floor(Math.random() * subtitles.length); // Pick a random index
      } while (subtitles.length > 1 && idx === lastIdx); // Avoid repeating the last one
      subtitle.textContent = subtitles[idx]; // Set the subtitle text
      lastIdx = idx; // Update last index
      localStorage.setItem("subtitleLastIdx", idx); // Persist last index
    }
    setRandomSubtitle(); // Set initial subtitle

    // Click handler for toggling subtitle sets
    subtitle.addEventListener("click", function (e) {
      if (e.ctrlKey) {
        // Meme mode if Ctrl is held
        mode = 2;
      } else {
        // Toggle between normal and alt
        mode = mode === 1 ? 0 : 1;
      }
      localStorage.setItem("subtitleMode", mode); // Persist mode
      subtitles = [normalSubtitles, altSubtitles, memeSubtitles][mode]; // Update current set
      setRandomSubtitle(); // Set new random subtitle
    });
  });
});

// ============================================================== Header Background Image Changer ============== //
// This script changes the header background image after 10 clicks on the header-right element.

// Get the current script's directory for relative image paths
const scriptPath = document.currentScript.src; // Get the path of the currently executing script
const scriptDir = scriptPath.substring(0, scriptPath.lastIndexOf("/") + 1); // Extract the directory path from the script path

// Header background image changer on 10 clicks
document.addEventListener("DOMContentLoaded", function () {
  const headerRight = document.querySelector(".header-right"); // Get the header-right element
  if (!headerRight) return; // Exit if the header-right element does not exist
  const header = document.querySelector(".header"); // Get the header element
  if (!header) return; // Exit if the header element does not exist

  let clickCount = 0; // Initialize click count to 0

  const images = [
    scriptDir + "../styles/img/header-bg.jpg", // original image
    scriptDir + "../styles/img/header-bg-alt1.jpg", // alternative 1
    scriptDir + "../styles/img/header-bg-alt2.jpg", // alternative 2
    scriptDir + "../styles/img/header-bg-alt3.jpg", // alternative 3
  ];

  let currentImage = 0; // Always start from the first image on refresh

  headerRight.addEventListener("click", function () {
    clickCount++; // Increment the click count
    if (clickCount === 10) {
      // If clicked 10 times
      currentImage = (currentImage + 1) % images.length; // Cycle to next image
      header.style.background = `linear-gradient(to right, black 200px, transparent 70%), url("${images[currentImage]}") no-repeat center 35%`; // Set header background
      header.style.backgroundSize = "cover"; // Ensure the background covers the header
      clickCount = 0; // Reset click count after changing the image
    }
  });
});
