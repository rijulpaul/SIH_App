import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TILE_DATA } from '../constants';

const { height } = Dimensions.get('window');

const TileGrid = ({ onTilePress }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.tileSection}>
      {TILE_DATA.map((tile) => (
        <TouchableOpacity 
          key={tile.id} 
          style={styles.tileBlock}
          onPress={() => onTilePress(tile.id)}
          activeOpacity={0.8}
        >
          <View style={styles.tileImage}>
            <Text style={styles.tileImageText}>{tile.image}</Text>
          </View>
          <View style={styles.tileContent}>
            <Text style={styles.tileTitle}>{t(tile.titleKey)}</Text>
            <Text style={styles.tileDescription}>{t(tile.descriptionKey)}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default TileGrid;
