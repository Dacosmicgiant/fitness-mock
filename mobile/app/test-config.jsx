// app/test-config.jsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import colors from '../constants/colors';
import TestConfigForm from '../components/TestConfigForm';

const TestConfigurationScreen = () => {
  const router = useRouter();
  const { certificationId, moduleId, testType } = useLocalSearchParams();
  const [numQuestions, setNumQuestions] = useState(50);
  const [difficultyMix, setDifficultyMix] = useState({
    easy: 50,
    medium: 30,
    hard: 20,
  });
  const [timeLimit, setTimeLimit] = useState(60);

  const validateDifficultyMix = () => {
    const total = difficultyMix.easy + difficultyMix.medium + difficultyMix.hard;
    return total === 100;
  };

  const handleSubmit = () => {
    if (!validateDifficultyMix()) {
      alert('Difficulty mix must add up to 100%');
      return;
    }
    if (timeLimit <= 0) {
      alert('Please set a valid time limit');
      return;
    }

    router.push({
      pathname: '/test',
      params: {
        certificationId,
        moduleId,
        testType,
        numQuestions,
        difficultyMix: JSON.stringify(difficultyMix),
        timeLimit,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configure Your Test</Text>
        <Text style={styles.headerSubtitle}>
          Customize your practice test settings
        </Text>
      </View>
      <TestConfigForm
        numQuestions={numQuestions}
        setNumQuestions={setNumQuestions}
        difficultyMix={difficultyMix}
        setDifficultyMix={setDifficultyMix}
        timeLimit={timeLimit}
        setTimeLimit={setTimeLimit}
        onSubmit={handleSubmit}
      />
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
  headerSubtitle: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 5,
  },
});

export default TestConfigurationScreen;