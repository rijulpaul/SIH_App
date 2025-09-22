import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, ActivityIndicator, TextInput, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TILE_DATA } from '../constants';
import dataService from '../services/dataService';

const TileDetailsModal = ({ visible, onClose, selectedTileId }) => {
  const { t } = useTranslation();
  const [yieldData, setYieldData] = useState(null);
  const [cropRecommendationData, setCropRecommendationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cropInput, setCropInput] = useState('');
  const [areaInput, setAreaInput] = useState('');
  const [showInputForm, setShowInputForm] = useState(false);

  const selectedTile = selectedTileId ? TILE_DATA.find(tile => tile.id === selectedTileId) : null;

  useEffect(() => {
    if (visible && selectedTileId === 1) { // Crop Recommendation tile
      loadCropRecommendation();
    } else if (visible && selectedTileId === 2) { // Yield Prediction tile
      setShowInputForm(true);
    } else if (!visible) {
      // Reset states when modal is closed
      setLoading(false);
      setYieldData(null);
      setCropRecommendationData(null);
      setShowInputForm(false);
      setCropInput('');
      setAreaInput('');
    }
  }, [visible, selectedTileId]);

  const loadCropRecommendation = async () => {
    console.log('Starting to load crop recommendation data...');
    setLoading(true);
    setCropRecommendationData(null); // Clear previous data
    
    try {
      console.log('Fetching crop recommendation from API...');
      
      // Create a timeout promise that rejects after 5 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Server timeout - please check your internet connection'));
        }, 5000);
      });
      
      // Race between API call and timeout
      const data = await Promise.race([
        dataService.fetchCropRecommendation(),
        timeoutPromise
      ]);
      
      console.log('Crop recommendation received:', data);
      setCropRecommendationData(data);
    } catch (error) {
      console.error('Error loading crop recommendation:', error);
      
      // Show error message to user
      Alert.alert(
        'Server Error', 
        error.message || 'Failed to fetch crop recommendation. Please check your internet connection and try again.',
        [
          {
            text: 'Try Again',
            onPress: () => loadCropRecommendation()
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
      
      // Set fallback data
      setCropRecommendationData({
        crop: 'No recommendation available',
        message: 'Unable to fetch crop recommendation. Please try again later.',
        isApiData: false,
        error: error.message
      });
    } finally {
      console.log('Crop recommendation loading completed');
      setLoading(false);
    }
  };

  const loadYieldData = async (crop, area) => {
    console.log('Starting to load yield prediction data...');
    setLoading(true);
    setYieldData(null); // Clear previous data
    setShowInputForm(false); // Hide input form immediately
    
    try {
      console.log('Fetching data from abc.com...');
      
      // Create a timeout promise that rejects after 5 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Server timeout - please check your internet connection'));
        }, 5000);
      });
      
      // Race between API call and timeout
      const data = await Promise.race([
        dataService.getYieldPrediction(crop, area),
        timeoutPromise
      ]);
      
      console.log('Data received:', data);
      setYieldData(data);
    } catch (error) {
      console.error('Error loading yield data:', error);
      
      // Show error message to user
      Alert.alert(
        'Server Error', 
        error.message || 'Failed to fetch yield prediction. Please check your internet connection and try again.',
        [
          {
            text: 'Try Again',
            onPress: () => setShowInputForm(true)
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
      
      // Reset to input form
      setShowInputForm(true);
    } finally {
      console.log('Loading completed');
      setLoading(false);
    }
  };

  const formatRange = (range) => {
    return `${range[0].toFixed(2)} - ${range[1].toFixed(2)}`;
  };

  const validateInputs = () => {
    if (!cropInput.trim()) {
      Alert.alert('Invalid Input', 'Please enter a crop type');
      return false;
    }
    if (!areaInput.trim() || isNaN(parseFloat(areaInput)) || parseFloat(areaInput) <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid area in hectares');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    console.log('Submit button pressed');
    console.log('Crop input:', cropInput);
    console.log('Area input:', areaInput);
    
    if (validateInputs()) {
      console.log('Validation passed, calling loadYieldData');
      loadYieldData(cropInput.trim(), parseFloat(areaInput));
    } else {
      console.log('Validation failed');
    }
  };

  const renderInputForm = () => {
    return (
      <View style={styles.inputFormContainer}>
        <Text style={styles.inputFormTitle}>Enter Crop Details</Text>
        <Text style={styles.inputFormSubtitle}>Please provide the crop type and area for yield prediction</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Crop Type</Text>
          <TextInput
            style={styles.textInput}
            value={cropInput}
            onChangeText={setCropInput}
            placeholder="e.g., rice, wheat, corn"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Area (Hectares)</Text>
          <TextInput
            style={styles.textInput}
            value={areaInput}
            onChangeText={setAreaInput}
            placeholder="e.g., 2.5"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.submitButtonLoading}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.submitButtonText}>Loading...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Get Yield Prediction</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderCropRecommendation = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e8a3a" />
          <Text style={styles.loadingText}>Analyzing soil conditions and location...</Text>
          <Text style={styles.loadingSubtext}>Please wait while we get the best crop recommendation</Text>
        </View>
      );
    }

    if (!cropRecommendationData) {
      return (
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>No Data Available</Text>
          <Text style={styles.detailText}>Crop recommendation data is not available.</Text>
        </View>
      );
    }

    return (
      <View style={styles.cropRecommendationContainer}>
        <Text style={styles.cropRecommendationTitle}>🌾 Crop Recommendation</Text>
        
        <View style={styles.recommendedCropCard}>
          <Text style={styles.recommendedCropText}>{cropRecommendationData.crop}</Text>
          <Text style={styles.recommendedCropSubtext}>Recommended Crop</Text>
        </View>
        
        <View style={styles.recommendationMessage}>
          <Text style={styles.messageText}>{cropRecommendationData.message}</Text>
        </View>

        {cropRecommendationData.isApiData && (
          <View style={styles.recommendationDetails}>
            <Text style={styles.detailsTitle}>Analysis Details</Text>
            
            {cropRecommendationData.latitude && cropRecommendationData.longitude && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📍 Location:</Text>
                <Text style={styles.detailValue}>
                  {cropRecommendationData.latitude.toFixed(4)}, {cropRecommendationData.longitude.toFixed(4)}
                </Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🧬 Nitrogen (N):</Text>
              <Text style={styles.detailValue}>{cropRecommendationData.N} ppm</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🌿 Phosphorus (P):</Text>
              <Text style={styles.detailValue}>{cropRecommendationData.P} ppm</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🌱 Potassium (K):</Text>
              <Text style={styles.detailValue}>{cropRecommendationData.K} ppm</Text>
            </View>
            
            {cropRecommendationData.lastUpdated && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>🕒 Last Updated:</Text>
                <Text style={styles.detailValue}>
                  {new Date(cropRecommendationData.lastUpdated).toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        )}

        {!cropRecommendationData.isApiData && (
          <View style={styles.errorIndicator}>
            <Text style={styles.errorText}>⚠️ Offline Mode - Using cached data</Text>
          </View>
        )}
      </View>
    );
  };

  const renderYieldPrediction = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e8a3a" />
          <Text style={styles.loadingText}>Fetching yield prediction from abc.com...</Text>
          <Text style={styles.loadingSubtext}>Please wait while we get the latest data</Text>
        </View>
      );
    }

    if (!yieldData) {
      return (
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>No Data Available</Text>
          <Text style={styles.detailText}>Yield prediction data is not available.</Text>
        </View>
      );
    }

    return (
      <View style={styles.yieldContainer}>
        <View style={styles.yieldHeader}>
          <Text style={styles.yieldTitle}>{t('yieldPrediction.title')}</Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setShowInputForm(true)}
          >
            <Text style={styles.backButtonText}>Change Input</Text>
          </TouchableOpacity>
        </View>
        {yieldData.isOfflineData && (
          <View style={styles.offlineIndicator}>
            <Text style={styles.offlineText}>⚠️ Offline Mode - Using cached data</Text>
          </View>
        )}
        
        {/* Basic Info */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('yieldPrediction.crop')}:</Text>
          <Text style={styles.infoValue}>{yieldData.crop}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('yieldPrediction.area')}:</Text>
          <Text style={styles.infoValue}>{yieldData.area_ha} {t('yieldPrediction.hectares')}</Text>
        </View>
        {(yieldData.latitude && yieldData.longitude) && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>{yieldData.latitude.toFixed(4)}, {yieldData.longitude.toFixed(4)}</Text>
          </View>
        )}

        {/* Per Hectare Data */}
        <View style={styles.dataSection}>
          <Text style={styles.sectionTitle}>Per Hectare</Text>
          
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>{t('yieldPrediction.fertilizerPerHectare')}:</Text>
            <Text style={styles.dataValue}>{formatRange(yieldData.fertilizer_per_ha_range)} {t('yieldPrediction.kgPerHectare')}</Text>
          </View>
          
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>{t('yieldPrediction.pesticidePerHectare')}:</Text>
            <Text style={styles.dataValue}>{formatRange(yieldData.pesticide_per_ha_range)} {t('yieldPrediction.litersPerHectare')}</Text>
          </View>
          
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>{t('yieldPrediction.yieldPerHectare')}:</Text>
            <Text style={styles.dataValue}>{formatRange(yieldData.yield_per_ha_range)} {t('yieldPrediction.tonsPerHectare')}</Text>
          </View>
        </View>

        {/* Total Data */}
        <View style={styles.dataSection}>
          <Text style={styles.sectionTitle}>Total for {yieldData.area_ha} hectares</Text>
          
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>{t('yieldPrediction.totalFertilizer')}:</Text>
            <Text style={styles.dataValue}>{formatRange(yieldData.total_fertilizer_range)} {t('yieldPrediction.kg')}</Text>
          </View>
          
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>{t('yieldPrediction.totalPesticide')}:</Text>
            <Text style={styles.dataValue}>{formatRange(yieldData.total_pesticide_range)} {t('yieldPrediction.liters')}</Text>
          </View>
          
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>{t('yieldPrediction.totalYield')}:</Text>
            <Text style={styles.dataValue}>{formatRange(yieldData.total_yield_range)} {t('yieldPrediction.tons')}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>{t('common.close')}</Text>
          </TouchableOpacity>
          <ScrollView style={styles.modalScrollView}>
            {selectedTile && (
              <>
                <Text style={styles.modalTitle}>{t(selectedTile.titleKey)}</Text>
                <View style={styles.tileDetailImage}>
                  <Text style={styles.tileDetailImageText}>{selectedTile.image}</Text>
                </View>
                <Text style={styles.tileDetailDescription}>{t(selectedTile.descriptionKey)}</Text>
                
                {selectedTileId === 1 ? (
                  renderCropRecommendation()
                ) : selectedTileId === 2 ? (
                  showInputForm ? renderInputForm() : renderYieldPrediction()
                ) : (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Coming Soon</Text>
                    <Text style={styles.detailText}>Coming Soon</Text>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    // marginBottom: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e8a3a',
    marginBottom: 20,
    textAlign: 'center',
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
  // Yield prediction styles
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#1e8a3a',
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingSubtext: {
    marginTop: 5,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  yieldContainer: {
    marginBottom: 40,
  },
  yieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  yieldTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e8a3a',
    flex: 1,
  },
  backButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  backButtonText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  yieldMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#1e8a3a',
    fontWeight: 'bold',
  },
  dataSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#1e8a3a',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e8a3a',
    marginBottom: 15,
    textAlign: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  dataLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    fontWeight: '500',
  },
  dataValue: {
    fontSize: 14,
    color: '#1e8a3a',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  offlineIndicator: {
    backgroundColor: '#fef3c7',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  offlineText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
    textAlign: 'center',
  },
  // Input form styles
  inputFormContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#1e8a3a',
  },
  inputFormTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e8a3a',
    textAlign: 'center',
    marginBottom: 10,
  },
  inputFormSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#374151',
  },
  submitButton: {
    backgroundColor: '#1e8a3a',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
    opacity: 0.7,
  },
  submitButtonLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Crop recommendation styles
  cropRecommendationContainer: {
    marginTop: 10,
  },
  cropRecommendationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e8a3a',
    marginBottom: 20,
    textAlign: 'center',
  },
  recommendedCropCard: {
    backgroundColor: '#E7FFC7',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#1e8a3a',
  },
  recommendedCropText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e8a3a',
    marginBottom: 5,
  },
  recommendedCropSubtext: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  recommendationMessage: {
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#1e8a3a',
  },
  messageText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'center',
  },
  recommendationDetails: {
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e8a3a',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  detailLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#1e8a3a',
    fontWeight: 'bold',
  },
  errorIndicator: {
    backgroundColor: '#fef3c7',
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  errorText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default TileDetailsModal;
