import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../constants';

const LanguageSelector = ({ visible, onLanguageSelect, onContinue }) => {
  const { t, i18n } = useTranslation();

  const handleLanguageSelect = async (languageCode) => {
    await i18n.changeLanguage(languageCode);
    onLanguageSelect(languageCode);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{t('languageSelector.title')}</Text>
          <Text style={styles.subtitle}>{t('languageSelector.subtitle')}</Text>
          
          <View style={styles.languageList}>
            {LANGUAGES.map((language) => (
              <TouchableOpacity
                key={language.value}
                style={[
                  styles.languageItem,
                  i18n.language === language.value && styles.selectedLanguageItem
                ]}
                onPress={() => handleLanguageSelect(language.value)}
              >
                <Text style={[
                  styles.languageText,
                  i18n.language === language.value && styles.selectedLanguageText
                ]}>
                  {language.label}
                </Text>
                {i18n.language === language.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
            <Text style={styles.continueButtonText}>{t('languageSelector.continue')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e8a3a',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  languageList: {
    marginBottom: 30,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedLanguageItem: {
    backgroundColor: '#E7FFC7',
    borderColor: '#1e8a3a',
  },
  languageText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  selectedLanguageText: {
    color: '#1e8a3a',
    fontWeight: 'bold',
  },
  checkmark: {
    fontSize: 18,
    color: '#1e8a3a',
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#1e8a3a',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LanguageSelector;
