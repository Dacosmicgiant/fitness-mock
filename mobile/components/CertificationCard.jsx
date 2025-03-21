// app/components/CertificationCard.jsx
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const CertificationCard = ({ certification, onEnroll, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(certification._id)}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="school-outline" size={24} color={colors.white} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{certification.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {certification.description}
          </Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.enrollButton}
        onPress={() => onEnroll(certification._id)}
      >
        <Text style={styles.enrollButtonText}>Enroll</Text>
      </TouchableOpacity>
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
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  enrollButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  enrollButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default CertificationCard;