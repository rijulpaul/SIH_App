import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { STORAGE_KEYS, DEFAULT_DATA } from '../constants';

class DataService {
  // Location methods
  async getCurrentLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      const locationData = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationData.coords;
      
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const address = addressResponse[0];
      const locationString = `${address.city || address.district || 'Unknown'}, ${address.region || address.country || 'Unknown'}`;
      
      await this.saveLocation(locationString, latitude, longitude);
      return locationString;
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  }

  async saveLocation(location, latitude = null, longitude = null) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_LOCATION, location);
      if (latitude !== null) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_LATITUDE, latitude.toString());
      }
      if (longitude !== null) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_LONGITUDE, longitude.toString());
      }
    } catch (error) {
      console.error('Error saving location:', error);
    }
  }

  async getLocation() {
    try {
      const location = await AsyncStorage.getItem(STORAGE_KEYS.USER_LOCATION);
      return location || null;
    } catch (error) {
      console.error('Error getting location from storage:', error);
      return null;
    }
  }

  async getLatitude() {
    try {
      const latitude = await AsyncStorage.getItem(STORAGE_KEYS.USER_LATITUDE);
      return latitude ? parseFloat(latitude) : null;
    } catch (error) {
      console.error('Error getting latitude from storage:', error);
      return null;
    }
  }

  async getLongitude() {
    try {
      const longitude = await AsyncStorage.getItem(STORAGE_KEYS.USER_LONGITUDE);
      return longitude ? parseFloat(longitude) : null;
    } catch (error) {
      console.error('Error getting longitude from storage:', error);
      return null;
    }
  }

  async clearLocationData() {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.USER_LOCATION),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_LATITUDE),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_LONGITUDE)
      ]);
      console.log('Location data cleared from storage');
    } catch (error) {
      console.error('Error clearing location data:', error);
    }
  }

  // Soil data methods
  async getSoilData() {
    try {
      const soilData = await AsyncStorage.getItem(STORAGE_KEYS.SOIL_DATA);
      return soilData ? JSON.parse(soilData) : DEFAULT_DATA.soil;
    } catch (error) {
      console.error('Error getting soil data:', error);
      return DEFAULT_DATA.soil;
    }
  }

  async saveSoilData(soilData) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SOIL_DATA, JSON.stringify(soilData));
    } catch (error) {
      console.error('Error saving soil data:', error);
    }
  }

  // Weather data methods
  async getWeatherData() {
    try {
      const weatherData = await AsyncStorage.getItem(STORAGE_KEYS.WEATHER_DATA);
      return weatherData ? JSON.parse(weatherData) : DEFAULT_DATA.weather;
    } catch (error) {
      console.error('Error getting weather data:', error);
      return DEFAULT_DATA.weather;
    }
  }

  async fetchCurrentWeather() {
    try {
      // Get current location coordinates
      const [latitude, longitude] = await Promise.all([
        this.getLatitude(),
        this.getLongitude()
      ]);

      if (!latitude || !longitude) {
        console.log('No location data available for weather fetch');
        return DEFAULT_DATA.weather;
      }

      console.log('Fetching weather data for coordinates:', { latitude, longitude });

      // Construct Open-Meteo API URL
      const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,cloud_cover,precipitation,rain`;
      
      console.log('Weather API URL:', weatherApiUrl);

      const response = await fetch(weatherApiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Weather API request failed with status: ${response.status}`);
      }

      const weatherData = await response.json();
      console.log('Weather data received:', weatherData);

      // Transform API response to our format
      const transformedWeather = {
        temperature: weatherData.current.temperature_2m.toFixed(1),
        humidity: weatherData.current.relative_humidity_2m.toFixed(0),
        condition: this.getWeatherCondition(weatherData.current.cloud_cover, weatherData.current.precipitation),
        windSpeed: weatherData.current.wind_speed_10m.toFixed(1),
        cloudCover: weatherData.current.cloud_cover.toFixed(0),
        precipitation: weatherData.current.precipitation.toFixed(1),
        rain: weatherData.current.rain.toFixed(1),
        isIoT: false, // This is real-time data, not IoT
        lastUpdated: new Date().toISOString(),
        timezone: weatherData.timezone,
        elevation: weatherData.elevation,
        rawData: weatherData // Store full response for debugging
      };

      // Save to storage
      await this.saveWeatherData(transformedWeather);
      
      return transformedWeather;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Return cached data if available, otherwise default
      const cachedWeather = await this.getWeatherData();
      return cachedWeather;
    }
  }

  getWeatherCondition(cloudCover, precipitation) {
    if (precipitation > 0) {
      return 'Rainy';
    } else if (cloudCover >= 80) {
      return 'Cloudy';
    } else if (cloudCover >= 40) {
      return 'Partly Cloudy';
    } else {
      return 'Clear';
    }
  }

  async saveWeatherData(weatherData) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WEATHER_DATA, JSON.stringify(weatherData));
    } catch (error) {
      console.error('Error saving weather data:', error);
    }
  }

  // Crop data methods
  async getCropData() {
    try {
      const cropData = await AsyncStorage.getItem(STORAGE_KEYS.CROP_DATA);
      return cropData || DEFAULT_DATA.crop;
    } catch (error) {
      console.error('Error getting crop data:', error);
      return DEFAULT_DATA.crop;
    }
  }

  async saveCropData(cropData) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CROP_DATA, cropData);
    } catch (error) {
      console.error('Error saving crop data:', error);
    }
  }

  // Language methods
  async getSelectedLanguage() {
    try {
      const language = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_LANGUAGE);
      return language || 'en';
    } catch (error) {
      console.error('Error getting selected language:', error);
      return 'en';
    }
  }

  async saveSelectedLanguage(language) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_LANGUAGE, language);
    } catch (error) {
      console.error('Error saving selected language:', error);
    }
  }

  // Yield prediction methods
  async getYieldPrediction(cropType = null, area = null, temperature = null) {
    try {
      // Get current data from storage if parameters not provided
      const [currentCrop, weatherData, latitude, longitude] = await Promise.all([
        cropType ? Promise.resolve(cropType) : this.getCropData(),
        temperature !== null ? Promise.resolve({ temperature: temperature }) : this.getWeatherData(),
        this.getLatitude(),
        this.getLongitude()
      ]);

      // Use provided parameters or fallback to stored/default values
      const finalCrop = currentCrop && currentCrop !== '---' ? currentCrop : 'rice';
      const finalArea = area || 2; // Default area
      const finalTemperature = temperature !== null ? temperature : 
        (weatherData.temperature && weatherData.temperature !== '---' ? 
         parseFloat(weatherData.temperature) : 2.1);

      // Make API call with location parameters
      const apiUrl = `http://10.222.27.14:8000/cropyield?crop=${finalCrop}&area=${finalArea}&lat=${latitude || 0}&lon=${longitude || 0}`;
      
      console.log('Making API call to Yield Prediction AI:', apiUrl);
      console.log('Parameters:', { crop: finalCrop, area: finalArea, temperature: finalTemperature, lat: latitude, lon: longitude });
      console.log('Starting fetch request...');
      
      // Make the API call
      console.log('Attempting to fetch from:', apiUrl);
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      console.log('Response received:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Validate the response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from API');
      }

      // Log successful API response
      console.log('Successfully fetched yield prediction from abc.com:', data);
      
      // Return the data as received from abc.com
      return data;
    } catch (error) {
      console.error('Error getting yield prediction from abc.com:', error);
      
      // Determine error type for better user feedback
      let errorMessage = 'API request failed';
      if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout - please check your internet connection';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error - please check your internet connection';
      } else if (error.message.includes('404')) {
        errorMessage = 'API endpoint not found';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error - please try again later';
      }
      
      console.log('Falling back to mock data due to API error:', errorMessage);
      
      // Fallback to mock data if API fails
      const mockYieldData = {
        crop: finalCrop,
        area_ha: finalArea,
        temperature_c_used: finalTemperature,
        latitude: latitude || 0,
        longitude: longitude || 0,
        fertilizer_per_ha_range: [111.84, 142.35],
        pesticide_per_ha_range: [0.451, 0.574],
        yield_per_ha_range: [3.175, 4.04],
        total_fertilizer_range: [223.69, 284.69],
        total_pesticide_range: [0.902, 1.148],
        total_yield_range: [6.349, 8.081],
        message: `Yield prediction for ${finalCrop} on ${finalArea} hectares at ${finalTemperature}°C (Offline Mode)`,
        isOfflineData: true,
        errorMessage: errorMessage
      };
      
      return mockYieldData;
    }
  }

  // Test API connection
  async testApiConnection() {
    try {
      const response = await fetch('https://abc.com/api/health', {
        method: 'GET',
        timeout: 5000,
      });
      return response.ok;
    } catch (error) {
      console.log('API connection test failed:', error);
      return false;
    }
  }

  // Refresh all data
  async refreshAllData() {
    try {
      const location = await this.getCurrentLocation();
      
      // Fetch fresh weather data from Open-Meteo API
      const weatherData = await this.fetchCurrentWeather();
      
      // Get other data from storage
      const soilData = await this.getSoilData();
      const cropData = await this.getCropData();
      
      return {
        location,
        soilData,
        weatherData,
        cropData,
      };
    } catch (error) {
      console.error('Error refreshing data:', error);
      throw error;
    }
  }
}

export default new DataService();
