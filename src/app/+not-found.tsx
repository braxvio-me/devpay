import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Button, ScreenBackground } from '@/components/ds';
import { Layout } from '@/constants/theme';

export default function NotFoundScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground height={600} />
      <SafeAreaView style={styles.body}>
        <View style={[styles.icon, { backgroundColor: colors.surface }]}>
          <Ionicons name="compass-outline" size={34} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Page not found</Text>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>This link may be old or mistyped. Head home and try again.</Text>
        <View style={styles.actions}>
          <Button label="Go Home" onPress={() => router.replace('/')} />
          <Button label="Go back" variant="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Layout.margin },
  icon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '600', letterSpacing: -0.5, marginTop: 20 },
  sub: { fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8, maxWidth: 300 },
  actions: { alignSelf: 'stretch', gap: 6, marginTop: 28 },
});
