import React, { useEffect, useState } from 'react';
import { View, Pressable, Platform, StyleSheet, useColorScheme, useWindowDimensions } from 'react-native';
import { Text } from '@/components/ui-text';
import { Stack, useRouter, type ErrorBoundaryProps } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { VerificationProvider } from '@/contexts/VerificationContext';
import { AppLockProvider } from '@/contexts/AppLockContext';
import { ReceiptsProvider } from '@/contexts/ReceiptsContext';
import { WalletLockProvider } from '@/contexts/WalletLockContext';
import { markIntroDone } from '@/lib/intro';
import { BiometricOffer, LockScreen } from '@/components/lock-screen';
import { PolicyGate } from '@/components/policy-gate';
import { OfflineBanner } from '@/components/offline-banner';
import { DialogHost } from '@/components/dialog-host';
import { AnimatedSplash } from '@/components/animated-splash';
import { setupNotifications } from '@/lib/notify';
import '@/components/web-styles';

SplashScreen.preventAutoHideAsync().catch(() => {});

const MAX_COLUMN = 640;

export const unstable_settings = {
  anchor: 'index',
};

function AppStack() {
  const { isDark } = useTheme();
  const { ready: authReady, user } = useAuth();
  const [fontsLoaded, fontError] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });
  // Fonts failing to load must not block the app; it falls back to the system font.
  const ready = authReady && (fontsLoaded || !!fontError);
  const { width } = useWindowDimensions();
  // Tablets and wide windows: keep the phone layout in a centred column.
  const column = width > 700 ? { width: '100%' as const, maxWidth: MAX_COLUMN, alignSelf: 'center' as const } : null;
  const canvas = isDark ? '#0C1317' : '#F3F6F9';
  const signedIn = !!user;

  const router = useRouter();
  const [intro, setIntro] = useState(true);

  useEffect(() => {
    setupNotifications().catch(() => {});
    if (Platform.OS === 'web') return;
    // Tapping a notification opens the screen it is about.
    const sub = Notifications.addNotificationResponseReceivedListener((r) => {
      const route = r.notification.request.content.data?.route;
      if (typeof route === 'string') router.push(route as never);
    });
    return () => sub.remove();
  }, [router]);

  // Keep the native splash up until the stored session is known.
  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0A1013' : '#E7EEF3' }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'ios_from_right',
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          contentStyle: [{ backgroundColor: canvas }, column],
        }}>
        {/* Signed out: onboarding and authentication only. */}
        <Stack.Protected guard={!signedIn} redirectTo="/">
          <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
          <Stack.Screen name="choose-role" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="verify-otp" />
        </Stack.Protected>

        {/* Signed in: the app. */}
        <Stack.Protected guard={signedIn} redirectTo="/welcome">
          <Stack.Screen name="index" options={{ animation: 'fade' }} />
          <Stack.Screen name="profile-setup" />
          <Stack.Screen name="kyc" />
          <Stack.Screen name="explore" />
          <Stack.Screen name="job/[id]" />
          <Stack.Screen name="job/apply" />
          <Stack.Screen name="job/create" />
          <Stack.Screen name="job/applicants" />
          <Stack.Screen name="earnings" />
          <Stack.Screen name="payment" />
          <Stack.Screen name="receipts/index" />
          <Stack.Screen name="receipts/[id]" />
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
          <Stack.Screen name="premium" />
          <Stack.Screen name="assistant" options={{ animation: 'fade' }} />
          <Stack.Screen name="project/[id]" />
          <Stack.Screen name="help" />
          <Stack.Screen name="about" />
        </Stack.Protected>

        <Stack.Screen name="legal" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <OfflineBanner />
      <PolicyGate />
      <LockScreen />
      <BiometricOffer />
      <DialogHost />
      {intro && (
        <AnimatedSplash
          onDone={() => {
            setIntro(false);
            markIntroDone();
          }}
        />
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <AppLockProvider>
            <VerificationProvider>
              <ReceiptsProvider>
                <WalletLockProvider>
                  <AppStack />
                </WalletLockProvider>
              </ReceiptsProvider>
            </VerificationProvider>
          </AppLockProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

/** Shown instead of a blank screen when something crashes while rendering. */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const dark = useColorScheme() === 'dark';
  const fg = dark ? '#EEF3F6' : '#17191C';
  const sub = dark ? '#A1ADB5' : '#6B7378';
  return (
    <View style={[eb.root, { backgroundColor: dark ? '#0C1317' : '#F3F6F9' }]}>
      <Text style={[eb.title, { color: fg }]} accessibilityRole="header">
        Something went wrong
      </Text>
      <Text style={[eb.body, { color: sub }]}>
        This screen hit an unexpected error. Your escrow and payments are not affected.
      </Text>
      {__DEV__ && <Text style={[eb.detail, { color: sub }]}>{error.message}</Text>}
      <Pressable onPress={retry} accessibilityRole="button" style={[eb.btn, { backgroundColor: dark ? '#2479A6' : '#1C6E99' }]}>
        <Text style={eb.btnText}>Try again</Text>
      </Pressable>
    </View>
  );
}

const eb = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  title: { fontSize: 22, fontWeight: '600', letterSpacing: -0.4 },
  body: { fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8, maxWidth: 300 },
  detail: { fontSize: 12, marginTop: 12, textAlign: 'center' },
  btn: { height: 50, paddingHorizontal: 28, borderRadius: 25, justifyContent: 'center', marginTop: 24 },
  btnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
