// app/certification/[id].jsx
import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import colors from '../../../constants/colors';
import ModuleCard from '../../../components/ModuleCard';
import TestCard from '../../../components/TestCard';
import useCertificationStore from '../../../stores/certificationStore';

const CertificationDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { certifications, fetchCertifications } = useCertificationStore();
  const [certification, setCertification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertification();
  }, [id]);

  const loadCertification = async () => {
    setLoading(true);
    if (!certifications.length) {
      await fetchCertifications();
    }
    const cert = certifications.find(c => c._id === id);
    setCertification(cert);
    setLoading(false);
  };

  const handleModulePress = (moduleId) => {
    router.push(`/module/${moduleId}`);
  };

  const handleTestPress = (testType) => {
    router.push({
      pathname: '/test-config',
      params: { certificationId: id, testType }
    });
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

  if (!certification) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Certification not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const mockTests = [
    { name: 'Full Practice Test', questions: 100, duration: 120, type: 'full' },
    { name: 'Quick Test', questions: 25, duration: 30, type: 'quick' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{certification.title}</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{certification.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Syllabus Overview</Text>
          <Text style={styles.syllabus}>{certification.syllabus || 'Comprehensive fitness specialist training'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Modules</Text>
          {certification.modules && certification.modules.length > 0 ? (
            certification.modules.map((module) => (
              <ModuleCard 
                key={module._id} 
                module={module} 
                onPress={handleModulePress}
              />
            ))
          ) : (
            <Text style={styles.noItemsText}>No modules available</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mock Tests</Text>
          {mockTests.map((test) => (
            <TestCard 
              key={test.type} 
              test={test} 
              onPress={() => handleTestPress(test.type)}
            />
          ))}
        </View>
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
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.primary,
  },
  description: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
  syllabus: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
  noItemsText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.gray,
  },
});

export default CertificationDetailScreen;