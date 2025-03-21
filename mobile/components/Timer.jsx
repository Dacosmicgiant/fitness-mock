// app/components/Timer.jsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import colors from '../constants/colors';

const Timer = ({ timeLimit, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Convert minutes to seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Text style={styles.timer}>
      Time Left: {formatTime()}
    </Text>
  );
};

const styles = StyleSheet.create({
  timer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default Timer;