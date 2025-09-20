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
      
      await this.saveLocation(locationString);
      return locationString;
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  }

  async saveLocation(location) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_LOCATION, location);
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

  // Refresh all data
  async refreshAllData() {
    try {
      const location = await this.getCurrentLocation();
      // Here you would typically fetch fresh soil and weather data from APIs
      // For now, we'll just return the current data
      const soilData = await this.getSoilData();
      const weatherData = await this.getWeatherData();
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
