import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import dataService from '../services/dataService';
import MainTile from './MainTile';
import TileGrid from './TileGrid';
import BottomBoxes from './BottomBoxes';
import MainDetailsModal from './MainDetailsModal';
import TileDetailsModal from './TileDetailsModal';

const MainScreen = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState(null);
  const [soilData, setSoilData] = useState({ type: '---', moisture: '---', nutrients: '---', isIoT: false });
  const [weatherData, setWeatherData] = useState({ temperature: '---', humidity: '---', condition: '---', isIoT: false });
  const [cropData, setCropData] = useState('---');
  const [showMainDetails, setShowMainDetails] = useState(false);
  const [showTileDetails, setShowTileDetails] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [locationData, soilDataFromStorage, weatherDataFromStorage, cropDataFromStorage] = await Promise.all([
        dataService.getLocation(),
        dataService.getSoilData(),
        dataService.getWeatherData(),
        dataService.getCropData(),
      ]);

      setLocation(locationData);
      setSoilData(soilDataFromStorage);
      setWeatherData(weatherDataFromStorage);
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

  const handleMainTilePress = () => {
    setShowMainDetails(true);
  };

  const handleTilePress = (tileId) => {
    setShowTileDetails(tileId);
  };

  const handleBottomBoxPress = (boxId) => {
    // Handle bottom box press based on boxId
    switch (boxId) {
      case 1: // Language
        // This will be handled by the parent component
        break;
      case 2: // Link IoT Device
        Alert.alert('IoT Device', 'IoT device linking functionality will be implemented here');
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
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#E7FFC7',
  },
});

export default MainScreen;
