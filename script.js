// Define your API key as a constant variable
const apiKey = 'c4cd227ed7784f89a5e112230240504';

// Add an event listener to the search button
document.getElementById('searchBtn').addEventListener('click', () => {
  // Get the city input value
  const city = document.getElementById('cityInput').value;

  // Fetch weather data from WeatherAPI using the apiKey variable
  fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
      // Get the container where current weather information will be displayed
      const currentWeatherContainer = document.getElementById('weatherInfo');

      // Clear previous weather information
      currentWeatherContainer.innerHTML = '';

      // Create a heading for current weather
      const currentWeatherHeading = document.createElement('h2');
      currentWeatherHeading.textContent = 'Current Weather';
      currentWeatherContainer.appendChild(currentWeatherHeading);

      // Create separate cards for each piece of weather information
      const temperatureCard = createWeatherCard('Temperature', `${data.current.temp_c}°C`, 'thermometer-half');
      const feelsLikeCard = createWeatherCard('Feels Like', `${data.current.feelslike_c}°C`, 'thermometer-half');
      const humidityCard = createWeatherCard('Humidity', `${data.current.humidity}%`, 'tint');
      const windSpeedCard = createWeatherCard('Wind Speed', `${data.current.wind_kph} km/h`, 'wind');
      const windDirectionCard = createWeatherCard('Wind Direction', data.current.wind_dir, 'compass');
      const conditionCard = createWeatherCard('Condition', data.current.condition.text, data.current.condition.icon);
      const visibilityCard = createWeatherCard('Visibility', `${data.current.vis_km} km`, 'eye');
      const cloudCoverCard = createWeatherCard('Cloud Cover', `${data.current.cloud}%`, 'cloud');
      const precipitationCard = createWeatherCard('Precipitation', `${data.current.precip_mm} mm`, 'cloud-showers-heavy');
      const lastUpdatedCard = createWeatherCard('Last Updated', data.current.last_updated, 'clock');
      const sunriseCard = data.forecast ? createWeatherCard('Sunrise', data.forecast.forecastday[0].astro.sunrise, 'sun') : createWeatherCard('Sunrise', 'N/A', 'sun');
      const sunsetCard = data.forecast ? createWeatherCard('Sunset', data.forecast.forecastday[0].astro.sunset, 'moon') : createWeatherCard('Sunset', 'N/A', 'moon');

      // Append all weather cards to the current weather container
      currentWeatherContainer.appendChild(temperatureCard);
      currentWeatherContainer.appendChild(feelsLikeCard);
      currentWeatherContainer.appendChild(humidityCard);
      currentWeatherContainer.appendChild(windSpeedCard);
      currentWeatherContainer.appendChild(windDirectionCard);
      currentWeatherContainer.appendChild(conditionCard);
      currentWeatherContainer.appendChild(visibilityCard);
      currentWeatherContainer.appendChild(cloudCoverCard);
      currentWeatherContainer.appendChild(precipitationCard);
      currentWeatherContainer.appendChild(sunriseCard);
      currentWeatherContainer.appendChild(sunsetCard);
      currentWeatherContainer.appendChild(lastUpdatedCard);
    })
    .catch(error => console.log('Error fetching weather data:', error)); // Log any errors to the console

  // Fetch 24-hour forecast data from WeatherAPI using the same apiKey variable
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1`)
    .then(response => response.json()) // Parse the JSON response
    .then(forecastData => {
      // Get the container for 24-hour forecast
      const forecast24HoursContainer = document.getElementById('forecast24Hours');

      // Clear previous 24-hour forecast information
      forecast24HoursContainer.innerHTML = '';

      // Add heading for 24-hour forecast
      const forecast24HoursHeading = document.createElement('h2');
      forecast24HoursHeading.textContent = '24-Hour Forecast';
      forecast24HoursContainer.appendChild(forecast24HoursHeading);

      // Display 24-hour forecast
      const forecast24Hours = forecastData.forecast ? forecastData.forecast.forecastday[0].hour : [];
      forecast24Hours.forEach(hour => {
        const time = hour.time.substr(11, 5);
        const temperature = createForecastCard('Temperature', `${hour.temp_c}°C`, 'thermometer-half');
        const condition = createForecastCard('Condition', hour.condition.text, hour.condition.icon);
        const forecastItem = createForecastItem(time, [temperature, condition]);
        forecast24HoursContainer.appendChild(forecastItem);
      });
    })
    .catch(error => console.log('Error fetching 24-hour forecast data:', error)); // Log any errors to the console

  // Fetch 3-day forecast data from WeatherAPI using the same apiKey variable
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`)
    .then(response => response.json()) // Parse the JSON response
    .then(forecastData => {
      // Get the container for 3-day forecast
      const forecast3DaysContainer = document.getElementById('forecast3Days');

      // Clear previous 3-day forecast information
      forecast3DaysContainer.innerHTML = '';

      // Add heading for 3-day forecast
      const forecast3DaysHeading = document.createElement('h2');
      forecast3DaysHeading.textContent = '3-Day Forecast';
      forecast3DaysContainer.appendChild(forecast3DaysHeading);

      // Display 3-day forecast
      const forecast3Days = forecastData.forecast ? forecastData.forecast.forecastday : [];
      forecast3Days.forEach(day => {
        const date = new Date(day.date);
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleString('en-GB', options);
        const maxTemp = createForecastCard('Max Temp', `${day.day.maxtemp_c}°C`, 'thermometer-half');
        const minTemp = createForecastCard('Min Temp', `${day.day.mintemp_c}°C`, 'thermometer-half');
        const condition = createForecastCard('Condition', day.day.condition.text, day.day.condition.icon);
        const forecastItem = createForecastItem(formattedDate, [maxTemp, minTemp, condition]);
        forecast3DaysContainer.appendChild(forecastItem);
      });
    })
    .catch(error => console.log('Error fetching 3-day forecast data:', error)); // Log any errors to the console
});

// Function to create a weather card with given title, content, and icon
function createWeatherCard(title, content, iconClass) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
        <h3><i class="fas fa-${iconClass}"></i> ${title}</h3>
        <p>${content}</p>
    `;
  return card;
}

// Function to create a forecast card with given title, content, and icon
function createForecastCard(title, content, iconClass) {
  return `<p><i class="fas fa-${iconClass}"></i> ${title}: ${content}</p>`;
}

// Function to create a forecast item with time and forecast cards
function createForecastItem(time, forecastCards) {
  const forecastItem = document.createElement('div');
  forecastItem.classList.add('forecast-item');
  forecastItem.innerHTML = `
        <h3>${time}</h3>
        ${forecastCards.join('')}
    `;
  return forecastItem;
}
