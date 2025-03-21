// app/components/QuestionComponent.jsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import colors from '../constants/colors';
import AnswerOption from './AnswerOption';

const QuestionComponent = ({ question, selectedAnswer, onSelectAnswer }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.text}</Text>
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <AnswerOption
            key={index}
            option={option}
            isSelected={selectedAnswer === option}
            onPress={() => onSelectAnswer(option)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 15,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 10,
  },
});

export default QuestionComponent;