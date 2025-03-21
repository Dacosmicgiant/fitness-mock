// app/components/SubscriptionCard.jsx
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const SubscriptionCard = ({ plan, isActive, onSelect }) => {
  return (
    <View style={[styles.card, isActive && styles.activeCard]}>
      <View style={styles.header}>
        <Text style={styles.planName}>{plan.name}</Text>
        {isActive && (
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
        )}
      </View>
      <Text style={styles.price}>${plan.price}/{plan.duration}</Text>
      <Text style={styles.description}>{plan.description}</Text>
      <TouchableOpacity
        style={[styles.button, isActive && styles.activeButton]}
        onPress={() => onSelect(plan._id)}
        disabled={isActive}
      >
        <Text style={styles.buttonText}>
          {isActive ? 'Current Plan' : 'Subscribe Now'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  activeCard: {
    borderColor: colors.success,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 15,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: colors.lightGray,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SubscriptionCard;