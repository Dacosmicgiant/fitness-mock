// app/components/ReviewQuestionComponent.jsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import colors from '../constants/colors';
import ReviewAnswerOption from './ReviewAnswerOption';

const ReviewQuestionComponent = ({ question, userAnswer }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.text}</Text>
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <ReviewAnswerOption
            key={index}
            option={option}
            isSelected={option === question.correctAnswer}
            isCorrect={option === question.correctAnswer}
            userAnswer={userAnswer}
          />
        ))}
      </View>
      <View style={styles.explanationContainer}>
        <Text style={styles.explanationLabel}>Explanation:</Text>
        <Text style={styles.explanationText}>
          {question.explanation || 'No explanation provided.'}
        </Text>
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
    marginBottom: 15,
  },
  explanationContainer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  explanationLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  explanationText: {
    fontSize: 13,
    color: colors.gray,
    lineHeight: 18,
  },
});

export default ReviewQuestionComponent;