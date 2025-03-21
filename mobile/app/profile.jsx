// app/profile.jsx
import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import colors from '../constants/colors';
import useAuthStore from '../stores/authStore';
import useCertificationStore from '../stores/certificationStore';
import UserProfileForm from '../components/UserProfileForm';
import CertificationCard from '../components/CertificationCard';
import ProgressBar from '../components/ProgressBar';
import TestHistoryCard from '../components/TestHistoryCard';

const ProfileScreen = () => {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const { enrolledCertifications, fetchEnrolledCertifications } = useCertificationStore();
  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    await fetchEnrolledCertifications();
    await fetchTestHistory();
    setLoading(false);
  };

  const fetchTestHistory = async () => {
    try {
      const response = await axios.get(
        'http://your-backend-url/api/tests/history', // Replace with your endpoint
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTestHistory(response.data);
    } catch (error) {
      console.error('Error fetching test history:', error);
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      await updateUser(updatedData);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleCertificationPress = (certificationId) => {
    router.push(`/certification/${certificationId}`);
  };

  const handleTestPress = (testId) => {
    router.push(`/results?testId=${testId}`);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <ScrollView style={styles.content}>
        <UserProfileForm user={user} onUpdate={handleUpdateProfile} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enrolled Certifications</Text>
          {enrolledCertifications.length > 0 ? (
            enrolledCertifications.map((cert) => (
              <CertificationCard
                key={cert._id}
                certification={cert}
                onPress={handleCertificationPress}
                onEnroll={() => {}} // Disabled since already enrolled
              />
            ))
          ) : (
            <Text style={styles.noItemsText}>No certifications enrolled</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress Tracking</Text>
          <ProgressBar
            label="Tests Completed"
            value={user.testsCompleted || 0}
            maxValue={10} // Adjust max based on your app's logic
            color={colors.primary}
          />
          <ProgressBar
            label="Average Score"
            value={user.avgScore || 0}
            maxValue={100}
            color={colors.success}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test History</Text>
          {testHistory.length > 0 ? (
            testHistory.map((test) => (
              <TestHistoryCard
                key={test._id}
                test={test}
                onPress={() => handleTestPress(test._id)}
              />
            ))
          ) : (
            <Text style={styles.noItemsText}>No test history available</Text>
          )}
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
    color: colors.primary,
    marginBottom: 15,
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
});

export default ProfileScreen;