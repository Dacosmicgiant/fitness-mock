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
import colors from '../constants/colors';
import useAuthStore from '../stores/authStore';
import useCertificationStore from '../stores/certificationStore';
import EnrolledCertCard from '../components/EnrolledCertCard';
import StatCard from '../components/StatCard';

const HomeScreen = () => {
  const router = useRouter();
  const { user, logoutUser } = useAuthStore();
  const { enrolledCertifications, fetchEnrolledCertifications } = useCertificationStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchEnrolledCertifications();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    // AuthGuard in _layout.js will automatically redirect to login
  };

  const handleStartQuiz = () => {
    router.push('/(tabs)/certifications');
  };

  const handleViewProgress = () => {
    router.push('/(tabs)/profile')
  };

  const handleSubscription = () => {
    router.push('/(tabs)/home/subscription')
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEnrolledCertifications();
    setRefreshing(false);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image 
            source={require('../assets/images/logo.png')} 
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
          <>
            <View style={styles.enrolledContainer}>
              <Text style={styles.sectionTitle}>Your Certifications</Text>
              {enrolledCertifications.map((cert) => (
                <EnrolledCertCard 
                  key={cert._id} 
                  certification={cert} 
                  onPress={() => router.push(`/certification/${cert._id}`)}
                />
              ))}
            </View>
          </>
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
  banner: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bannerText: {
    color: colors.white,
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 15,
  },
  bannerButton: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
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
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuIconContainer: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 13,
    color: colors.gray,
  },
  menuArrow: {
    marginLeft: 10,
  },
  enrolledContainer: {
    marginBottom: 25,
  },
  noEnrollmentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 30,
    marginBottom: 25,
  },
  noEnrollmentText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  enrollNowButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  enrollNowButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  statsContainer: {
    marginBottom: 30,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default HomeScreen;