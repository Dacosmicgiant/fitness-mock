import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import colors from '../constants/colors';
import useAuthStore from '../stores/authStore';

export default function RootLayout() {
  const { isAuthenticated, init } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    console.log('Initializing auth state...');
    init();
  }, [init]);

  useEffect(() => {
    if (isAuthenticated === false) {
      console.log('User not authenticated, forcing redirect to (auth)/login');
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, router]);

  console.log('isAuthenticated:', isAuthenticated);
  const initialRoute = isAuthenticated ? '(tabs)' : '(auth)';
  console.log('Rendering stack with initial route:', initialRoute);

  // If auth state is still loading, render a loading view
  if (isAuthenticated === null) {
    console.log('Auth state not yet loaded, rendering loading state');
    return (
      <SafeAreaProvider style={{ backgroundColor: colors.white }}>
        <Text>Loading...</Text>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={{ backgroundColor: colors.white }}>
      <Stack
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        {/* Auth Group */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        
        {/* Main App Group */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Modal Screens */}
        <Stack.Screen 
          name="subscription" 
          options={{ 
            presentation: 'modal',
            headerShown: true,
            title: 'Subscription'
          }} 
        />
        <Stack.Screen 
          name="test-config" 
          options={{ 
            presentation: 'modal',
            headerShown: true,
            title: 'Test Configuration'
          }} 
        />
        <Stack.Screen 
          name="test" 
          options={{ 
            presentation: 'modal',
            headerShown: true,
            title: 'Test'
          }} 
        />
        <Stack.Screen 
          name="results" 
          options={{ 
            presentation: 'modal',
            headerShown: true,
            title: 'Results'
          }} 
        />
        <Stack.Screen 
          name="review" 
          options={{ 
            presentation: 'modal',
            headerShown: true,
            title: 'Review'
          }} 
        />
        <Stack.Screen 
          name="module/[id]" 
          options={{ 
            presentation: 'modal',
            headerShown: true,
            title: 'Module'
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}
