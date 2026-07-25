# Weather Station

A real-time weather dashboard with a glassmorphic UI, dynamic weather-based theming, and instrument-style gauges for humidity, wind, feels-like temperature, and pressure.

![Made with HTML, CSS, JS](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS-blue)

## Features

- 🔍 **City search** — look up current weather for any city, with Enter-to-search support
- 🎛️ **Instrument gauges** — humidity, wind, feels-like, and pressure render as animated dial rings instead of plain numbers
- 🎨 **Dynamic theming** — the background gradient and accent color shift based on the actual condition returned (clear day/night, clouds, rain, thunderstorm, snow, mist)
- ⚠️ **Actionable error messages** — clear title + hint instead of a generic alert
- 🕓 **Live date/time clock** in the header, updated every 30s
- 📱 **Responsive** — adapts down to mobile screens

## Getting Started

1. Clone or download this folder
2. Open `index.html` in a browser — no build step required
3. Search for a city (e.g. `Tokyo`, `New York`, `Nadiad`)

## Project Structure

```
weather-app/
├── index.html    # Markup and page structure
├── style.css     # Design system, theming, gauges, responsive layout
├── script.js     # Weather API calls, gauge/theme logic, UI state
└── README.md
```

## API

Weather data is fetched from the [OpenWeather API](https://openweathermap.org/api) (Current Weather Data endpoint):

```
https://api.openweathermap.org/data/2.5/weather?q={city}&appid={apiKey}&units=metric
```

To use your own API key, replace the `apiKey` value at the top of `script.js`:

```js
const apiKey = "YOUR_API_KEY_HERE";
```

## Gauge Scaling

Each gauge maps a real-world range onto its ring, so the fill is meaningful at a glance:

| Metric      | Range mapped to 0–100% |
|-------------|--------------------------|
| Humidity    | 0–100%                  |
| Wind speed  | 0–20 m/s                |
| Feels like  | -20°C to 40°C           |
| Pressure    | 970–1050 hPa            |

## Credits

Made by **Astha Ankola**
