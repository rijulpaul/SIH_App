import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BOTTOM_BOXES } from '../constants';

const { height } = Dimensions.get('window');

const BottomBoxes = ({ onBoxPress }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.bottomBoxes}>
      {BOTTOM_BOXES.map((box) => (
        <TouchableOpacity 
          key={box.id} 
          style={styles.bottomBox}
          onPress={() => onBoxPress(box.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.bottomBoxIcon}>{box.icon}</Text>
          <Text style={styles.bottomBoxText}>{t(box.titleKey)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBoxes: {
    height: height * 0.08,
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
    fontSize: 20,
    marginBottom: 8,
  },
  bottomBoxText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
});

export default BottomBoxes;
