// app/results.jsx
import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import colors from '../constants/colors';
import ScoreCard from '../components/ScoreCard';
import ProgressBar from '../components/ProgressBar';

const ResultsScreen = () => {
  const router = useRouter();
  const { testId } = useLocalSearchParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [testId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://your-backend-url/api/tests/${testId}/results`, // Replace with your endpoint
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAnswers = () => {
    router.push({
      pathname: '/review',
      params: { testId },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!results) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Results not available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { score, totalQuestions, timeTaken, performance } = results;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Test Results</Text>
      </View>
      <ScrollView style={styles.content}>
        <ScoreCard 
          score={score} 
          totalQuestions={totalQuestions} 
          timeTaken={timeTaken} 
        />
        
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <ProgressBar 
            label="Correct Answers" 
            value={score} 
            maxValue={totalQuestions} 
            color={colors.primary} 
          />
          <ProgressBar 
            label="Easy Questions" 
            value={performance.easy.correct} 
            maxValue={performance.easy.total} 
            color="#4CAF50" // Green
          />
          <ProgressBar 
            label="Medium Questions" 
            value={performance.medium.correct} 
            maxValue={performance.medium.total} 
            color="#FFC107" // Yellow
          />
          <ProgressBar 
            label="Hard Questions" 
            value={performance.hard.correct} 
            maxValue={performance.hard.total} 
            color="#F44336" // Red
          />
        </View>

        <TouchableOpacity 
          style={styles.reviewButton} 
          onPress={handleReviewAnswers}
        >
          <Text style={styles.reviewButtonText}>Review Answers</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  metricsSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
  },
  reviewButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.gray,
  },
});

export default ResultsScreen;