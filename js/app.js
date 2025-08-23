// Bara Weather PWA
// Fonts: Vazirmatn (fa), Poppins (en)
// Colors: skybrand, white/silver, softgreen
// API: Open-Meteo (no key)

let deferredPrompt = null;

// Theme
const themeToggle = () => {
  const root = document.documentElement;
  const isDark = root.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  document.getElementById('iconSun').classList.toggle('hidden', !isDark);
  document.getElementById('iconMoon').classList.toggle('hidden', isDark);
};
const initTheme = () => {
  const saved = localStorage.getItem('theme');
  const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefers)) document.documentElement.classList.add('dark');
  document.getElementById('iconSun').classList.toggle('hidden', !document.documentElement.classList.contains('dark'));
  document.getElementById('iconMoon').classList.toggle('hidden', document.documentElement.classList.contains('dark'));
};

// PWA Install
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('btnInstall');
  btn.classList.remove('hidden');
  btn.addEventListener('click', async () => {
    btn.classList.add('hidden');
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  }, { once: true });
});

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js'));
}

// Elements
const el = (id) => document.getElementById(id);
const resultsBox = el('searchResults');

// Simple weather code to text mapping
const weatherCodeMap = {
  0: 'صاف', 1: 'اکثراً صاف', 2: 'کمی ابری', 3: 'ابری',
  45: 'مه', 48: 'مه یخ‌زده',
  51: 'نم‌نم باران', 53: 'باران سبک', 55: 'باران',
  61: 'بارش خفیف', 63: 'بارش متوسط', 65: 'بارش شدید',
  71: 'برف سبک', 73: 'برف', 75: 'برف سنگین',
  80: 'رگبار خفیف', 81: 'رگبار', 82: 'رگبار شدید',
  95: 'توفان', 96: 'توفان با تگرگ', 99: 'توفان شدید با تگرگ'
};

// Fallback sample data (Tehran) so app works immediately
const sample = {
  name: 'تهران، ایران',
  latitude: 35.6892,
  longitude: 51.3890,
};

// Render helpers
function renderCurrent(data) {
  el('locationName').textContent = data.name;
  el('tempNow').textContent = Math.round(data.current_temperature) + '°';
  el('conditionText').textContent = weatherCodeMap[data.current_weather_code] || '—';
  el('humidity').textContent = (data.current_relative_humidity ?? '--') + '%';
  el('wind').textContent = (data.current_windspeed ?? '--') + ' km/h';
  el('sky').textContent = weatherCodeMap[data.current_weather_code] || '—';
  el('updatedAt').textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function renderHourly(hours) {
  const box = el('hourly');
  box.innerHTML = '';
  hours.slice(0, 24).forEach(h => {
    const item = document.createElement('div');
    item.className = 'min-w-[64px] rounded-2xl p-2 bg-silver dark:bg-gray-800 text-center';
    item.innerHTML = `<div class="text-xs text-gray-500">${new Date(h.time).toLocaleTimeString([], {hour:'2-digit'})}</div>
      <div class="text-lg font-bold">${Math.round(h.temp)}°</div>
      <div class="text-xs">${weatherCodeMap[h.code] || ''}</div>`;
    box.appendChild(item);
  });
}

function renderDaily(days) {
  const box = el('daily');
  box.innerHTML = '';
  days.slice(0, 7).forEach(d => {
    const item = document.createElement('div');
    item.className = 'rounded-2xl p-3 bg-silver dark:bg-gray-800 text-center';
    item.innerHTML = `<div class="text-sm font-semibold">${new Date(d.date).toLocaleDateString('fa-IR', {weekday:'short'})}</div>
      <div class="text-2xl font-extrabold">${Math.round(d.tmax)}°</div>
      <div class="text-xs text-gray-500">کمینه ${Math.round(d.tmin)}°</div>
      <div class="text-xs mt-1">${weatherCodeMap[d.code] || ''}</div>`;
    box.appendChild(item);
  });
}

// Fetch weather from Open-Meteo
async function fetchWeather(lat, lon, placeName) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: ['temperature_2m','relative_humidity_2m','wind_speed_10m','weather_code'].join(','),
    hourly: ['temperature_2m','weather_code'].join(','),
    daily: ['temperature_2m_max','temperature_2m_min','weather_code'].join(','),
    wind_speed_unit: 'kmh',
    timezone: 'auto'
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);
  const json = await res.json();
  // Normalize
  const data = {
    name: placeName,
    current_temperature: json.current?.temperature_2m,
    current_relative_humidity: json.current?.relative_humidity_2m,
    current_windspeed: json.current?.wind_speed_10m,
    current_weather_code: json.current?.weather_code,
    hourly: (json.hourly?.time || []).map((t, i) => ({
      time: t,
      temp: json.hourly.temperature_2m?.[i],
      code: json.hourly.weather_code?.[i]
    })),
    daily: (json.daily?.time || []).map((t, i) => ({
      date: t,
      tmax: json.daily.temperature_2m_max?.[i],
      tmin: json.daily.temperature_2m_min?.[i],
      code: json.daily.weather_code?.[i]
    }))
  };
  renderCurrent(data);
  renderHourly(data.hourly);
  renderDaily(data.daily);
}

// Geocoding via Open-Meteo
async function searchCity(q) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=fa&format=json`;
  const res = await fetch(url);
  const json = await res.json();
  return (json.results || []).map(item => ({
    name: `${item.name}${item.admin1 ? '، '+item.admin1:''}، ${item.country}`,
    lat: item.latitude,
    lon: item.longitude
  }));
}

// UI events
el('themeToggle').addEventListener('click', themeToggle);

el('btnSearch').addEventListener('click', async () => {
  const q = el('searchInput').value.trim();
  if (!q) return;
  resultsBox.innerHTML = '<div class="p-3 text-sm text-gray-500">در حال جستجو...</div>';
  resultsBox.classList.remove('hidden');
  try {
    const items = await searchCity(q);
    if (items.length === 0) {
      resultsBox.innerHTML = '<div class="p-3 text-sm text-gray-500">نتیجه‌ای یافت نشد.</div>';
      return;
    }
    resultsBox.innerHTML = items.map((it, idx) =>
      `<button data-idx="${idx}" class="w-full text-right px-3 py-2 hover:bg-silver dark:hover:bg-gray-800">${it.name}</button>`
    ).join('');
    resultsBox.querySelectorAll('button').forEach((btn, i) => {
      btn.addEventListener('click', async () => {
        const it = items[i];
        resultsBox.classList.add('hidden');
        await fetchWeather(it.lat, it.lon, it.name);
      });
    });
  } catch (e) {
    resultsBox.innerHTML = '<div class="p-3 text-sm text-red-500">خطا در جستجو.</div>';
  }
});

el('btnMyLoc').addEventListener('click', () => {
  if (!navigator.geolocation) return alert('GPS در دسترس نیست.');
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;
    await fetchWeather(latitude, longitude, 'موقعیت من');
  }, () => alert('عدم دسترسی به موقعیت.'));
});

// Initial load with sample data (Tehran) to work without changes
async function init() {
  initTheme();
  try {
    await fetchWeather(sample.latitude, sample.longitude, sample.name);
  } catch (e) {
    // If offline, render minimal placeholders
    renderCurrent({
      name: sample.name,
      current_temperature: 25,
      current_relative_humidity: 30,
      current_windspeed: 10,
      current_weather_code: 1
    });
    renderHourly(Array.from({length:24}).map((_,i)=>({time: Date.now()+i*3600000, temp: 25+i%3, code: 1})));
    renderDaily(Array.from({length:7}).map((_,i)=>({date: Date.now()+i*86400000, tmax: 30-i%5, tmin: 20-i%3, code: 2})));
  }
}
init();
