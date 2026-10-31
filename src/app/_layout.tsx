import React, { useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { RoleProvider } from '@/contexts/RoleContext';
import { VerificationProvider } from '@/contexts/VerificationContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

const MAX_COLUMN = 640;

export const unstable_settings = {
  anchor: 'splash',
};

function AppStack() {
  const { isDark } = useTheme();
  const { width } = useWindowDimensions();
  // Tablets and wide windows: keep the phone layout in a centred column.
  const column = width > 700 ? { width: '100%' as const, maxWidth: MAX_COLUMN, alignSelf: 'center' as const } : null;
  const canvas = isDark ? '#0C1317' : '#F3F6F9';

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0A1013' : '#E7EEF3' }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: [{ backgroundColor: canvas }, column],
        }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="choose-role" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="verify-otp" />
        <Stack.Screen name="profile-setup" />
        <Stack.Screen name="kyc" />
        <Stack.Screen name="index" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="job/[id]" />
        <Stack.Screen name="job/apply" />
        <Stack.Screen name="job/create" />
        <Stack.Screen name="job/applicants" />
        <Stack.Screen name="earnings" />
        <Stack.Screen name="payment" />
        <Stack.Screen name="withdraw" />
        <Stack.Screen name="contracts" />
        <Stack.Screen name="contracts/review" />
        <Stack.Screen name="messages" />
        <Stack.Screen name="chat/[id]" />
        <Stack.Screen name="chat/new" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="appearance" />
        <Stack.Screen name="logout" />
        <Stack.Screen name="delete-account" />
        <Stack.Screen name="verification" />
        <Stack.Screen name="talent/[id]" />
        <Stack.Screen name="legal" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <RoleProvider>
          <VerificationProvider>
            <AppStack />
          </VerificationProvider>
        </RoleProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
