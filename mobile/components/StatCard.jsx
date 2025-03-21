import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const StatCard = ({ number, label, icon }) => {
  return (
    <View style={styles.statItem}>
      <Ionicons name={icon} size={20} color={colors.primary} style={styles.statIcon} />
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statItem: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '31%',
  },
  statIcon: {
    marginBottom: 5,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default StatCard;