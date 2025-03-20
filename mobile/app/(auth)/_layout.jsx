import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
      }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack>
    </>
  );
}