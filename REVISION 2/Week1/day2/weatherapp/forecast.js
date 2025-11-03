const WEATHER_API_KEY = "43cd3cbb46a70d2e5f5709bc4ad5c964";
const urlParams = new URLSearchParams(window.location.search);
const city = urlParams.get("city");
const forecastDiv = document.getElementById("forecast");

async function fetchForecast(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${WEATHER_API_KEY}`
    );
    const data = await res.json();

    if (data.cod === "200") {
      displayForecast(data);
    } else {
      forecastDiv.innerHTML = `<p>City not found!</p>`;
    }
  } catch (error) {
    forecastDiv.innerHTML = `<p>Error loading forecast</p>`;
  }
}

function displayForecast(data) {
  const daily = {};

  // Group by day (every 3-hour step)
  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!daily[date]) {
      daily[date] = [];
    }
    daily[date].push(item);
  });

  forecastDiv.innerHTML = "";

  Object.keys(daily)
    .slice(0, 5)
    .forEach((date) => {
      const dayData = daily[date];
      const temps = dayData.map((d) => d.main.temp);
      const minTemp = Math.min(...temps).toFixed(1);
      const maxTemp = Math.max(...temps).toFixed(1);
      const weather = dayData[0].weather[0];

      const div = document.createElement("div");
      div.classList.add("forecast-card");
      div.innerHTML = `
      <h3>${date}</h3>
      <img src="https://openweathermap.org/img/wn/${weather.icon}@2x.png" alt="${weather.main}">
      <p>${weather.main}</p>
      <p><strong>Min:</strong> ${minTemp}°C</p>
      <p><strong>Max:</strong> ${maxTemp}°C</p>
    `;
      forecastDiv.appendChild(div);
    });
}

fetchForecast(city);
