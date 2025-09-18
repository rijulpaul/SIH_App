import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  Modal,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import RNPickerSelect from 'react-native-picker-select';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showMainDetails, setShowMainDetails] = useState(false);
  const [showTileDetails, setShowTileDetails] = useState(null);
  const logoScale = new Animated.Value(0.8);

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'हिंदी', value: 'hi' },
    { label: 'தமிழ்', value: 'ta' },
    { label: 'తెలుగు', value: 'te' },
    { label: 'मराठी', value: 'mr' },
  ];

  // Mock data for soil and weather
  const soilData = {
    type: 'Clay Loam',
    moisture: '65%',
    nutrients: 'N: 45, P: 32, K: 28',
    isIoT: true,
  };

  const weatherData = {
    temperature: '28°C',
    humidity: '75%',
    condition: 'Partly Cloudy',
    isIoT: false,
  };

  const selectedCrop = '---';

  const tileData = [
    { id: 1, title: 'Crop Recommendation', description: 'Get the best crop for your soil', icon: '🌾', image: '🌾' },
    { id: 2, title: 'Yield prediction', description: 'Predict the yield of your crop', icon: '🌾', image: '🌾' },
    { id: 3, title: 'Market Pricing', description: 'Get the best price for your crop', icon: '💰', image: '💰' },
    { id: 4, title: 'Disease Prediction', description: 'Predict the disease of your crop', icon: '🦠', image: '🦠' },
  ];

  const bottomBoxes = [
    { id: 1, title: 'Language', icon: '🌐' },
    { id: 2, title: 'Link IoT Device', icon: '📡' },
    { id: 3, title: 'Help & Support', icon: '❓' },
  ];

  useEffect(() => {
    initializeApp();
    startLogoAnimation();
  }, []);

  const startLogoAnimation = () => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 0.9,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  };

  const initializeApp = async () => {
    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for this app');
        setIsLoading(false);
        return;
      }

      // Get current location
      const locationData = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationData.coords;
      
      // Get address from coordinates
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const address = addressResponse[0];
      const locationString = `${address.city || address.district || 'Unknown'}, ${address.region || address.country || 'Unknown'}`;
      
      setLocation(locationString);
      
      // Store location in AsyncStorage
      await AsyncStorage.setItem('userLocation', locationString);
      
      // Simulate loading time
      setTimeout(() => {
        setIsLoading(false);
      }, 1200);
      
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get location');
      setIsLoading(false);
    }
  };

  const LoadingScreen = () => (
    <View style={styles.loadingContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1e8a3a" />
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>LOGO</Text>
        </View>
      </Animated.View>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

  const MainScreen = () => (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#E7FFC7" />
      
      {/* Main Block - 25% height */}
      <TouchableOpacity 
        style={styles.mainBlock} 
        onPress={() => setShowMainDetails(true)}
        activeOpacity={0.8}
      >
        <View style={styles.mainBlockLeft}>
          <View style={styles.locationSection}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.dataText}>{location || 'Location not available'}</Text>
          </View>
          <View style={styles.soilSection}>
            <Text style={styles.sectionTitle}>Soil Data</Text>
            <Text style={styles.dataText}>Type: {soilData.type}</Text>
            <Text style={styles.dataText}>Moisture: {soilData.moisture}</Text>
            <Text style={styles.dataText}>Nutrients: {soilData.nutrients}</Text>
            <Text style={styles.dataSource}>
              {soilData.isIoT ? '📡 IoT' : '🌐 Net'}
            </Text>
          </View>
        </View>
        <View style={styles.mainBlockRight}>
          <View style={styles.cropSection}>
            <Text style={styles.sectionTitle}>Crop</Text>
            <Text style={styles.dataText}>{selectedCrop}</Text>
          </View>
          <View style={styles.weatherSection}>
            <Text style={styles.sectionTitle}>Weather</Text>
            <Text style={styles.dataText}>{weatherData.temperature}</Text>
            <Text style={styles.dataText}>{weatherData.humidity}</Text>
            <Text style={styles.dataText}>{weatherData.condition}</Text>
            <Text style={styles.dataSource}>
              {weatherData.isIoT ? '📡 IoT' : '🌐 Net'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Tile Section - Full width, remaining height minus 15% */}
      <View style={styles.tileSection}>
        {tileData.map((tile) => (
          <TouchableOpacity 
            key={tile.id} 
            style={styles.tileBlock}
            onPress={() => setShowTileDetails(tile.id)}
            activeOpacity={0.8}
          >
            <View style={styles.tileImage}>
              <Text style={styles.tileImageText}>{tile.image}</Text>
            </View>
            <View style={styles.tileContent}>
              <Text style={styles.tileTitle}>{tile.title}</Text>
              <Text style={styles.tileDescription}>{tile.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Boxes - 15% height */}
      <View style={styles.bottomBoxes}>
        {bottomBoxes.map((box) => (
          <TouchableOpacity key={box.id} style={styles.bottomBox}>
            <Text style={styles.bottomBoxIcon}>{box.icon}</Text>
            <Text style={styles.bottomBoxText}>{box.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Details Modal */}
      <Modal
        visible={showMainDetails}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMainDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowMainDetails(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <ScrollView style={styles.modalScrollView}>
              <Text style={styles.modalTitle}>Detailed Statistics</Text>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>📍 Location Details</Text>
                <Text style={styles.detailText}>Current Location: {location}</Text>
                <Text style={styles.detailText}>GPS Coordinates: Available</Text>
                <Text style={styles.detailText}>Last Updated: Just now</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>🌱 Soil Analysis</Text>
                <Text style={styles.detailText}>Soil Type: {soilData.type}</Text>
                <Text style={styles.detailText}>Moisture Level: {soilData.moisture}</Text>
                <Text style={styles.detailText}>pH Level: 6.8 (Optimal)</Text>
                <Text style={styles.detailText}>Nitrogen: 45 ppm</Text>
                <Text style={styles.detailText}>Phosphorus: 32 ppm</Text>
                <Text style={styles.detailText}>Potassium: 28 ppm</Text>
                <Text style={styles.detailText}>Data Source: IoT Sensor</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>🌤️ Weather Conditions</Text>
                <Text style={styles.detailText}>Temperature: {weatherData.temperature}</Text>
                <Text style={styles.detailText}>Humidity: {weatherData.humidity}</Text>
                <Text style={styles.detailText}>Condition: {weatherData.condition}</Text>
                <Text style={styles.detailText}>Wind Speed: 12 km/h</Text>
                <Text style={styles.detailText}>Pressure: 1013 hPa</Text>
                <Text style={styles.detailText}>Data Source: Weather API</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>🌾 Crop Information</Text>
                <Text style={styles.detailText}>Selected Crop: {selectedCrop}</Text>
                <Text style={styles.detailText}>Planting Date: Not set</Text>
                <Text style={styles.detailText}>Expected Harvest: Not set</Text>
                <Text style={styles.detailText}>Growth Stage: Not applicable</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Tile Details Modal */}
      <Modal
        visible={showTileDetails !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTileDetails(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowTileDetails(null)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <ScrollView style={styles.modalScrollView}>
              {showTileDetails && (
                <>
                  <Text style={styles.modalTitle}>{tileData[showTileDetails - 1].title}</Text>
                  <View style={styles.tileDetailImage}>
                    <Text style={styles.tileDetailImageText}>{tileData[showTileDetails - 1].image}</Text>
                  </View>
                  <Text style={styles.tileDetailDescription}>{tileData[showTileDetails - 1].description}</Text>
                  
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Features</Text>
                    <Text style={styles.detailText}>• Comprehensive information</Text>
                    <Text style={styles.detailText}>• Easy to use interface</Text>
                    <Text style={styles.detailText}>• Real-time updates</Text>
                    <Text style={styles.detailText}>• Offline support</Text>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );

  return isLoading ? <LoadingScreen /> : <MainScreen />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1e8a3a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#E7FFC7',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e8a3a',
  },
  loadingText: {
    color: '#E7FFC7',
    fontSize: 16,
    fontWeight: '500',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#E7FFC7',
  },
  
  // Main Block Styles (30% height)
  mainBlock: {
    height: height * 0.30,
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
    // flex: 1,
    marginBottom: 20,
  },
  cropSection: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
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
  locationText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  cropText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e8a3a',
  },

  // Tile Section Styles
  tileSection: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  tileBlock: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    height: height * 0.125,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tileImage: {
    width: 50,
    height: 50,
    backgroundColor: '#f0f9ff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tileImageText: {
    fontSize: 24,
  },
  tileContent: {
    flex: 1,
  },
  tileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  tileDescription: {
    fontSize: 12,
    color: '#6b7280',
  },

  // Bottom Boxes Styles (7.5% height)
  bottomBoxes: {
    height: height * 0.075,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 15,
    justifyContent: 'space-between',
  },
  bottomBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomBoxIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  bottomBoxText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '100%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  modalScrollView: {
    padding: 20,
    paddingTop: 50,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e8a3a',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 5,
  },
  tileDetailImage: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f9ff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 15,
  },
  tileDetailImageText: {
    fontSize: 36,
  },
  tileDetailDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
});


