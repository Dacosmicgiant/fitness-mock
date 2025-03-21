// import React, { useEffect, useState } from 'react';
// import { Stack } from 'expo-router';
// import { View, ActivityIndicator } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
// import { useRouter, useSegments } from 'expo-router';
// import useAuthStore from '../stores/authStore';
// import colors from '../constants/colors';

// // Authentication guard component
// function AuthGuard({ children }) {
//   const segments = useSegments();
//   const router = useRouter();
//   const { isAuthenticated, isLoading, init } = useAuthStore();
//   const [isInitialized, setIsInitialized] = useState(false);

//   useEffect(() => {
//     // Initialize auth state from AsyncStorage
//     const initializeAuth = async () => {
//       await init();
//       setIsInitialized(true);
//     };

//     initializeAuth();
//   }, [init]);

//   useEffect(() => {
//     if (!isInitialized) return;

//     const inAuthGroup = segments[0] === '(auth)';

//     if (isAuthenticated && inAuthGroup) {
//       // Redirect authenticated users away from auth screens
//       router.replace('/');
//     } else if (!isAuthenticated && !inAuthGroup) {
//       // Redirect unauthenticated users to the login page
//       router.replace('/(auth)/login');
//     }
//   }, [isAuthenticated, segments, isInitialized]);

//   // Show loading indicator while checking authentication
//   if (isLoading || !isInitialized) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color={colors.primary} />
//       </View>
//     );
//   }

//   return children;
// }

// export default function RootLayout() {
//   return (
//     <AuthGuard>
//       <StatusBar style="auto" />
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="index" options={{ headerShown: false }} />
//         <Stack.Screen name="(auth)" options={{ headerShown: false }} />
//         <Stack.Screen name="certifications" options={{ headerShown: false }} />
//         <Stack.Screen name="certification/[id]" options={{ headerShown: false }} />
//         <Stack.Screen name="module/[id]" options={{ headerShown: false }} />
//         <Stack.Screen name="test-config" options={{ headerShown: false }} />
//         <Stack.Screen name="test" options={{ headerShown: false }} />
//         <Stack.Screen name="results" options={{ headerShown: false }} />
//         <Stack.Screen name="review" options={{ headerShown: false }} />
//         <Stack.Screen name="profile" options={{ headerShown: false }} />
//         <Stack.Screen name="subscription" options={{ headerShown: false }} />
//         <Stack.Screen name="settings" options={{ headerShown: false }} />
//       </Stack>
//     </AuthGuard>
//   );
// }

// app/_layout.jsx (Updated with Bottom Tab Navigator)
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.lightGray,
          borderTopWidth: 1,
        },
        headerShown: false, // Hide headers for tab screens
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="certifications"
        options={{
          title: 'Certifications',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}