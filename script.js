// ============================
// OpenWeather API Key
// ============================
const apiKey = "YOUR_API_KEY";

// ============================
// Selecting HTML Elements
// ============================

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const temperature = document.getElementById("temperature");
const cityName = document.getElementById("cityName");
const weatherCondition = document.getElementById("weatherCondition");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const pressure = document.getElementById("pressure");

const weatherIcon = document.getElementById("weatherIcon");

const humidityGauge = document.getElementById("humidityGauge");
const windGauge = document.getElementById("windGauge");
const feelsLikeGauge = document.getElementById("feelsLikeGauge");
const pressureGauge = document.getElementById("pressureGauge");

const skeleton = document.querySelector(".skeleton");
const errorBox = document.querySelector(".error");
const errorTitle = document.getElementById("errorTitle");
const errorHint = document.getElementById("errorHint");

const weatherMain = document.querySelector(".weather-main");
const weatherDetails = document.querySelector(".weather-details");

const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const lastUpdated = document.getElementById("lastUpdated");

const GAUGE_CIRCUMFERENCE = 263.9;

// ============================
// Live Date / Time
// ============================

function updateClock() {
    const now = new Date();

    dateEl.innerText = now.toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    timeEl.innerText = now.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    });
}

updateClock();
setInterval(updateClock, 30000);

// ============================
// UI State Helpers
// ============================

function showSkeleton() {
    skeleton.classList.add("active");
    errorBox.classList.remove("active");
    weatherMain.classList.remove("active");
    weatherDetails.classList.remove("active");
}

function showError(title, hint) {
    skeleton.classList.remove("active");
    errorBox.classList.add("active");
    weatherMain.classList.remove("active");
    weatherDetails.classList.remove("active");

    errorTitle.innerText = title;
    errorHint.innerText = hint;
}

function showWeather() {
    skeleton.classList.remove("active");
    errorBox.classList.remove("active");
    weatherMain.classList.add("active");
    weatherDetails.classList.add("active");
}

// Maps a 0-1 ratio onto a gauge's stroke-dashoffset
function setGauge(el, ratio) {
    const clamped = Math.max(0, Math.min(1, ratio));
    el.style.strokeDashoffset = GAUGE_CIRCUMFERENCE * (1 - clamped);
}

// Groups OpenWeather's condition codes into a theme key used by the CSS
function themeFor(weatherMainCode, icon) {
    const isNight = icon && icon.endsWith("n");

    switch (weatherMainCode) {
        case "Clear":
            return isNight ? "clear-night" : "clear-day";
        case "Clouds":
            return "clouds";
        case "Rain":
        case "Drizzle":
            return "rain";
        case "Thunderstorm":
            return "thunderstorm";
        case "Snow":
            return "snow";
        case "Mist":
        case "Fog":
        case "Haze":
        case "Smoke":
            return "mist";
        default:
            return "default";
    }
}

// ============================
// Get Weather Function
// ============================

async function getWeather(city) {

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    showSkeleton();

    try {

        const response = await fetch(url);
        const data = await response.json();

        if (data.cod != 200) {
            showError("City not found", "Check the spelling and try again.");
            return;
        }

        // Text content
        cityName.innerText = `${data.name}${data.sys?.country ? ", " + data.sys.country : ""}`;
        temperature.innerText = `${Math.round(data.main.temp)}°C`;
        weatherCondition.innerText = data.weather[0].description;

        humidity.innerText = `${data.main.humidity}%`;
        wind.innerText = `${data.wind.speed} m/s`;
        feelsLike.innerText = `${Math.round(data.main.feels_like)}°C`;
        pressure.innerText = `${data.main.pressure} hPa`;

        // Icon
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIcon.alt = data.weather[0].description;

        // Gauges (each scaled to a sensible real-world range)
        setGauge(humidityGauge, data.main.humidity / 100);
        setGauge(windGauge, data.wind.speed / 20);              // 0-20 m/s
        setGauge(feelsLikeGauge, (data.main.feels_like + 20) / 60); // -20..40°C
        setGauge(pressureGauge, (data.main.pressure - 970) / 80);   // 970-1050 hPa

        // Theme
        document.body.dataset.weather = themeFor(data.weather[0].main, data.weather[0].icon);

        lastUpdated.innerText = `Last updated : ${new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`;

        showWeather();

    }
    catch (err) {
        console.error(err);
        showError("Something went wrong", "Check your connection and try again.");
    }

}

// ============================
// Search Button
// ============================

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city === "") {
        showError("Enter a city", "Type a city name to search the weather.");
        cityInput.focus();
        return;
    }

    getWeather(city);

});

// ============================
// Press Enter to Search
// ============================

cityInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        searchBtn.click();
    }

});