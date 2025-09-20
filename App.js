import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import './src/utils/i18n'; // Initialize i18n
import dataService from './src/services/dataService';
import LoadingScreen from './src/components/LoadingScreen';
import MainScreen from './src/components/MainScreen';
import LanguageSelector from './src/components/LanguageSelector';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Get saved language preference
      const savedLanguage = await dataService.getSelectedLanguage();
      setSelectedLanguage(savedLanguage);

      // Request location permission and get location
      const location = await dataService.getCurrentLocation();
      
      // Simulate loading time
      setTimeout(() => {
        setIsLoading(false);
        setShowLanguageSelector(true);
      }, 1200);
      
    } catch (error) {
      console.error('Error initializing app:', error);
      Alert.alert('Error', 'Failed to initialize app');
      setIsLoading(false);
      setShowLanguageSelector(true);
    }
  };

  const handleLanguageSelect = async (languageCode) => {
    setSelectedLanguage(languageCode);
    await dataService.saveSelectedLanguage(languageCode);
  };

  const handleLanguageContinue = () => {
    setShowLanguageSelector(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <MainScreen />
      <LanguageSelector
        visible={showLanguageSelector}
        onLanguageSelect={handleLanguageSelect}
        onContinue={handleLanguageContinue}
      />
    </>
  );
}

