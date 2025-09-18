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
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import RNPickerSelect from 'react-native-picker-select';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const logoScale = new Animated.Value(0.8);

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'हिंदी', value: 'hi' },
    { label: 'தமிழ்', value: 'ta' },
    { label: 'తెలుగు', value: 'te' },
    { label: 'मराठी', value: 'mr' },
  ];

  const mainButtons = [
    { id: 1, title: 'Services', icon: '🔧' },
    { id: 2, title: 'Emergency', icon: '🚨' },
    { id: 3, title: 'Information', icon: 'ℹ️' },
    { id: 4, title: 'Settings', icon: '⚙️' },
  ];

  useEffect(() => {
    initializeApp();
    startLogoAnimation();
  }, []);

  const startLogoAnimation = () => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 0.8,
          duration: 1000,
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
      }, 2000);
      
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
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      {/* Top Header - 15% of screen */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.locationText} numberOfLines={1}>
            📍 {location || 'Location not available'}
          </Text>
        </View>
        <View style={styles.headerRight}>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.contentContainer}>
        <View style={styles.buttonsGrid}>
          {mainButtons.map((button) => (
            <TouchableOpacity key={button.id} style={styles.mainButton}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonIcon}>{button.icon}</Text>
                <Text style={styles.buttonText}>{button.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
    backgroundColor: '#ffffff',
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
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    height: height * 0.15,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 0.6,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  buttonsGrid: {
    flex: 1,
    justifyContent: 'space-around',
  },
  mainButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    color: '#374151',
    paddingRight: 30,
    backgroundColor: '#ffffff',
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    color: '#374151',
    paddingRight: 30,
    backgroundColor: '#ffffff',
  },
});

