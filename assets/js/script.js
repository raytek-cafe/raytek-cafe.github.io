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
  const toggleBtn = document.getElementById("theme-switcher"); // Get the theme toggle button by its ID
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

// ====== Tagline randomizer and toggler with persistence, loading taglines from external files ============== //
document.addEventListener("DOMContentLoaded", function () {
  const tagline = document.querySelector(".tagline"); // Get the tagline element
  if (!tagline) return; // Exit if tagline element does not exist

  // Helper to fetch and parse taglines from a text file (one per line)
  function fetchTaglines(url) {
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
    fetchTaglines("/assets/taglines/taglines-normal.txt"), // Load normal taglines
    fetchTaglines("/assets/taglines/taglines-alt.txt"), // Load alt taglines
    fetchTaglines("/assets/taglines/taglines-meme.txt"), // Load meme taglines
  ]).then(([normalTaglines, altTaglines, memeTaglines]) => {
    // 0 = normal, 1 = alt, 2 = meme
    let mode = parseInt(localStorage.getItem("taglineMode")); // Get mode from localStorage
    if (![0, 1, 2].includes(mode)) mode = 0; // Default to normal if invalid
    let taglines = [normalTaglines, altTaglines, memeTaglines][mode]; // Select current set
    let lastIdx = parseInt(localStorage.getItem("taglineLastIdx")); // Get last tagline index
    if (isNaN(lastIdx)) lastIdx = -1; // Default if not set

    // Function to set a random tagline, avoiding repeats
    function setRandomTagline() {
      let idx;
      do {
        idx = Math.floor(Math.random() * taglines.length); // Pick a random index
      } while (taglines.length > 1 && idx === lastIdx); // Avoid repeating the last one
      tagline.textContent = taglines[idx]; // Set the tagline text
      lastIdx = idx; // Update last index
      localStorage.setItem("taglineLastIdx", idx); // Persist last index
    }
    setRandomTagline(); // Set initial tagline

    // --- Long press detection for meme mode ---
    let pressTimer = null;
    let longPressTriggered = false;

    // Desktop: mouse long press
    tagline.addEventListener("mousedown", function () {
      longPressTriggered = false;
      pressTimer = setTimeout(() => {
        longPressTriggered = true;
        mode = 2;
        localStorage.setItem("taglineMode", mode);
        taglines = [normalTaglines, altTaglines, memeTaglines][mode];
        setRandomTagline();
      }, 600);
    });
    tagline.addEventListener("mouseup", function () {
      clearTimeout(pressTimer);
    });
    tagline.addEventListener("mouseleave", function () {
      clearTimeout(pressTimer);
    });

    // Mobile: touch long press
    tagline.addEventListener("touchstart", function () {
      longPressTriggered = false;
      pressTimer = setTimeout(() => {
        longPressTriggered = true;
        mode = 2;
        localStorage.setItem("taglineMode", mode);
        taglines = [normalTaglines, altTaglines, memeTaglines][mode];
        setRandomTagline();
      }, 600);
    });
    tagline.addEventListener("touchend", function () {
      clearTimeout(pressTimer);
    });
    tagline.addEventListener("touchcancel", function () {
      clearTimeout(pressTimer);
    });

    // Click handler for toggling tagline sets (normal/alt)
    tagline.addEventListener("click", function (e) {
      if (longPressTriggered) {
        // If long press was triggered, skip normal click logic
        return;
      }
      // Toggle between normal and alt
      mode = mode === 1 ? 0 : 1;
      localStorage.setItem("taglineMode", mode);
      taglines = [normalTaglines, altTaglines, memeTaglines][mode];
      setRandomTagline();
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
    "/assets/images/css/header-bg.jpg", // original image
    "/assets/images/css/header-bg-alt1.jpg", // alternative 1
    "/assets/images/css/header-bg-alt2.jpg", // alternative 2
    "/assets/images/css/header-bg-alt3.jpg", // alternative 3
  ];

  const glassPath = "/assets/images/css/glass.png";

  let currentImage = 0; // Always start from the first image on refresh

  headerRight.addEventListener("click", function () {
    clickCount++; // Increment the click count
    if (clickCount === 10) {
      // If clicked 10 times
      currentImage = (currentImage + 1) % images.length; // Cycle to next image
      // header.style.background = `linear-gradient(to right, #0a0a0a 200px, transparent 70%), url("${images[currentImage]}") no-repeat center 35%`; // Set header background
      header.style.background = `url("${glassPath}") no-repeat 35%, linear-gradient(to right, #0a0a0a 310px, transparent 90%), url("${images[currentImage]}") no-repeat center 35%`;
      header.style.backgroundSize = "cover, cover, cover"
      clickCount = 0; // Reset click count after changing the image
    }
  });
});

// ============================================================= Audio Player
const audio = document.getElementById("audio");
const playPause = document.getElementById("play-pause");
const seekbar = document.getElementById("seekbar");

// Play/Pause toggle
playPause.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playPause.textContent = "⏸";
  } else {
    audio.pause();
    playPause.textContent = "⏵";
  }
});

// Update seekbar as audio plays
audio.addEventListener("timeupdate", () => {
  seekbar.value = (audio.currentTime / audio.duration) * 100 || 0;
});

// Seek when user drags seekbar
seekbar.addEventListener("input", () => {
  audio.currentTime = (seekbar.value / 100) * audio.duration;
});

// Get the volume slider element
const volumeSlider = document.getElementById("volume-slider");

// Set initial volume (optional, 0.5 = 50%)
if (volumeSlider) {
  audio.volume = volumeSlider.value / 100;

  // Update audio volume when slider changes
  volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value / 100;
  });
}

// Set initial volume (0.3 = 30%)
if (volumeSlider) {
  audio.volume = 0.3;
  volumeSlider.value = 30;

  // Update audio volume when slider changes
  volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value / 100;
  });
}

// Reset button text when audio ends
audio.addEventListener("ended", () => {
  playPause.textContent = "⏵";
});

seekbar.addEventListener("input", function () {
  const percent = (seekbar.value / seekbar.max) * 100;
  seekbar.style.setProperty("--seekbar-progress", percent + "%");
});

// Set initial value on page load
seekbar.dispatchEvent(new Event("input"));

// Update seekbar as audio plays
audio.addEventListener("timeupdate", () => {
  seekbar.value = (audio.currentTime / audio.duration) * 100 || 0;

  // Also update the CSS variable for progress colorization
  const percent = (seekbar.value / seekbar.max) * 100;
  seekbar.style.setProperty("--seekbar-progress", percent + "%");
});

if (volumeSlider) {
  // Set initial value
  const setVolumeProgress = () => {
    const percent = (volumeSlider.value / volumeSlider.max) * 100;
    volumeSlider.style.setProperty("--volume-progress", percent + "%");
  };
  setVolumeProgress();

  // Update on input
  volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value / 100;
    setVolumeProgress();
  });

  // Allow scrolling on the volume slider to change volume
  volumeSlider.addEventListener("wheel", (e) => {
    e.preventDefault();
    // Change by 2 units per scroll (adjust as needed)
    let newValue = parseInt(volumeSlider.value, 10) + (e.deltaY < 0 ? 5 : -5);
    newValue = Math.max(0, Math.min(100, newValue));
    volumeSlider.value = newValue;
    audio.volume = newValue / 100;
    localStorage.setItem("audioVolume", audio.volume);
    setVolumeProgress();
  });
}

// Restore audio progress from localStorage (if available)
const savedAudioTime = parseFloat(localStorage.getItem("audioCurrentTime"));
if (!isNaN(savedAudioTime)) {
  audio.currentTime = savedAudioTime;
}

// Save audio progress to localStorage as the song plays
audio.addEventListener("timeupdate", () => {
  localStorage.setItem("audioCurrentTime", audio.currentTime);
  seekbar.value = (audio.currentTime / audio.duration) * 100 || 0;
  // Also update the CSS variable for progress colorization
  const percent = (seekbar.value / seekbar.max) * 100;
  seekbar.style.setProperty("--seekbar-progress", percent + "%");
});

// Optional: Clear progress when song ends
audio.addEventListener("ended", () => {
  playPause.textContent = "⏵";
  localStorage.removeItem("audioCurrentTime");
});

// Restore volume from localStorage (if available)
if (volumeSlider) {
  const savedVolume = parseFloat(localStorage.getItem("audioVolume"));
  if (!isNaN(savedVolume)) {
    audio.volume = savedVolume;
    volumeSlider.value = Math.round(savedVolume * 100);
  } else {
    audio.volume = 0.3;
    volumeSlider.value = 30;
  }

  // Update audio volume and save to localStorage when slider changes
  volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value / 100;
    localStorage.setItem("audioVolume", audio.volume);
    setVolumeProgress();
  });
}
