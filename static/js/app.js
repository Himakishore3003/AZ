class WeatherApp {
    constructor() {
        this.apiBaseUrl = window.location.origin;
        this.initializeElements();
        this.bindEvents();
        this.updateCurrentDate();
    }

    initializeElements() {
        // Input elements
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.locationBtn = document.getElementById('locationBtn');

        // Display elements
        this.loading = document.getElementById('loading');
        this.error = document.getElementById('error');
        this.errorMessage = document.getElementById('errorMessage');
        this.currentWeather = document.getElementById('currentWeather');
        this.forecast = document.getElementById('forecast');

        // Weather data elements
        this.cityName = document.getElementById('cityName');
        this.currentDate = document.getElementById('currentDate');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.currentTemp = document.getElementById('currentTemp');
        this.weatherDescription = document.getElementById('weatherDescription');
        this.feelsLike = document.getElementById('feelsLike');
        this.humidity = document.getElementById('humidity');
        this.pressure = document.getElementById('pressure');
        this.windSpeed = document.getElementById('windSpeed');
        this.forecastContainer = document.getElementById('forecastContainer');
    }

    bindEvents() {
        // Search button click
        this.searchBtn.addEventListener('click', () => {
            this.handleSearch();
        });

        // Enter key in search input
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Location button click
        this.locationBtn.addEventListener('click', () => {
            this.getUserLocation();
        });
    }

    updateCurrentDate() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        this.currentDate.textContent = now.toLocaleDateString('en-US', options);
    }

    handleSearch() {
        const city = this.cityInput.value.trim();
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }
        this.getWeatherData(city);
    }

    getUserLocation() {
        if (navigator.geolocation) {
            this.showLoading();
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.getWeatherByCoordinates(latitude, longitude);
                },
                (error) => {
                    this.hideLoading();
                    this.showError('Unable to get your location. Please search manually.');
                }
            );
        } else {
            this.showError('Geolocation is not supported by this browser');
        }
    }

    async getWeatherData(city) {
        this.showLoading();
        
        try {
            // Get current weather
            const currentWeatherResponse = await fetch(`${this.apiBaseUrl}/api/weather/current/${encodeURIComponent(city)}`);
            const currentWeatherData = await currentWeatherResponse.json();

            if (!currentWeatherData.success) {
                throw new Error(currentWeatherData.error);
            }

            // Get forecast
            const forecastResponse = await fetch(`${this.apiBaseUrl}/api/weather/forecast/${encodeURIComponent(city)}`);
            const forecastData = await forecastResponse.json();

            if (!forecastData.success) {
                throw new Error(forecastData.error);
            }

            this.hideLoading();
            this.displayCurrentWeather(currentWeatherData.data);
            this.displayForecast(forecastData.data.forecasts);

        } catch (error) {
            this.hideLoading();
            this.showError(error.message || 'Failed to fetch weather data');
        }
    }

    async getWeatherByCoordinates(lat, lon) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/weather/coordinates?lat=${lat}&lon=${lon}`);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error);
            }

            this.hideLoading();
            this.displayCurrentWeather(data.data);
            
            // Also get forecast for this location
            const city = data.data.city;
            this.getWeatherForecast(city);

        } catch (error) {
            this.hideLoading();
            this.showError(error.message || 'Failed to fetch weather data');
        }
    }

    async getWeatherForecast(city) {
        try {
            const forecastResponse = await fetch(`${this.apiBaseUrl}/api/weather/forecast/${encodeURIComponent(city)}`);
            const forecastData = await forecastResponse.json();

            if (forecastData.success) {
                this.displayForecast(forecastData.data.forecasts);
            }
        } catch (error) {
            console.error('Failed to fetch forecast:', error);
        }
    }

    displayCurrentWeather(data) {
        // Update city name
        this.cityName.textContent = `${data.city}, ${data.country}`;

        // Update weather icon
        this.weatherIcon.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
        this.weatherIcon.alt = data.description;

        // Update temperature
        this.currentTemp.textContent = Math.round(data.temperature);

        // Update description and feels like
        this.weatherDescription.textContent = data.description.charAt(0).toUpperCase() + data.description.slice(1);
        this.feelsLike.textContent = Math.round(data.feels_like);

        // Update weather stats
        this.humidity.textContent = `${data.humidity}%`;
        this.pressure.textContent = `${data.pressure} hPa`;
        this.windSpeed.textContent = `${data.wind_speed} m/s`;

        // Show current weather section
        this.currentWeather.classList.remove('hidden');
        this.hideError();
    }

    displayForecast(forecasts) {
        // Clear previous forecast
        this.forecastContainer.innerHTML = '';

        // Group forecasts by date (take one per day, preferably around noon)
        const dailyForecasts = this.groupForecastsByDay(forecasts);

        dailyForecasts.forEach(forecast => {
            const forecastCard = this.createForecastCard(forecast);
            this.forecastContainer.appendChild(forecastCard);
        });

        // Show forecast section
        this.forecast.classList.remove('hidden');
    }

    groupForecastsByDay(forecasts) {
        const dailyData = {};
        
        forecasts.forEach(forecast => {
            const date = forecast.date.split(' ')[0]; // Get date part only
            const hour = parseInt(forecast.date.split(' ')[1].split(':')[0]); // Get hour
            
            // Prefer forecasts around noon (12:00) for daily representation
            if (!dailyData[date] || Math.abs(hour - 12) < Math.abs(dailyData[date].hour - 12)) {
                dailyData[date] = {
                    ...forecast,
                    hour: hour
                };
            }
        });

        // Convert to array and take first 5 days
        return Object.values(dailyData).slice(0, 5);
    }

    createForecastCard(forecast) {
        const card = document.createElement('div');
        card.className = 'forecast-card';

        const date = new Date(forecast.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        card.innerHTML = `
            <div class="forecast-date">${dayName}, ${monthDay}</div>
            <img src="https://openweathermap.org/img/wn/${forecast.icon}.png" alt="${forecast.description}" class="forecast-icon">
            <div class="forecast-temp">${Math.round(forecast.temperature)}°C</div>
            <div class="forecast-desc">${forecast.description}</div>
            <div class="forecast-details">
                <span><i class="fas fa-eye"></i> ${forecast.humidity}%</span>
                <span><i class="fas fa-wind"></i> ${forecast.wind_speed}m/s</span>
            </div>
        `;

        return card;
    }

    showLoading() {
        this.loading.classList.remove('hidden');
        this.hideError();
        this.currentWeather.classList.add('hidden');
        this.forecast.classList.add('hidden');
    }

    hideLoading() {
        this.loading.classList.add('hidden');
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.error.classList.remove('hidden');
        this.currentWeather.classList.add('hidden');
        this.forecast.classList.add('hidden');
    }

    hideError() {
        this.error.classList.add('hidden');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});
