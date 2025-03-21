// app/components/ScoreCard.jsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const ScoreCard = ({ score, totalQuestions, timeTaken }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name="trophy-outline" size={30} color={colors.white} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Your Score</Text>
        <Text style={styles.score}>{score}/{totalQuestions}</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
        <Text style={styles.time}>
          Time Taken: {minutes}m {seconds}s
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray,
  },
  percentage: {
    fontSize: 20,
    color: colors.primary,
    marginVertical: 5,
  },
  time: {
    fontSize: 14,
    color: colors.gray,
  },
});

export default ScoreCard;