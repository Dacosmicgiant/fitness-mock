import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const EnrolledCertCard = ({ certification, onPress }) => {
  // Calculate progress percentage (mock data - in real app would come from the certification object)
  const progress = certification.progress || Math.floor(Math.random() * 100);
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="ribbon-outline" size={24} color={colors.white} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{certification.title}</Text>
          <View style={styles.progressWrapper}>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.gray} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  contentContainer: {
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
    marginBottom: 8,
  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: colors.lightGray,
    borderRadius: 3,
    marginRight: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.gray,
    minWidth: 35,
  },
});

export default EnrolledCertCard;