// app/components/AnswerOption.jsx
import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import colors from '../constants/colors';

const AnswerOption = ({ option, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.option,
        isSelected && styles.selectedOption,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.optionText,
          isSelected && styles.selectedText,
        ]}
      >
        {option}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  option: {
    padding: 15,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight, // Add this to colors.js if not present
  },
  optionText: {
    fontSize: 14,
    color: colors.gray,
  },
  selectedText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default AnswerOption;