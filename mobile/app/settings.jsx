// app/settings.jsx
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import colors from '../constants/colors';
import useAuthStore from '../stores/authStore';
import ToggleSwitch from '../components/ToggleSwitch';

const SettingsScreen = () => {
  const router = useRouter();
  const { user, logoutUser } = useAuthStore();
  
  // State for settings (these would typically be fetched from backend)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
  });
  const [appPrefs, setAppPrefs] = useState({
    darkMode: false,
    soundEffects: true,
  });
  const [password, setPassword] = useState('');

  const handleSaveSettings = async () => {
    try {
      await axios.put(
        'http://your-backend-url/api/users/settings', // Replace with your endpoint
        {
          notifications,
          appPreferences: appPrefs,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  const handleChangePassword = async () => {
    if (!password) {
      alert('Please enter a new password');
      return;
    }
    try {
      await axios.put(
        'http://your-backend-url/api/users/password', // Replace with your endpoint
        { newPassword: password },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Password changed successfully');
      setPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Change Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter new password"
              secureTextEntry
            />
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleChangePassword}
            >
              <Text style={styles.actionButtonText}>Update Password</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          <ToggleSwitch
            label="Email Notifications"
            value={notifications.email}
            onToggle={(val) => setNotifications({ ...notifications, email: val })}
          />
          <ToggleSwitch
            label="Push Notifications"
            value={notifications.push}
            onToggle={(val) => setNotifications({ ...notifications, push: val })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          <ToggleSwitch
            label="Dark Mode"
            value={appPrefs.darkMode}
            onToggle={(val) => setAppPrefs({ ...appPrefs, darkMode: val })}
          />
          <ToggleSwitch
            label="Sound Effects"
            value={appPrefs.soundEffects}
            onToggle={(val) => setAppPrefs({ ...appPrefs, soundEffects: val })}
          />
        </View>

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSaveSettings}
        >
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
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
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: colors.white,
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;