import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  ScrollView,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '../../constants/colors';
import useAuthStore from '../../stores/authStore';
import useCertificationStore from '../../stores/certificationStore';
import EnrolledCertCard from '../../components/EnrolledCertCard';
import StatCard from '../../components/StatCard';

const HomeScreen = () => {
  const router = useRouter();
  const { user, logoutUser, isAuthenticated } = useAuthStore();
  const { enrolledCertifications, fetchEnrolledCertifications, isLoading, error } = useCertificationStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('Fetching enrolled certifications...');
      fetchEnrolledCertifications().catch((error) => {
        console.error('Error fetching certifications:', error);
      });
    }
  }, [isAuthenticated]);

  console.log('User:', user);
  console.log('Enrolled Certifications:', enrolledCertifications);

  const handleLogout = async () => {
    console.log('Logging out...');
    await logoutUser();
  };

  const handleStartQuiz = () => {
    console.log('Navigating to certifications');
    router.push('/(tabs)/certifications');
  };

  const handleViewProgress = () => {
    console.log('Navigating to profile');
    router.push('/(tabs)/profile');
  };

  const handleSubscription = () => {
    console.log('Navigating to subscription');
    router.push('/subscription');
  };
  
  const onRefresh = async () => {
    if (isAuthenticated) {
      console.log('Refreshing certifications...');
      setRefreshing(true);
      await fetchEnrolledCertifications().catch((error) => {
        console.error('Error refreshing certifications:', error);
      });
      setRefreshing(false);
    }
  };

  const menuItems = [
    {
      id: 'practice',
      title: 'Practice Exams',
      icon: 'create-outline',
      description: 'Test your knowledge with thousands of practice questions',
      onPress: handleStartQuiz
    },
    {
      id: 'progress',
      title: 'My Progress',
      icon: 'bar-chart-outline',
      description: 'Track your study progress and test scores',
      onPress: handleViewProgress
    },
  ];

  console.log('Rendering HomeScreen');

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noAuthContainer}>
          <Text style={styles.noAuthText}>Please log in to access your dashboard</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'Fitness Specialist'}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        {isLoading ? (
          <Text style={styles.loadingText}>Loading certifications...</Text>
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Menu</Text>
            <View style={styles.menuContainer}>
              {menuItems.map((item) => (
                <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
                  <View style={styles.menuIconContainer}>
                    <Ionicons name={item.icon} size={24} color={colors.white} />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemDescription}>{item.description}</Text>
                  </View>
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={colors.gray} 
                    style={styles.menuArrow}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {enrolledCertifications.length > 0 ? (
              <View style={styles.enrolledContainer}>
                <Text style={styles.sectionTitle}>Your Certifications</Text>
                {enrolledCertifications.map((cert) => (
                  <EnrolledCertCard 
                    key={cert._id} 
                    certification={cert} 
                    onPress={() => router.push(`/(tabs)/certifications/${cert._id}`)}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.noEnrollmentContainer}>
                <Ionicons name="document-outline" size={50} color={colors.lightGray} />
                <Text style={styles.noEnrollmentText}>
                  You haven't enrolled in any certifications yet
                </Text>
                <TouchableOpacity 
                  style={styles.enrollNowButton}
                  onPress={handleStartQuiz}
                >
                  <Text style={styles.enrollNowButtonText}>Explore Certifications</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.gray,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  menuContainer: {
    marginBottom: 25,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: colors.gray,
  },
  menuArrow: {
    marginLeft: 8,
  },
  enrolledContainer: {
    marginBottom: 25,
  },
  noEnrollmentContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noEnrollmentText: {
    fontSize: 16,
    color: colors.gray,
    marginTop: 12,
    textAlign: 'center',
  },
  enrollNowButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  enrollNowButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    color: colors.gray,
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    color: colors.error,
    marginTop: 20,
  },
  noAuthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noAuthText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen; 