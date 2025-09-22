export const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'हिंदी', value: 'hi' },
  { label: 'தமிழ்', value: 'ta' },
  { label: 'తెలుగు', value: 'te' },
  { label: 'मराठी', value: 'mr' },
];

export const TILE_DATA = [
  { id: 1, titleKey: 'tiles.cropRecommendation.title', descriptionKey: 'tiles.cropRecommendation.description', icon: '🌾', image: '🌾' },
  { id: 2, titleKey: 'tiles.yieldPrediction.title', descriptionKey: 'tiles.yieldPrediction.description', icon: '⚖️', image: '⚖️' },
  { id: 3, titleKey: 'tiles.marketPricing.title', descriptionKey: 'tiles.marketPricing.description', icon: '💰', image: '💰' },
  { id: 4, titleKey: 'tiles.diseasePrediction.title', descriptionKey: 'tiles.diseasePrediction.description', icon: '🦠', image: '🦠' },
];

export const BOTTOM_BOXES = [
  { id: 1, titleKey: 'bottomBoxes.language', icon: '🌐' },
  { id: 2, titleKey: 'bottomBoxes.linkIoT', icon: '📡' },
  { id: 3, titleKey: 'bottomBoxes.helpSupport', icon: '❓' },
];

export const STORAGE_KEYS = {
  USER_LOCATION: 'userLocation',
  USER_LATITUDE: 'userLatitude',
  USER_LONGITUDE: 'userLongitude',
  SELECTED_LANGUAGE: 'selectedLanguage',
  SOIL_DATA: 'soilData',
  WEATHER_DATA: 'weatherData',
  CROP_DATA: 'cropData',
};

export const DEFAULT_DATA = {
  soil: {
    type: '---',
    moisture: '---',
    nutrients: '---',
    isIoT: false,
  },
  weather: {
    temperature: '---',
    humidity: '---',
    condition: '---',
    isIoT: false,
  },
  crop: '---',
};
