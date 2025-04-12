// import { View, StyleSheet } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { useState, useRef } from 'react';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import * as MediaLibrary from 'expo-media-library';
// import { captureRef } from 'react-native-view-shot';
// import { type ImageSource } from 'expo-image';

// import Button from '@/components/Button';
// import ImageViewer from '@/components/ImageViewer';
// import IconButton from '@/components/IconButton';
// import CircleButton from '@/components/CircleButton';
// import EmojiPicker from '@/components/EmojiPicker';
// import EmojiList from '@/components/EmojiList';
// import EmojiSticker from '@/components/EmojiSticker';

// const PlaceholderImage = require('../../assets/images/react-logo.png');

// export default function ProfileScreen() {
//   const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
//   const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
//   const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
//   const [pickedEmoji, setPickedEmoji] = useState<ImageSource | undefined>(undefined);
//   const [status, requestPermission] = MediaLibrary.usePermissions();
//   const imageRef = useRef<View>(null);

//   if (status === null) {
//     requestPermission();
//   }

//   const pickImageAsync = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ['images'],
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setSelectedImage(result.assets[0].uri);
//       setShowAppOptions(true);
//     } else {
//       alert('You did not select any image.');
//     }
//   };

//   const onReset = () => {
//     setShowAppOptions(false);
//   };

//   const onAddSticker = () => {
//     setIsModalVisible(true);
//   };

//   const onModalClose = () => {
//     setIsModalVisible(false);
//   };

//   const onSaveImageAsync = async () => {
//     try {
//       const localUri = await captureRef(imageRef, {
//         height: 440,
//         quality: 1,
//       });

//       await MediaLibrary.saveToLibraryAsync(localUri);
//       if (localUri) {
//         alert('Saved!');
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <View style={styles.imageContainer}>
//         <View ref={imageRef} collapsable={false}>
//           <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
//           {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
//         </View>
//       </View>
//       {showAppOptions ? (
//         <View style={styles.optionsContainer}>
//           <View style={styles.optionsRow}>
//             <IconButton icon="refresh" label="Reset" onPress={onReset} />
//             <CircleButton onPress={onAddSticker} />
//             <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
//           </View>
//         </View>
//       ) : (
//         <View style={styles.footerContainer}>
//           <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
//           <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
//         </View>
//       )}
//       <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
//         <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
//       </EmojiPicker>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#25292e',
//     alignItems: 'center',
//   },
//   imageContainer: {
//     flex: 1,
//   },
//   footerContainer: {
//     flex: 1 / 3,
//     alignItems: 'center',
//   },
//   optionsContainer: {
//     position: 'absolute',
//     bottom: 80,
//   },
//   optionsRow: {
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
// });
import React, { FC } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
// Import the specific icon set from @expo/vector-icons
// We alias it to 'Icon' to minimize changes in the component body
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

// --- Type Definitions ---

interface ProfileAction {
  id: string;
  title: string;
  iconName: React.ComponentProps<typeof Icon>['name']; // Use type from Icon component props for better safety
  onPress: () => void;
}

// --- Placeholder Data ---

// Replace with actual user data fetching logic
const userData = {
  name: 'Vedant Vankar',
  email: 'vedantvanpro@gmail.com',
  profileImageUrl: null, // or a URL string 'https://example.com/profile.jpg'
};

const PlaceholderUserImage: ImageSourcePropType = require('../../assets/images/icon.png'); // Make sure you have a placeholder image asset

// Define the list of actions for the "Explore" section
// Icon names should be valid for MaterialCommunityIcons
const profileActions: ProfileAction[] = [
  { id: '1', title: 'Change Test Series Exam', iconName: 'book-edit-outline', onPress: () => console.log('Change Test Series') },
  { id: '2', title: 'Change PYP Exam', iconName: 'file-document-edit-outline', onPress: () => console.log('Change PYP') },
  { id: '3', title: 'Saved Question', iconName: 'bookmark-outline', onPress: () => console.log('Saved Question') },
  { id: '4', title: 'Change Language', iconName: 'translate', onPress: () => console.log('Change Language') },
  { id: '5', title: 'Leaderboard', iconName: 'trophy-outline', onPress: () => console.log('Leaderboard') },
  { id: '6', title: 'Share App', iconName: 'share-variant-outline', onPress: () => console.log('Share App') },
  { id: '7', title: 'More App', iconName: 'apps', onPress: () => console.log('More App') },
  { id: '8', title: 'Join Facebook Page', iconName: 'facebook', onPress: () => console.log('Join Facebook') },
  { id: '9', title: 'Update App', iconName: 'update', onPress: () => console.log('Update App') },
  // Add more actions as needed
];


// --- Component ---

const ProfileScreen: FC = () => {

  const handleViewProfile = () => {
    // Navigate to a detailed profile view or edit screen
    console.log('View Profile Pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* --- Profile Info Section --- */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={() => console.log('Change profile picture?')}>
            <Image
              source={userData.profileImageUrl ? { uri: userData.profileImageUrl } : PlaceholderUserImage}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <Text style={styles.profileName}>{userData.name}</Text>
          <Text style={styles.profileEmail}>{userData.email}</Text>
          <TouchableOpacity style={styles.viewProfileButton} onPress={handleViewProfile}>
            <Text style={styles.viewProfileButtonText}>View Profile</Text>
          </TouchableOpacity>
        </View>

        {/* --- Explore Section --- */}
        <View style={styles.exploreSection}>
          <Text style={styles.exploreTitle}>Explore</Text>
          <View style={styles.exploreListContainer}>
            {profileActions.map((action, index) => ( // Added index for last item check
              <TouchableOpacity
                key={action.id}
                // Apply specific style to remove border for the last item
                style={[
                    styles.listItem,
                    index === profileActions.length - 1 && styles.lastListItem
                ]}
                onPress={action.onPress}
                >
                <Text style={styles.listItemText}>{action.title}</Text>
                {/* Usage of Icon component remains the same due to the alias */}
                <Icon name={action.iconName} size={22} color="#a0a0a0" style={styles.listItemIcon} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202124', // Consistent dark background
  },
  scrollContainer: {
    paddingBottom: 30, // Add padding at the bottom
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#1a1a1a', // Slightly different dark shade for header bg
    // Removed marginBottom: 20 to let the section below define its top margin
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Make it circular
    backgroundColor: '#444', // Placeholder background if image fails
    marginBottom: 15,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: '#b0b0b0',
    marginBottom: 20,
  },
  viewProfileButton: {
    backgroundColor: '#0057b8', // Blue button like screenshot
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20, // Rounded corners
  },
  viewProfileButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  exploreSection: {
    paddingHorizontal: 15,
    marginTop: 25, // Added margin to separate from profile header
  },
  exploreTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c0c0c0',
    marginBottom: 15,
    // marginLeft: 5, // Optional slight indent
  },
  exploreListContainer: {
    backgroundColor: '#2d2e30', // Card background for the list items area
    borderRadius: 8,
    overflow: 'hidden', // Ensures border radius clips the children/borders properly
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 15,
    // Add a separator line, except for the last item
    borderBottomWidth: 1,
    borderBottomColor: '#3a3b3d', // Subtle separator color
  },
  // Style to remove border for the last item
  lastListItem: {
      borderBottomWidth: 0,
  },
  listItemText: {
    fontSize: 15,
    color: '#e0e0e0',
    flex: 1, // Allow text to take up space
    marginRight: 10, // Space between text and icon
  },
  listItemIcon: {
    // Style for the icon itself (color/size set directly on component)
  },
});