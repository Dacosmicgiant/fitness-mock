import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '../constants/colors';
import useAuthStore from '../stores/authStore';

const HomeScreen = () => {
  const router = useRouter();
  const { user, logoutUser } = useAuthStore();

  const handleLogout = async () => {
    await logoutUser();
    // AuthGuard in _layout.js will automatically redirect to login
  };

  const menuItems = [
    {
      id: 'study',
      title: 'Study Materials',
      icon: 'book-outline',
      description: 'Access comprehensive study materials for all certifications',
    },
    {
      id: 'practice',
      title: 'Practice Exams',
      icon: 'create-outline',
      description: 'Test your knowledge with thousands of practice questions',
    },
    {
      id: 'flashcards',
      title: 'Flashcards',
      icon: 'albums-outline',
      description: 'Review key concepts with digital flashcards',
    },
    {
      id: 'progress',
      title: 'My Progress',
      icon: 'bar-chart-outline',
      description: 'Track your study progress and test scores',
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Ready to ace your certification?</Text>
          <Text style={styles.bannerText}>
            Complete daily practice quizzes to improve your exam readiness.
          </Text>
          <TouchableOpacity style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Start Daily Quiz</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Menu</Text>
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon} size={24} color={colors.white} />
              </View>
              <Text style={styles.menuItemTitle}>{item.title}</Text>
              <Text style={styles.menuItemDescription}>{item.description}</Text>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={colors.gray} 
                style={styles.menuArrow}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Days Studied</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>42</Text>
              <Text style={styles.statLabel}>Quizzes Taken</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>78%</Text>
              <Text style={styles.statLabel}>Avg. Score</Text>
            </View>
          </View>
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
    position: 'relative',
  },
  menuIconContainer: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 13,
    color: colors.gray,
    width: '65%',
  },
  menuArrow: {
    position: 'absolute',
    right: 15,
  },
  statsContainer: {
    marginBottom: 30,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '31%',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 5,
  },
});

export default HomeScreen;