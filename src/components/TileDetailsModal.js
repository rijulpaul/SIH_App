import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TILE_DATA } from '../constants';

const TileDetailsModal = ({ visible, onClose, selectedTileId }) => {
  const { t } = useTranslation();

  const selectedTile = selectedTileId ? TILE_DATA.find(tile => tile.id === selectedTileId) : null;

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
});

export default TileDetailsModal;
