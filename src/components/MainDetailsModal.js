import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

const MainDetailsModal = ({ 
  visible, 
  onClose, 
  location, 
  soilData, 
  weatherData, 
  cropData 
}) => {
  const { t } = useTranslation();

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
            <Text style={styles.modalTitle}>{t('mainScreen.detailedStats')}</Text>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>{t('mainScreen.locationDetails')}</Text>
              <Text style={styles.detailText}>{t('common.location')}: {location || t('common.notAvailable')}</Text>
              <Text style={styles.detailText}>GPS Coordinates: Available</Text>
              <Text style={styles.detailText}>{t('common.lastUpdated')}: {t('common.justNow')}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>{t('mainScreen.soilAnalysis')}</Text>
              <Text style={styles.detailText}>{t('soilData.type')}: {soilData.type}</Text>
              <Text style={styles.detailText}>{t('soilData.moisture')}: {soilData.moisture}</Text>
              <Text style={styles.detailText}>{t('soilData.phLevel')}: 6.8 ({t('soilData.optimal')})</Text>
              <Text style={styles.detailText}>{t('soilData.nitrogen')}: 45 {t('soilData.ppm')}</Text>
              <Text style={styles.detailText}>{t('soilData.phosphorus')}: 32 {t('soilData.ppm')}</Text>
              <Text style={styles.detailText}>{t('soilData.potassium')}: 28 {t('soilData.ppm')}</Text>
              <Text style={styles.detailText}>{t('common.dataSource')}: IoT Sensor</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>{t('mainScreen.weatherConditions')}</Text>
              <Text style={styles.detailText}>{t('weatherData.temperature')}: {weatherData.temperature}</Text>
              <Text style={styles.detailText}>{t('weatherData.humidity')}: {weatherData.humidity}</Text>
              <Text style={styles.detailText}>{t('weatherData.condition')}: {weatherData.condition}</Text>
              <Text style={styles.detailText}>{t('weatherData.windSpeed')}: 12 {t('weatherData.kmh')}</Text>
              <Text style={styles.detailText}>{t('weatherData.pressure')}: 1013 {t('weatherData.hPa')}</Text>
              <Text style={styles.detailText}>{t('common.dataSource')}: Weather API</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>{t('mainScreen.cropInformation')}</Text>
              <Text style={styles.detailText}>{t('cropData.selectedCrop')}: {cropData}</Text>
              <Text style={styles.detailText}>{t('cropData.plantingDate')}: {t('cropData.notSet')}</Text>
              <Text style={styles.detailText}>{t('cropData.expectedHarvest')}: {t('cropData.notSet')}</Text>
              <Text style={styles.detailText}>{t('cropData.growthStage')}: {t('cropData.notApplicable')}</Text>
            </View>
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
});

export default MainDetailsModal;
