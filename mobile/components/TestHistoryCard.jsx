// app/components/TestHistoryCard.jsx
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const TestHistoryCard = ({ test, onPress }) => {
  const percentage = Math.round((test.score / test.totalQuestions) * 100);
  const date = new Date(test.completedAt).toLocaleDateString();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name="document-outline" size={24} color={colors.white} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{test.testType} Test</Text>
        <Text style={styles.description}>
          Score: {test.score}/{test.totalQuestions} ({percentage}%) • {date}
        </Text>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={colors.gray} 
        style={styles.arrow}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: colors.gray,
  },
  arrow: {
    marginLeft: 10,
  },
});

export default TestHistoryCard;