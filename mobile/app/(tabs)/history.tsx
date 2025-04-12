import React, { FC, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList, // We'll use FlatList for the history section
  SafeAreaView,
  ScrollView, // Use ScrollView for overall layout if needed, but FlatList might suffice
} from 'react-native';
// Removed react-native-progress import
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'; // Example icon import

// --- Type Definitions ---

interface TestResult {
  id: string;
  testName: string;
  subject: string;
  dateTaken: Date; // Use Date object
  score: number;
  totalMarks: number;
  // timeTakenMinutes?: number; // Optional: Time taken
}

interface UserAnalytics {
  totalTestsTaken: number;
  overallAccuracy: number | null; // Percentage (0-100), null if no tests
  averageScore: number | null; // Average percentage score, null if no tests
  // We could add more complex analytics like subject performance later
}

// --- Mock Data (Replace with actual data fetching) ---

const testHistoryData: TestResult[] = [
  { id: 't1', testName: 'Algebra Basics Quiz', subject: 'Mathematics', dateTaken: new Date(2025, 3, 10, 10, 30), score: 85, totalMarks: 100 },
  { id: 't2', testName: 'Newton\'s Laws Mock Test', subject: 'Physics', dateTaken: new Date(2025, 3, 8, 14, 0), score: 72, totalMarks: 100 },
  { id: 't3', testName: 'Cell Biology Assessment', subject: 'Biology', dateTaken: new Date(2025, 3, 5, 9, 15), score: 91, totalMarks: 100 },
  { id: 't4', testName: 'Calculus Chapter 1 Test', subject: 'Mathematics', dateTaken: new Date(2025, 2, 28, 11, 0), score: 78, totalMarks: 100 },
  { id: 't5', testName: 'Thermodynamics Quiz', subject: 'Physics', dateTaken: new Date(2025, 2, 25, 16, 45), score: 65, totalMarks: 100 },
  { id: 't6', testName: 'Genetics Mock Exam', subject: 'Biology', dateTaken: new Date(2025, 2, 20, 13, 30), score: 88, totalMarks: 100 },
];

// --- Utility Function ---
const calculateAnalytics = (history: TestResult[]): UserAnalytics => {
  const totalTestsTaken = history.length;
  if (totalTestsTaken === 0) {
    return { totalTestsTaken: 0, overallAccuracy: null, averageScore: null };
  }

  let totalScoreSum = 0;
  let totalMarksSum = 0;

  history.forEach(test => {
    totalScoreSum += test.score;
    totalMarksSum += test.totalMarks;
  });

  const overallAccuracy = totalMarksSum > 0 ? Math.round((totalScoreSum / totalMarksSum) * 100) : 0;
  // Assuming average score is the same as overall accuracy percentage here
  const averageScore = overallAccuracy;

  return {
    totalTestsTaken,
    overallAccuracy,
    averageScore,
  };
};


// --- Component ---

const TestHistoryScreen: FC = () => {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);

  useEffect(() => {
    // Calculate analytics when the component mounts or data changes
    const calculated = calculateAnalytics(testHistoryData);
    setAnalytics(calculated);
  }, []); // Empty dependency array means this runs once on mount

  // Helper to format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-IN', { // Use Indian locale format
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Render Header component for FlatList including Analytics
  const ListHeader = () => (
    <>
      <Text style={styles.heading}>📈 Test History & Analytics</Text>
      {analytics && (
        <View style={styles.analyticsContainer}>
           <View style={styles.statCard}>
             <Icon name="format-list-numbered" size={24} color="#8ab4f8" />
             <Text style={styles.statValue}>{analytics.totalTestsTaken}</Text>
             <Text style={styles.statLabel}>Total Tests Taken</Text>
           </View>
           <View style={styles.statCard}>
             <Icon name="target-account" size={24} color="#6bcf63" />
             <Text style={styles.statValue}>{analytics.overallAccuracy !== null ? `${analytics.overallAccuracy}%` : 'N/A'}</Text>
             <Text style={styles.statLabel}>Overall Accuracy</Text>
           </View>
           {/* Add more stat cards as needed */}
        </View>
      )}
       <Text style={styles.historyHeading}>Recent Tests</Text>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={testHistoryData} // Use the test history data
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader} // Render analytics and headings above the list
        renderItem={({ item }) => {
          const accuracy = item.totalMarks > 0 ? Math.round((item.score / item.totalMarks) * 100) : 0;
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                 <Text style={styles.testName}>{item.testName}</Text>
                 <Text style={styles.testSubject}>{item.subject}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.detailText}>
                    <Icon name="calendar-check" size={14} color="#ccc" /> Date: {formatDate(item.dateTaken)}
                </Text>
                <Text style={styles.detailText}>
                    <Icon name="star-circle-outline" size={14} color="#ccc" /> Score: {item.score}/{item.totalMarks} ({accuracy}%)
                </Text>
                {/* Optional: Add Time Taken */}
                {/* {item.timeTakenMinutes && <Text style={styles.detailText}><Icon name="clock-time-eight-outline" size={14} color="#ccc" /> Time: {item.timeTakenMinutes} min</Text>} */}
              </View>
              {/* Optional: Add a button/touchable area to view details */}
              {/* <TouchableOpacity style={styles.detailsButton}><Text style={styles.detailsButtonText}>View Details</Text></TouchableOpacity> */}
            </View>
          );
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default TestHistoryScreen;

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202124', // Consistent dark background
  },
  heading: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingTop: 15, // Add padding top inside SafeAreaView
  },
  analyticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  statCard: {
    backgroundColor: '#2d2e30',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    minWidth: 150, // Ensure cards have some width
    flex: 1, // Allow cards to grow
    marginHorizontal: 5, // Space between cards
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5, // Space between icon and value
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: '#b0b0b0',
    textAlign: 'center',
  },
  historyHeading: {
    fontSize: 18,
    color: '#e0e0e0',
    fontWeight: '600',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  listContent: {
    paddingBottom: 20, // Space at the very bottom of the list
    paddingHorizontal: 15, // Horizontal padding for list items
  },
  card: {
    backgroundColor: '#2d2e30',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12, // Space between test history cards
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  testName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1, // Allow name to take space
    marginRight: 8,
  },
  testSubject: {
      color: '#a0a0a0',
      fontSize: 13,
      fontStyle: 'italic',
      backgroundColor: '#444', // Small badge background
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
  },
  cardBody: {
      // Styles for the body section if needed
  },
  detailText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5, // Space between detail lines
    flexDirection: 'row', // Align icon and text
    alignItems: 'center',
  },
  // Optional styles for a details button
  /*
  detailsButton: {
      marginTop: 10,
      alignSelf: 'flex-end',
  },
  detailsButtonText: {
      color: '#8ab4f8',
      fontSize: 14,
      fontWeight: '500',
  }
  */
});