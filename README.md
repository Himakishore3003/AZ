# Weather App

This app was made to test the hosting service of Azure

A full-stack weather application built with Python Flask backend and vanilla JavaScript frontend that displays current weather and 5-day forecasts using the OpenWeather API.

## Features

- 🌤️ Current weather information for any city
- 📅 5-day weather forecast
- 📍 Location-based weather (using browser geolocation)
- 🎨 Beautiful, responsive design
- 🌍 Search by city name
- 💨 Wind speed and direction
- 💧 Humidity and pressure information

## Setup Instructions

### Prerequisites

- Python 3.7+
- OpenWeather API key (free from [OpenWeatherMap](https://openweathermap.org/api))

### Installation

1. **Clone or download this project**

2. **Set up Python environment**
   ```bash
   # Create virtual environment (optional but recommended)
   python -m venv weather_app_env
   
   # Activate virtual environment
   # On Windows:
   weather_app_env\Scripts\activate
   # On macOS/Linux:
   source weather_app_env/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure API Key**
   - Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
   - Open the `.env` file
   - Replace `your_api_key_here` with your actual API key:
     ```
     OPENWEATHER_API_KEY=your_actual_api_key_here
     ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5000`
   - Start searching for weather information!

## API Endpoints

The Flask backend provides the following API endpoints:

- `GET /api/weather/current/<city>` - Get current weather for a city
- `GET /api/weather/forecast/<city>` - Get 5-day forecast for a city
- `GET /api/weather/coordinates?lat=<lat>&lon=<lon>` - Get weather by coordinates

## Project Structure

```
weather-app/
├── app.py                 # Flask backend application
├── requirements.txt       # Python dependencies
├── .env                  # Environment variables (API keys)
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── css/
    │   └── style.css     # Stylesheet
    └── js/
        └── app.js        # Frontend JavaScript
```

## Technologies Used

- **Backend**: Python, Flask, Flask-CORS
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: OpenWeather API
- **Icons**: Font Awesome

## Features in Detail

### Current Weather
- Temperature (°C)
- "Feels like" temperature
- Weather description and icon
- Humidity percentage
- Atmospheric pressure
- Wind speed and direction

### 5-Day Forecast
- Daily temperature predictions
- Weather icons and descriptions
- Humidity and wind information
- Easy-to-read date formatting

### User Experience
- Responsive design for mobile and desktop
- Search by city name
- Use current location (with permission)
- Loading states and error handling
- Clean, modern interface

## Customization

You can easily customize the app by:

- Modifying the CSS in `static/css/style.css` for different styling
- Adding new API endpoints in `app.py`
- Extending the frontend functionality in `static/js/app.js`
- Adding new weather parameters from the OpenWeather API

## Troubleshooting

1. **API Key Issues**: Make sure your OpenWeather API key is valid and properly set in the `.env` file
2. **Port Conflicts**: If port 5000 is in use, change it in `app.py`
3. **Location Access**: Enable location services in your browser for geolocation features

## License

This project is open source and available under the MIT License.


