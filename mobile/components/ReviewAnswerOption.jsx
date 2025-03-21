// app/components/ReviewAnswerOption.jsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const ReviewAnswerOption = ({ option, isSelected, isCorrect, userAnswer }) => {
  const isUserChoice = option === userAnswer;
  const showCorrect = isCorrect && isSelected;
  const showIncorrect = isSelected && !isCorrect && isUserChoice;

  return (
    <View
      style={[
        styles.option,
        showCorrect && styles.correctOption,
        showIncorrect && styles.incorrectOption,
      ]}
    >
      <Text
        style={[
          styles.optionText,
          showCorrect && styles.correctText,
          showIncorrect && styles.incorrectText,
        ]}
      >
        {option}
      </Text>
      {showCorrect && (
        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
      )}
      {showIncorrect && (
        <Ionicons name="close-circle" size={20} color={colors.error} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  option: {
    padding: 15,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  correctOption: {
    borderColor: colors.success,
    backgroundColor: '#E8F5E9', // Light green
  },
  incorrectOption: {
    borderColor: colors.error,
    backgroundColor: '#FFEBEE', // Light red
  },
  optionText: {
    fontSize: 14,
    color: colors.gray,
  },
  correctText: {
    color: colors.success,
    fontWeight: 'bold',
  },
  incorrectText: {
    color: colors.error,
    fontWeight: 'bold',
  },
});

export default ReviewAnswerOption;