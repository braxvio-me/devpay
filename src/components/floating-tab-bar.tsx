import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { Gradients, Layout } from '@/constants/theme';

export type TabType = 'home' | 'jobs' | 'action' | 'chats' | 'profile';

interface FloatingTabBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onCenterActionPress?: () => void;
  unreadChats?: number;
}

function Tab({
  active,
  label,
  icon,
  onPress,
  badge,
}: {
  active: boolean;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  badge?: boolean;
}) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  const color = active ? colors.navActive : colors.textMuted;

  return (
    <Pressable
      style={styles.tab}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPressIn={() => scale.set(withTiming(0.88, { duration: 100 }))}
      onPressOut={() => scale.set(withSpring(1, { duration: 280, dampingRatio: 0.7 }))}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}>
      <Animated.View style={[styles.tabInner, animated]}>
        <View>
          <Ionicons name={icon} size={23} color={color} />
          {badge && <View style={[styles.badge, { backgroundColor: colors.accentCoral, borderColor: colors.surface }]} />}
        </View>
        <Text style={[styles.label, { color, fontWeight: active ? '600' : '400' }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

function CenterAction({ onPress, isClient }: { onPress: () => void; isClient: boolean }) {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isClient ? 'Post a job' : 'Find work'}
      onPressIn={() => scale.set(withTiming(0.9, { duration: 100 }))}
      onPressOut={() => scale.set(withSpring(1, { duration: 320, dampingRatio: 0.6 }))}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        onPress();
      }}
      style={styles.centerWrap}>
      <View
        style={[
          styles.halo,
          { backgroundColor: isDark ? 'rgba(77,180,228,0.14)' : 'rgba(150, 210, 240, 0.35)', borderColor: isDark ? 'rgba(124,205,242,0.2)' : 'rgba(255,255,255,0.9)' },
        ]}
      />
      <Animated.View style={animated}>
        <View style={styles.squircleShadow}>
          <LinearGradient colors={Gradients.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.squircle}>
            <View style={styles.unrotate}>
              {isClient ? (
                <Ionicons name="add" size={28} color={colors.onPrimary} />
              ) : (
                <MaterialCommunityIcons name="line-scan" size={24} color={colors.onPrimary} />
              )}
            </View>
          </LinearGradient>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export function FloatingTabBar({ activeTab, onSelectTab, onCenterActionPress, unreadChats = 2 }: FloatingTabBarProps) {
  const { isDark, colors } = useTheme();
  const { isClient } = useRole();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 12);

  return (
    <View style={[styles.container, { paddingBottom: bottomPad }]} pointerEvents="box-none">
      <LinearGradient
        colors={isDark ? ['#131C22', '#0F171C'] : ['#ECF6FC', '#FAFCFE']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[StyleSheet.absoluteFill, styles.surface, { borderColor: isDark ? colors.border : 'rgba(255,255,255,0.95)' }]}
      />
      <View style={styles.row}>
        <Tab active={activeTab === 'home'} label="Home" icon="home" onPress={() => onSelectTab('home')} />
        <Tab
          active={activeTab === 'jobs'}
          label={isClient ? 'Talent' : 'Jobs'}
          icon={isClient ? 'people' : 'briefcase'}
          onPress={() => onSelectTab('jobs')}
        />
        <CenterAction isClient={isClient} onPress={onCenterActionPress ?? (() => onSelectTab('action'))} />
        <Tab
          active={activeTab === 'chats'}
          label="Chats"
          icon="chatbox-ellipses"
          onPress={() => onSelectTab('chats')}
          badge={unreadChats > 0}
        />
        <Tab active={activeTab === 'profile'} label="Profile" icon="person" onPress={() => onSelectTab('profile')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 10,
    zIndex: 100,
  },
  surface: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    shadowColor: '#7FA6BD',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
  },
  row: {
    height: Layout.navHeight - 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 48 },
  tabInner: { alignItems: 'center', gap: 4 },
  label: { fontSize: 11 },
  badge: { position: 'absolute', top: -1, right: -3, width: 9, height: 9, borderRadius: 4.5, borderWidth: 1.5 },
  centerWrap: { width: 84, height: 84, marginTop: -26, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', width: 84, height: 84, borderRadius: 42, borderWidth: 1 },
  squircleShadow: {
    width: 54,
    height: 54,
    borderRadius: 18,
    transform: [{ rotate: '45deg' }],
    shadowColor: '#3FA7DA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 8,
  },
  squircle: { flex: 1, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  unrotate: { transform: [{ rotate: '-45deg' }] },
});
