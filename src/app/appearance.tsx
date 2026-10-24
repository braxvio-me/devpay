import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

type ThemeMode = 'light' | 'dark' | 'system';

const THEME_OPTIONS: { id: ThemeMode; label: string; description: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  {
    id: 'light',
    label: 'Light Mode',
    description: 'Clean white backgrounds, ideal for daytime',
    icon: 'sunny-outline',
  },
  {
    id: 'dark',
    label: 'Dark Mode',
    description: 'Easy on the eyes, great at night',
    icon: 'moon-outline',
  },
  {
    id: 'system',
    label: 'Follow System',
    description: 'Automatically match your device setting',
    icon: 'phone-portrait-outline',
  },
];

export default function AppearanceScreen() {
  const router = useRouter();
  const { mode, isDark, colors, setMode } = useTheme();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [boldText, setBoldText] = useState(false);

  const bg = colors.background;
  const surface = colors.surface;
  const text = colors.text;
  const textSec = colors.textSecondary;
  const border = colors.border;
  const primary = colors.primary;

  return (
    <View style={[styles.screen, { backgroundColor: bg }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: border }]}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: surface, borderColor: border }]}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: text }]}>Appearance</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Preview Card */}
          <View style={[styles.previewCard, { backgroundColor: surface, borderColor: border }]}>
            <LinearGradient
              colors={isDark ? ['#0B1120', '#0F172A'] : ['#EFF6FF', '#F8FAFC']}
              style={styles.previewGradient}>
              {/* Mock home UI preview */}
              <View style={styles.previewTopRow}>
                <View style={[styles.previewAvatar, { backgroundColor: isDark ? '#334155' : '#BFDBFE' }]} />
                <View style={{ flex: 1, gap: 5 }}>
                  <View style={[styles.previewLine, { width: '60%', backgroundColor: isDark ? '#334155' : '#BFDBFE' }]} />
                  <View style={[styles.previewLine, { width: '40%', backgroundColor: isDark ? '#1E293B' : '#DBEAFE' }]} />
                </View>
                <View style={[styles.previewBell, { backgroundColor: isDark ? '#1E293B' : '#BFDBFE' }]}>
                  <Ionicons name="notifications-outline" size={14} color={primary} />
                </View>
              </View>

              {/* Mock card */}
              <View style={[styles.previewJobCard, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]}>
                <LinearGradient
                  colors={['#38BDF8', '#0F73F7']}
                  style={styles.previewCardGradient}
                />
                <View style={{ flex: 1, gap: 5, paddingLeft: 12 }}>
                  <View style={[styles.previewLine, { width: '70%', backgroundColor: isDark ? '#334155' : '#E2E8F0' }]} />
                  <View style={[styles.previewLine, { width: '50%', backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]} />
                </View>
              </View>
            </LinearGradient>

            <View style={styles.previewLabelRow}>
              <View style={[styles.previewBadge, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}>
                <Ionicons name={isDark ? 'moon' : 'sunny'} size={12} color={primary} />
                <Text style={[styles.previewBadgeText, { color: primary }]}>
                  {isDark ? 'Dark Mode Active' : 'Light Mode Active'}
                </Text>
              </View>
            </View>
          </View>

          {/* Theme Selector */}
          <Text style={[styles.sectionTitle, { color: text }]}>Theme</Text>
          <View style={[styles.optionsBox, { backgroundColor: surface, borderColor: border }]}>
            {THEME_OPTIONS.map((opt, idx) => {
              const isSelected = mode === opt.id;
              return (
                <React.Fragment key={opt.id}>
                  {idx > 0 && <View style={[styles.divider, { backgroundColor: border }]} />}
                  <TouchableOpacity
                    style={styles.optionRow}
                    onPress={() => setMode(opt.id)}
                    activeOpacity={0.8}>
                    <View style={[styles.optionIconCircle, {
                      backgroundColor: isSelected ? colors.primarySoft : colors.backgroundElement,
                    }]}>
                      <Ionicons
                        name={opt.icon}
                        size={18}
                        color={isSelected ? primary : textSec}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionLabel, { color: text }]}>{opt.label}</Text>
                      <Text style={[styles.optionDesc, { color: textSec }]}>{opt.description}</Text>
                    </View>
                    <View style={[
                      styles.radioOuter,
                      { borderColor: isSelected ? primary : border },
                    ]}>
                      {isSelected && (
                        <View style={[styles.radioInner, { backgroundColor: primary }]} />
                      )}
                    </View>
                  </TouchableOpacity>
                </React.Fragment>
              );
            })}
          </View>

          {/* Accessibility */}
          <Text style={[styles.sectionTitle, { color: text }]}>Accessibility</Text>
          <View style={[styles.optionsBox, { backgroundColor: surface, borderColor: border }]}>
            {[
              {
                label: 'Reduce Motion',
                desc: 'Minimize animations throughout the app',
                icon: 'speedometer-outline' as const,
                value: reducedMotion,
                onToggle: setReducedMotion,
              },
              {
                label: 'Compact Mode',
                desc: 'Denser layout, more content visible',
                icon: 'contract-outline' as const,
                value: compactMode,
                onToggle: setCompactMode,
              },
              {
                label: 'Bold Text',
                desc: 'Increase text weight across all labels',
                icon: 'text-outline' as const,
                value: boldText,
                onToggle: setBoldText,
              },
            ].map((item, idx, arr) => (
              <React.Fragment key={item.label}>
                <View style={styles.optionRow}>
                  <View style={[styles.optionIconCircle, { backgroundColor: colors.backgroundElement }]}>
                    <Ionicons name={item.icon} size={18} color={textSec} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optionLabel, { color: text }]}>{item.label}</Text>
                    <Text style={[styles.optionDesc, { color: textSec }]}>{item.desc}</Text>
                  </View>
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: border, true: primary + '55' }}
                    thumbColor={item.value ? primary : '#FFFFFF'}
                  />
                </View>
                {idx < arr.length - 1 && <View style={[styles.divider, { backgroundColor: border }]} />}
              </React.Fragment>
            ))}
          </View>

          {/* Theme info */}
          <View style={[styles.infoCard, { backgroundColor: colors.primarySoft, borderColor: '#BFDBFE' }]}>
            <Ionicons name="information-circle-outline" size={18} color={primary} />
            <Text style={[styles.infoText, { color: primary }]}>
              Theme changes apply instantly across the entire app. Your preference is saved automatically.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
    gap: 12,
  },
  previewCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 8,
  },
  previewGradient: {
    padding: 20,
    gap: 12,
  },
  previewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  previewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  previewLine: {
    height: 10,
    borderRadius: 5,
  },
  previewBell: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewJobCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    overflow: 'hidden',
  },
  previewCardGradient: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  previewLabelRow: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  previewBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: 4,
    marginLeft: 4,
  },
  optionsBox: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  optionIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  optionDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  divider: {
    height: 1,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
});
