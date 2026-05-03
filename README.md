<p align="center">
  <img 
    src="https://raw.githubusercontent.com/MRThugh/MRThugh/main/badge.svg"
    width="50%" 
  />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="MIT License" />
  <img src="https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red.svg?style=for-the-badge" alt="Open Source" />
  <img src="https://img.shields.io/github/stars/MRThugh/bara-pwa?style=for-the-badge&color=yellow" alt="GitHub Stars" />
  <img src="https://img.shields.io/github/forks/MRThugh/bara-pwa?style=for-the-badge&color=orange" alt="GitHub Forks" />
  <img src="https://img.shields.io/github/last-commit/MRThugh/bara-pwa?style=for-the-badge&color=green" alt="Last Commit" />
  <img src="https://img.shields.io/github/repo-size/MRThugh/bara-pwa?style=for-the-badge&color=blueviolet" alt="Repo Size" />
  <img src="https://img.shields.io/badge/Language-JavaScript-f7df1e.svg?style=for-the-badge" alt="Language" />
  <img src="https://img.shields.io/badge/Maintained-Yes-success.svg?style=for-the-badge" alt="Maintained Status" />
</p>

<br />

# 🌬️ Bara (بَرا) – Weather, Beautifully Redefined

*Where atmospheric precision meets minimalist elegance; your silent companion in every storm and sunrise.*

---

## 📖 Table of Contents
- [About](#-about)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Usage Example](#-usage-example)
- [Tech Stack](#-tech-stack)
- [Contributing](#-contributing)
- [Credits & License](#-credits--license)

---

## 🌤️ About
Bara (بَرا) is a high-performance, mobile-first Progressive Web Application (PWA) designed to deliver real-time weather forecasts with uncompromising elegance. Built completely independent of heavy frameworks, it exists to provide users with an instant, distraction-free meteorological experience directly in their browsers. What makes Bara truly unique is its seamless fusion of an open-source weather API, local caching, and reliable offline-first capabilities through dedicated service workers.

---

## ✨ Features
- 📱 **Mobile-First Excellence:** Flawlessly responsive layout tailored perfectly for mobile, tablet, and desktop viewports.
- 🌍 **Intelligent Geolocation:** Instantly fetch local climate data or search global coordinates with zero latency.
- ⚡ **Offline-Ready PWA:** Installable directly to your home screen with robust Service Worker caching.
- 🌗 **Adaptive Themes:** Gorgeous dark and light modes that seamlessly respect user system preferences.
- 📊 **Granular Forecasting:** Comprehensive 24-hour horizontal timelines alongside detailed 7-day predictive grids.
- 🍃 **Featherweight Architecture:** Zero heavy frameworks, leveraging pure Vanilla JavaScript and CDN-based styling.

---

## 🚀 Getting Started
Deploying Bara locally is incredibly straightforward. No complex build steps, no API keys, no friction.

```bash
# Clone the repository
git clone https://github.com/MRThugh/bara-pwa.git

# Navigate into the project directory
cd bara-pwa

# Serve the project (using any static server, e.g., Live Server, Node, or Python)
npx serve .
# OR
python -m http.server 8000
```
*Once served, simply open the generated localhost link in your browser to experience the application.*

---

## 💡 Usage Example
Bara abstracts the complexity of working with geocoding and weather APIs into incredibly clean, functional JavaScript. Here is how the application seamlessly constructs endpoints and fetches localized weather data:

```javascript
// Effortlessly fetch and render real-time weather using Open-Meteo
async function fetchWeather(lat, lon, placeName) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    timezone: 'auto'
  });
  
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  const data = await response.json();
  
  renderCurrent({ name: placeName, ...data.current });
}
```

*_simple, fast, elegant._*

---

## ⚙️ Tech Stack
- 🏗️ **HTML5** – Semantic, accessible, and structured DOM.
- 🎨 **TailwindCSS** – Utility-first, scalable, and stunning UI styling.
- ⚡ **Vanilla JavaScript** – High-speed, framework-free business logic.
- ☁️ **Open-Meteo API** – Open-source, precise weather and geocoding endpoints.
- 📦 **PWA (Service Workers)** – Native caching, offline resilience, and seamless installability.

---

## 🤝 Contributing
Bara thrives on community innovation! Whether you're fixing a minor bug, expanding translation support, or proposing a groundbreaking new feature, your pull requests are warmly welcomed. Let's collaborate to make meteorological tracking more beautiful and accessible for everyone. Feel free to open an issue or fork the repository to start crafting your additions.

---

## 📄 Credits & License

This project is entirely **Open Source** and is licensed under the **MIT License**.

**Designed and Engineered by:**
- **Author:** Ali Kamrani
- **Title:** The Silent Architect
- **GitHub:** [https://github.com/MRThugh](https://github.com/MRThugh)

*Crafted with precision by The Silent Architect.*
