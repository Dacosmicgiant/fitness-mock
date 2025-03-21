// app/test.jsx
import React, { useState, useEffect } from 'react';
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
import QuestionComponent from '../components/QuestionComponent';
import Timer from '../components/Timer';
import Pagination from '../components/Pagination';

const TestTakingScreen = () => {
  const router = useRouter();
  const { 
    certificationId, 
    moduleId, 
    testType, 
    numQuestions, 
    difficultyMix, 
    timeLimit 
  } = useLocalSearchParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const parsedDifficultyMix = JSON.parse(difficultyMix);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://your-backend-url/api/tests/generate', // Replace with your endpoint
        {
          certificationId,
          moduleId,
          testType,
          numQuestions: parseInt(numQuestions),
          difficultyMix: parsedDifficultyMix,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleTimeUp = () => {
    submitTest();
  };

  const submitTest = async () => {
    try {
      const response = await axios.post(
        'http://your-backend-url/api/tests/submit', // Replace with your endpoint
        {
          certificationId,
          moduleId,
          testType,
          answers,
          timeTaken: (parseInt(timeLimit) * 60) - (timeLeft || 0),
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      router.push({
        pathname: '/results',
        params: { testId: response.data.testId },
      });
    } catch (error) {
      console.error('Error submitting test:', error);
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

  const currentQuestion = questions[currentPage];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {testType === 'module' ? 'Module Test' : 'Practice Test'}
        </Text>
        <Timer timeLimit={parseInt(timeLimit)} onTimeUp={handleTimeUp} />
      </View>
      <ScrollView style={styles.content}>
        {currentQuestion && (
          <QuestionComponent
            question={currentQuestion}
            selectedAnswer={answers[currentQuestion._id]}
            onSelectAnswer={(answer) => handleAnswerSelect(currentQuestion._id, answer)}
          />
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={questions.length}
          onPageChange={setCurrentPage}
        />
        <TouchableOpacity style={styles.submitButton} onPress={submitTest}>
          <Text style={styles.submitButtonText}>Submit Test</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TestTakingScreen;