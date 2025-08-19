from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# OpenWeather API configuration
OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')
OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/api/weather/current/<city>')
def get_current_weather(city):
    """Get current weather for a city"""
    try:
        url = f"{OPENWEATHER_BASE_URL}/weather"
        params = {
            'q': city,
            'appid': OPENWEATHER_API_KEY,
            'units': 'metric'
        }
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            data = response.json()
            return jsonify({
                'success': True,
                'data': {
                    'city': data['name'],
                    'country': data['sys']['country'],
                    'temperature': data['main']['temp'],
                    'feels_like': data['main']['feels_like'],
                    'humidity': data['main']['humidity'],
                    'pressure': data['main']['pressure'],
                    'description': data['weather'][0]['description'],
                    'icon': data['weather'][0]['icon'],
                    'wind_speed': data['wind']['speed'],
                    'wind_direction': data['wind'].get('deg', 0)
                }
            })
        else:
            return jsonify({
                'success': False,
                'error': 'City not found'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/weather/forecast/<city>')
def get_weather_forecast(city):
    """Get 5-day weather forecast for a city"""
    try:
        url = f"{OPENWEATHER_BASE_URL}/forecast"
        params = {
            'q': city,
            'appid': OPENWEATHER_API_KEY,
            'units': 'metric'
        }
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            data = response.json()
            forecasts = []
            
            for item in data['list']:
                forecasts.append({
                    'date': item['dt_txt'],
                    'temperature': item['main']['temp'],
                    'description': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon'],
                    'humidity': item['main']['humidity'],
                    'wind_speed': item['wind']['speed']
                })
            
            return jsonify({
                'success': True,
                'data': {
                    'city': data['city']['name'],
                    'country': data['city']['country'],
                    'forecasts': forecasts
                }
            })
        else:
            return jsonify({
                'success': False,
                'error': 'City not found'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/weather/coordinates')
def get_weather_by_coordinates():
    """Get weather by latitude and longitude"""
    try:
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        
        if not lat or not lon:
            return jsonify({
                'success': False,
                'error': 'Latitude and longitude are required'
            }), 400
        
        url = f"{OPENWEATHER_BASE_URL}/weather"
        params = {
            'lat': lat,
            'lon': lon,
            'appid': OPENWEATHER_API_KEY,
            'units': 'metric'
        }
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            data = response.json()
            return jsonify({
                'success': True,
                'data': {
                    'city': data['name'],
                    'country': data['sys']['country'],
                    'temperature': data['main']['temp'],
                    'feels_like': data['main']['feels_like'],
                    'humidity': data['main']['humidity'],
                    'pressure': data['main']['pressure'],
                    'description': data['weather'][0]['description'],
                    'icon': data['weather'][0]['icon'],
                    'wind_speed': data['wind']['speed'],
                    'wind_direction': data['wind'].get('deg', 0)
                }
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Location not found'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    if not OPENWEATHER_API_KEY:
        print("Warning: OPENWEATHER_API_KEY not found in environment variables")
        print("Please set your OpenWeather API key in the .env file")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
