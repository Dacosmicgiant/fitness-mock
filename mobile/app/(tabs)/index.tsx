import React, { FC } from 'react'; // Import FC for Functional Component type
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ListRenderItem, // Type for renderItem function
  ImageSourcePropType, // Type for image sources
} from 'react-native';
// Removed navigation imports for this example, focus is on UI layout
// Add them back when you integrate navigation and define your ParamList types

// --- Type Definitions ---

interface Update {
  id: string;
  title: string;
  date: string;
}

interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: ImageSourcePropType; // Use ImageSourcePropType for require or {uri: ...}
}

// --- Mock Data (Replace with your actual data fetching) ---

// Specify the type for the array
const importantUpdates: Update[] = [
  { id: '1', title: 'UPSC NDA II Final Result 2024 : Released', date: '12 Apr 2025' },
  { id: '2', title: 'New Physics Mock Test Added', date: '11 Apr 2025' },
  { id: '3', title: 'Chemistry Study Notes Updated', date: '10 Apr 2025' },
];

// Specify the type for the array
const categories: Category[] = [
  { id: '1', title: 'Current Affairs Article', subtitle: 'New Article updated today', icon: require('../../assets/images/icon.png') }, // Replace with your actual icon path
  { id: '2', title: 'Current Affairs Quiz', subtitle: 'New Quiz updated today', icon: require('../../assets/images/icon.png') }, // Replace with your actual icon path
  { id: '3', title: 'Previous Year Papers', subtitle: 'Find papers by exam', icon: require('../../assets/images/icon.png') }, // Replace with your actual icon path
];

// --- Component ---

// Define the component using React.FC (Functional Component)
const HomeScreen: FC = () => {
  // Removed navigation hook for this example

  // Render function for Horizontal Updates List - Specify item type
  const renderUpdateItem: ListRenderItem<Update> = ({ item }) => (
    <View style={styles.updateCard}>
      <Text style={styles.updateTitle}>{item.title}</Text>
      <Text style={styles.updateDate}>{item.date}</Text>
      {/* Add icon buttons here if needed */}
      <View style={styles.updateIcons}>
         {/* Placeholder for icons - Use TouchableOpacity with Icon components */}
         <Text style={styles.iconPlaceholder}>♡</Text>
         <Text style={styles.iconPlaceholder}>🔗</Text>
         <Text style={styles.iconPlaceholder}>💬</Text>
      </View>
    </View>
  );

  // Render function for Vertical Categories List - Specify item type
  const renderCategoryItem: ListRenderItem<Category> = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <Image source={item.icon} style={styles.categoryIcon} />
      <View style={styles.categoryTextContainer}>
        <Text style={styles.categoryTitle}>{item.title}</Text>
        <Text style={styles.categorySubtitle}>{item.subtitle}</Text>
      </View>
      {/* Optional: Add a > arrow icon here */}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header (Optional - often handled by navigation library) */}
      {/* <View style={styles.header}>
         <TouchableOpacity><Text style={styles.headerIcon}>☰</Text></TouchableOpacity>
         <Image source={require('./assets/mockers-logo.png')} style={styles.logo} resizeMode="contain" />
         <View style={styles.headerRightIcons}></View>
      </View> */}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* --- Banner Section --- */}
        <View style={styles.banner}>
          <View style={styles.bannerTextContainer}>
             <Text style={styles.bannerTitle}>Test your Exam preperation with</Text>
             <Text style={styles.bannerSubtitle}>Mockers</Text>
             <Text style={styles.bannerTag}>Free Test Series</Text>
          </View>
          <Image
            source={require('../../assets/images/icon.png')} // Replace with your actual illustration path
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>

        {/* --- Important Updates Section --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Important Updates</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={importantUpdates}
            renderItem={renderUpdateItem}
            keyExtractor={(item) => item.id}
            horizontal={true} // Make the list horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListPadding}
          />
        </View>

        {/* --- Categories Section --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            {/* No "View All" shown in screenshot for Categories */}
          </View>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false} // Disable scrolling if list is short and inside ScrollView
            // If the list can be long, keep scrollEnabled={true} or remove the prop
          />
        </View>

        {/* Add more sections as needed */}

      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen; // Export the component

// --- Styles ---
// Styles remain the same as the JavaScript version
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202124', // Dark background like the screenshot
  },
  // Optional Header Styles
  /*
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#1a1a1a', // Slightly different shade for header
  },
  headerIcon: {
    color: '#fff',
    fontSize: 24,
  },
  logo: {
    height: 30,
    width: 120,
  },
  headerRightIcons: {
    width: 24, // Placeholder for right icons area
  },
  */
  banner: {
    backgroundColor: '#0057b8', // Blue color from screenshot
    borderRadius: 12,
    marginHorizontal: 15,
    marginTop: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 100, // Adjust as needed
  },
  bannerTextContainer:{
    flex: 1, // Take available space
    paddingRight: 10,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
   bannerSubtitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  bannerTag: {
    color: '#fff',
    fontSize: 10,
    backgroundColor: 'rgba(0,0,0,0.2)', // Semi-transparent black
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 5,
    alignSelf: 'flex-start', // Make background fit the text
  },
  bannerImage: {
    width: 80, // Adjust size
    height: 80, // Adjust size
  },
  section: {
    marginTop: 25,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#e0e0e0', // Lighter grey/white for titles
    fontSize: 18,
    fontWeight: '600',
  },
  viewAll: {
    color: '#8ab4f8', // Light blue for links
    fontSize: 14,
    fontWeight: '500',
  },
  horizontalListPadding: {
     paddingLeft: 15, // Start first card with padding
     paddingRight: 5, // Space after last card
  },
  updateCard: {
    backgroundColor: '#2d2e30', // Dark card background
    borderRadius: 8,
    padding: 12,
    marginRight: 10, // Space between horizontal cards
    width: 250, // Fixed width for horizontal cards
  },
  updateTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  updateDate: {
    color: '#9e9e9e', // Grey color for date
    fontSize: 12,
    marginBottom: 8,
  },
  updateIcons: {
      flexDirection: 'row',
      justifyContent: 'flex-end', // Align icons to the right
      marginTop: 5,
  },
  iconPlaceholder: { // Replace with actual Icon styles
      color: '#b0b0b0',
      fontSize: 18,
      marginLeft: 15, // Space between icons
  },
  categoryCard: {
    backgroundColor: '#2d2e30',
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40, // Adjust icon size
    height: 40, // Adjust icon size
    marginRight: 15,
    // You might need tintColor if using template images
  },
  categoryTextContainer: {
    flex: 1, // Take remaining space
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  categorySubtitle: {
    color: '#a0a0a0', // Lighter grey for subtitle
    fontSize: 13,
    marginTop: 2,
  },
});