import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';

const LoadingScreen = () => {
  const { t } = useTranslation();
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
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

  return (
    <View style={styles.loadingContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1e8a3a" />
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>LOGO</Text>
        </View>
      </Animated.View>
      <Text style={styles.loadingText}>{t('common.loading')}</Text>
    </View>
  );
};

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
});

export default LoadingScreen;
