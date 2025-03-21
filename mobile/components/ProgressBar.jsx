// app/components/ProgressBar.jsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import colors from '../constants/colors';

const ProgressBar = ({ label, value, maxValue, color }) => {
  const percentage = (value / maxValue) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}: {value}/{maxValue}</Text>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.bar,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 5,
  },
  barContainer: {
    height: 10,
    backgroundColor: colors.lightGray,
    borderRadius: 5,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 5,
  },
});

export default ProgressBar;