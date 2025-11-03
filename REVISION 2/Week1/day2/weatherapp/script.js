const WEATHER_API_KEY = "43cd3cbb46a70d2e5f5709bc4ad5c964";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const forecastBtn = document.getElementById("forecastBtn");
const weatherDiv = document.getElementById("weather");

let map;
let marker;
let currentCity = "";

function initMap(lat = 0, lon = 0) {
  const location = { lat, lng: lon };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: location,
  });
  marker = new google.maps.Marker({ position: location, map: map });
}

// Convert UNIX timestamp to local time
function formatTime(unixTime, timezoneOffset) {
  const date = new Date((unixTime + timezoneOffset) * 1000);
  return date.toUTCString().split(" ")[4];
}

// Fetch weather using coordinates
async function fetchWeather(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
  );
  const data = await res.json();
  displayWeather(data);
}

// Fetch weather by city name
async function fetchWeatherByCity(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`
    );
    const data = await res.json();

    if (data.cod === 200) {
      displayWeather(data);
      const { lat, lon } = data.coord;
      currentCity = data.name;
      updateMap(lat, lon);
    } else {
      weatherDiv.innerHTML = `<p>City not found!</p>`;
    }
  } catch (error) {
    weatherDiv.innerHTML = `<p>Error fetching data</p>`;
  }
}

function displayWeather(data) {
  const timezoneOffset = data.timezone;
  weatherDiv.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="https://openweathermap.org/img/wn/${
      data.weather[0].icon
    }@2x.png" alt="${data.weather[0].main}">
    <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
    <p><strong>Condition:</strong> ${data.weather[0].description}</p>
    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
    <p><strong>Sunrise:</strong> ${formatTime(
      data.sys.sunrise,
      timezoneOffset
    )}</p>
    <p><strong>Sunset:</strong> ${formatTime(
      data.sys.sunset,
      timezoneOffset
    )}</p>
  `;
}

function updateMap(lat, lon) {
  const location = { lat, lng: lon };
  map.setCenter(location);
  map.setZoom(8);
  marker.setPosition(location);
}

// Geolocation
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeather(latitude, longitude);
      initMap(latitude, longitude);
    },
    () => {
      initMap(0, 0);
      weatherDiv.innerHTML = `<p>Location access denied. Search for a city manually.</p>`;
    }
  );
} else {
  weatherDiv.innerHTML = `<p>Geolocation not supported. Search for a city manually.</p>`;
}

// Event listeners
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeatherByCity(city);
});

cityInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) fetchWeatherByCity(city);
  }
});

forecastBtn.addEventListener("click", () => {
  if (currentCity) {
    window.location.href = `forecast.html?city=${currentCity}`;
  } else {
    alert("Search for a city first!");
  }
});
