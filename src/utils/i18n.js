import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Import language resources
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import ta from '../locales/ta.json';
import te from '../locales/te.json';
import mr from '../locales/mr.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  ta: { translation: ta },
  te: { translation: te },
  mr: { translation: mr },
};

// Get device language using Expo Localization with fallback
let deviceLanguage = 'en';
try {
  if (Localization.locale) {
    // Extract language code from locale (e.g., 'en-US' -> 'en')
    deviceLanguage = Localization.locale.split('-')[0];
    
    // Map common language codes to our supported languages
    const supportedLanguages = ['en', 'hi', 'ta', 'te', 'mr'];
    if (!supportedLanguages.includes(deviceLanguage)) {
      deviceLanguage = 'en'; // Fallback to English if not supported
    }
  }
} catch (error) {
  console.log('Expo Localization not available, using default language');
  deviceLanguage = 'en';
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
