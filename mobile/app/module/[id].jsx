// app/module/[id].jsx
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
import colors from '../../constants/colors';
import TestCard from '../../components/TestCard';
import useCertificationStore from '../../stores/certificationStore';

const ModuleDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { fetchModule } = useCertificationStore(); // Updated to use fetchModule
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModule();
  }, [id]);

  const loadModule = async () => {
    setLoading(true);
    try {
      const moduleData = await fetchModule(id);
      setModule(moduleData);
    } catch (error) {
      setModule(null);
    }
    setLoading(false);
  };

  const handleTestPress = (testType) => {
    router.push({
      pathname: '/test-config',
      params: { moduleId: id, testType }
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

  if (!module) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Module not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const moduleTests = [
    { name: 'Module Practice Test', questions: 50, duration: 60, type: 'module' },
    { name: 'Quick Module Quiz', questions: 15, duration: 20, type: 'quick' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{module.title}</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{module.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Tests</Text>
          {moduleTests.map((test) => (
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

export default ModuleDetailScreen;