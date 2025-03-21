// app/components/TestConfigForm.jsx
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const TestConfigForm = ({ 
  numQuestions, 
  setNumQuestions, 
  difficultyMix, 
  setDifficultyMix, 
  timeLimit, 
  setTimeLimit, 
  onSubmit 
}) => {
  const questionOptions = [25, 50, 75, 100];

  return (
    <View style={styles.form}>
      <View style={styles.section}>
        <Text style={styles.label}>Number of Questions</Text>
        <View style={styles.optionRow}>
          {questionOptions.map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.optionButton,
                numQuestions === num && styles.selectedOption,
              ]}
              onPress={() => setNumQuestions(num)}
            >
              <Text 
                style={[
                  styles.optionText,
                  numQuestions === num && styles.selectedText,
                ]}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Difficulty Mix</Text>
        <View style={styles.difficultyRow}>
          <View style={styles.difficultyInput}>
            <Text style={styles.difficultyLabel}>Easy (%)</Text>
            <TextInput
              style={styles.input}
              value={difficultyMix.easy.toString()}
              onChangeText={(text) => setDifficultyMix({ ...difficultyMix, easy: parseInt(text) || 0 })}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
          <View style={styles.difficultyInput}>
            <Text style={styles.difficultyLabel}>Medium (%)</Text>
            <TextInput
              style={styles.input}
              value={difficultyMix.medium.toString()}
              onChangeText={(text) => setDifficultyMix({ ...difficultyMix, medium: parseInt(text) || 0 })}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
          <View style={styles.difficultyInput}>
            <Text style={styles.difficultyLabel}>Hard (%)</Text>
            <TextInput
              style={styles.input}
              value={difficultyMix.hard.toString()}
              onChangeText={(text) => setDifficultyMix({ ...difficultyMix, hard: parseInt(text) || 0 })}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
        </View>
        <Text style={styles.note}>
          Total must equal 100%
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Time Limit (minutes)</Text>
        <TextInput
          style={styles.input}
          value={timeLimit.toString()}
          onChangeText={(text) => setTimeLimit(parseInt(text) || 0)}
          keyboardType="numeric"
          placeholder="Enter minutes"
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
        <Text style={styles.submitButtonText}>Start Test</Text>
        <Ionicons name="arrow-forward" size={20} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: colors.gray,
  },
  selectedText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  difficultyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  difficultyLabel: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: colors.white,
  },
  note: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 5,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default TestConfigForm;