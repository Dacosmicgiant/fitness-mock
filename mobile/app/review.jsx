// app/review.jsx
import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import colors from '../constants/colors';
import ReviewQuestionComponent from '../components/ReviewQuestionComponent';

const ReviewAnswersScreen = () => {
  const router = useRouter();
  const { testId } = useLocalSearchParams();
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviewData();
  }, [testId]);

  const fetchReviewData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://your-backend-url/api/tests/${testId}/review`, // Replace with your endpoint
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setReviewData(response.data);
    } catch (error) {
      console.error('Error fetching review data:', error);
    } finally {
      setLoading(false);
    }
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

  if (!reviewData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Review data not available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { questions, answers } = reviewData;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Review Answers</Text>
      </View>
      <ScrollView style={styles.content}>
        {questions.map((question, index) => (
          <ReviewQuestionComponent
            key={question._id}
            question={question}
            userAnswer={answers[question._id]}
          />
        ))}
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

export default ReviewAnswersScreen;