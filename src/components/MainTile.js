import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import dataService from '../services/dataService';

const MainTile = ({ 
  location, 
  soilData, 
  weatherData, 
  cropData, 
  onPress, 
  onRefresh 
}) => {
  const { t } = useTranslation();

  const handleRefresh = async () => {
    try {
      await onRefresh();
      Alert.alert('Success', 'Data refreshed successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh data');
    }
  };

  return (
    <TouchableOpacity 
      style={styles.mainBlock} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.mainBlockLeft}>
        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>{t('mainScreen.location')}</Text>
          <Text style={styles.dataText}>{location || t('common.notAvailable')}</Text>
        </View>
        <View style={styles.soilSection}>
          <Text style={styles.sectionTitle}>{t('mainScreen.soilData')}</Text>
          <Text style={styles.dataText}>{t('soilData.type')}: {soilData.type}</Text>
          <Text style={styles.dataText}>{t('soilData.moisture')}: {soilData.moisture}</Text>
          <Text style={styles.dataText}>{t('soilData.nutrients')}: {soilData.nutrients}</Text>
          <Text style={styles.dataSource}>
            {soilData.isIoT ? t('common.iot') : t('common.network')}
          </Text>
        </View>
      </View>
      <View style={styles.mainBlockRight}>
        <View style={styles.cropSection}>
          <Text style={styles.sectionTitle}>{t('mainScreen.crop')}</Text>
          <Text style={styles.dataText}>{cropData}</Text>
        </View>
        <View style={styles.weatherSection}>
          <Text style={styles.sectionTitle}>{t('mainScreen.weather')}</Text>
          <Text style={styles.dataText}>{weatherData.temperature}</Text>
          <Text style={styles.dataText}>{weatherData.humidity}</Text>
          <Text style={styles.dataText}>{weatherData.condition}</Text>
          <Text style={styles.dataSource}>
            {weatherData.isIoT ? t('common.iot') : t('common.network')}
          </Text>
        </View>
      </View>
      
      {/* Refresh Button */}
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={handleRefresh}
        activeOpacity={0.7}
      >
        <Text style={styles.refreshButtonText}>🔄</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainBlock: {
    height: 250, // Fixed height instead of percentage
    backgroundColor: '#ffffff',
    margin: 15,
    marginTop: 40,
    borderRadius: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  mainBlockLeft: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  mainBlockRight: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  locationSection: {
    marginBottom: 20,
  },
  soilSection: {
    flex: 1,
  },
  weatherSection: {
    marginBottom: 20,
  },
  cropSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e8a3a',
    marginBottom: 8,
  },
  dataText: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
  },
  dataSource: {
    fontSize: 10,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 5,
  },
  refreshButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 40,
    height: 40,
    backgroundColor: '#1e8a3a',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  refreshButtonText: {
    fontSize: 18,
    color: '#ffffff',
  },
});

export default MainTile;
