import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Alert, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import dataService from '../services/dataService';
import MainTile from './MainTile';
import TileGrid from './TileGrid';
import BottomBoxes from './BottomBoxes';
import MainDetailsModal from './MainDetailsModal';
import TileDetailsModal from './TileDetailsModal';
import LanguageSelector from './LanguageSelector';

const MainScreen = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState(null);
  const [soilData, setSoilData] = useState({ type: '---', moisture: '---', nutrients: '---', isIoT: false });
  const [weatherData, setWeatherData] = useState({ temperature: '---', humidity: '---', condition: '---', isIoT: false });
  const [cropData, setCropData] = useState('---');
  const [showMainDetails, setShowMainDetails] = useState(false);
  const [showTileDetails, setShowTileDetails] = useState(null);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showIoTModal, setShowIoTModal] = useState(false);
  const [iotUrl, setIotUrl] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [locationData, soilDataFromAPI, weatherDataFromAPI, cropDataFromStorage] = await Promise.all([
        dataService.getLocation(),
        dataService.fetchCurrentSoilData(), // Fetch fresh soil data
        dataService.fetchCurrentWeather(), // Fetch fresh weather data
        dataService.getCropData(),
      ]);

      setLocation(locationData);
      setSoilData(soilDataFromAPI);
      setWeatherData(weatherDataFromAPI);
      setCropData(cropDataFromStorage);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      const refreshedData = await dataService.refreshAllData();
      setLocation(refreshedData.location);
      setSoilData(refreshedData.soilData);
      setWeatherData(refreshedData.weatherData);
      setCropData(refreshedData.cropData);
    } catch (error) {
      console.error('Error refreshing data:', error);
      throw error;
    }
  };

  const handleWeatherRefresh = async () => {
    try {
      console.log('Refreshing weather data...');
      const freshWeatherData = await dataService.fetchCurrentWeather();
      setWeatherData(freshWeatherData);
      console.log('Weather data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing weather data:', error);
      throw error;
    }
  };

  const handleSoilRefresh = async () => {
    try {
      console.log('Refreshing soil data...');
      const freshSoilData = await dataService.fetchCurrentSoilData();
      setSoilData(freshSoilData);
      console.log('Soil data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing soil data:', error);
      throw error;
    }
  };

  const handleMainTilePress = () => {
    setShowMainDetails(true);
  };

  const handleTilePress = (tileId) => {
    setShowTileDetails(tileId);
  };

  const handleLanguageSelect = (languageCode) => {
    // Language change is handled by the LanguageSelector component
    console.log('Language selected:', languageCode);
  };

  const handleLanguageSelectorClose = () => {
    setShowLanguageSelector(false);
  };

  const handleIotSubmit = () => {
    Alert.alert('Invalid link');
  };

  const handleBottomBoxPress = (boxId) => {
    // Handle bottom box press based on boxId
    switch (boxId) {
      case 1: // Language
        setShowLanguageSelector(true);
        break;
      case 2: // Link IoT Device
        setShowIoTModal(true);
        break;
      case 3: // Help & Support
        Alert.alert('Help & Support', 'Help and support functionality will be implemented here');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#E7FFC7" />
      
      <MainTile
        location={location}
        soilData={soilData}
        weatherData={weatherData}
        cropData={cropData}
        onPress={handleMainTilePress}
        onRefresh={handleRefresh}
      />

      <TileGrid onTilePress={handleTilePress} />

      <BottomBoxes onBoxPress={handleBottomBoxPress} />

      <MainDetailsModal
        visible={showMainDetails}
        onClose={() => setShowMainDetails(false)}
        location={location}
        soilData={soilData}
        weatherData={weatherData}
        cropData={cropData}
      />

      <TileDetailsModal
        visible={showTileDetails !== null}
        onClose={() => setShowTileDetails(null)}
        selectedTileId={showTileDetails}
      />

      <LanguageSelector
        visible={showLanguageSelector}
        onLanguageSelect={handleLanguageSelect}
        onContinue={handleLanguageSelectorClose}
      />

      {/* IoT URL Input Modal */}
      <Modal
        visible={showIoTModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowIoTModal(false)}
      >
        <View style={styles.iotOverlay}>
          <View style={styles.iotContainer}>
            <Text style={styles.iotTitle}>Link IoT Sensor</Text>
            <Text style={styles.iotSubtitle}>Enter your IoT endpoint URL to pull data from your sensor.</Text>
            <TextInput
              style={styles.iotInput}
              value={iotUrl}
              onChangeText={setIotUrl}
              placeholder="https://api.thingspeak.com/channels/{id}/feeds.json?api_key={KEY}&results=1"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.iotActions}>
              <TouchableOpacity style={styles.iotCancelButton} onPress={() => setShowIoTModal(false)}>
                <Text style={styles.iotCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iotSubmitButton} onPress={handleIotSubmit}>
                <Text style={styles.iotSubmitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#E7FFC7',
  },
  iotOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iotContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 420,
  },
  iotTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e8a3a',
    textAlign: 'center',
    marginBottom: 8,
  },
  iotSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  iotInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  iotActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  iotCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    marginRight: 10,
  },
  iotCancelText: {
    color: '#374151',
    fontWeight: '600',
  },
  iotSubmitButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1e8a3a',
  },
  iotSubmitText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});

export default MainScreen;
