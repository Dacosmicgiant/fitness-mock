// app/certifications/index.jsx
import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import colors from '../../../constants/colors';
import CertificationCard from '../../../components/CertificationCard';
import useCertificationStore from '../../../stores/certificationStore';

const CertificationListingScreen = () => {
  const router = useRouter();
  const { certifications, fetchCertifications, enrollInCertification } = useCertificationStore();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    setLoading(true);
    await fetchCertifications();
    setLoading(false);
  };

  const handleEnroll = async (certificationId) => {
    try {
      await enrollInCertification(certificationId);
      router.push(`/certification/${certificationId}`);
    } catch (error) {
      console.error('Enrollment error:', error);
      // Add error handling modal here later
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCertifications();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Certifications</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
        >
          {certifications.length > 0 ? (
            certifications.map((cert) => (
              <CertificationCard
                key={cert._id}
                certification={cert}
                onEnroll={handleEnroll}
                onPress={(id) => router.push(`/certification/${id}`)}
              />
            ))
          ) : (
            <View style={styles.noCertContainer}>
              <Text style={styles.noCertText}>No certifications available</Text>
            </View>
          )}
        </ScrollView>
      )}
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
  noCertContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noCertText: {
    fontSize: 16,
    color: colors.gray,
  },
});

export default CertificationListingScreen;