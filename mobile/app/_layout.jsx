import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useSegments } from 'expo-router';
import useAuthStore from '../stores/authStore';
import colors from '../constants/colors';

// Authentication guard component
function AuthGuard({ children }) {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading, init } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth state from AsyncStorage
    const initializeAuth = async () => {
      await init();
      setIsInitialized(true);
    };

    initializeAuth();
  }, [init]);

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && inAuthGroup) {
      // Redirect authenticated users away from auth screens
      router.replace('/');
    } else if (!isAuthenticated && !inAuthGroup) {
      // Redirect unauthenticated users to the login page
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, segments, isInitialized]);

  // Show loading indicator while checking authentication
  if (isLoading || !isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return children;
}

export default function RootLayout() {
  return (
    <AuthGuard>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </AuthGuard>
  );
}