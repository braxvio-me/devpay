import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

export type TabType = 'home' | 'jobs' | 'action' | 'chats' | 'profile';

interface FloatingTabBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onCenterActionPress?: () => void;
  unreadChats?: number;
}

// ─── Animated Tab Item ─────────────────────────────────────────────────────
function AnimatedTab({
  isActive,
  label,
  iconActive,
  iconInactive,
  onPress,
  badge,
}: {
  isActive: boolean;
  label: string;
  iconActive: keyof typeof Ionicons.glyphMap;
  iconInactive: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  badge?: boolean;
}) {
  const scale = useSharedValue(1);
  const dotWidth = useSharedValue(isActive ? 14 : 0);
  const { colors } = useTheme();

  React.useEffect(() => {
    dotWidth.set(withSpring(isActive ? 14 : 0, { duration: 300, dampingRatio: 0.7 }));
  }, [isActive]);

  const animScale = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  const dotStyle = useAnimatedStyle(() => ({
    width: dotWidth.get(),
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 4,
    opacity: interpolate(dotWidth.get(), [0, 14], [0, 1]),
  }));

  const iconColor = isActive ? colors.primary : colors.textMuted;

  return (
    <Pressable
      style={styles.tabItem}
      onPressIn={() => {
        scale.set(withSpring(0.84, { duration: 80, dampingRatio: 1 }));
      }}
      onPressOut={() => {
        scale.set(withSpring(1, { duration: 320, dampingRatio: 0.55 }));
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      <Animated.View style={[styles.tabInner, animScale]}>
        <View style={styles.iconWrap}>
          <Ionicons name={isActive ? iconActive : iconInactive} size={22} color={iconColor} />
          {badge && <View style={styles.chatBadge} />}
        </View>
        <Text
          style={[
            styles.tabLabel,
            { color: iconColor },
            isActive && styles.activeTabLabel,
          ]}>
          {label}
        </Text>
        <Animated.View style={dotStyle} />
      </Animated.View>
    </Pressable>
  );
}

// ─── Animated Center FAB ───────────────────────────────────────────────────
function AnimatedCenterFAB({
  onPress,
  isClient,
}: {
  onPress: () => void;
  isClient: boolean;
}) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.35);

  const fabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.get(),
    transform: [
      { scale: interpolate(glowOpacity.get(), [0.35, 0.7], [1, 1.28]) },
    ],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.set(withSpring(0.88, { duration: 90, dampingRatio: 1 }));
        glowOpacity.set(withTiming(0.7, { duration: 100 }));
      }}
      onPressOut={() => {
        scale.set(withSpring(1, { duration: 380, dampingRatio: 0.5 }));
        glowOpacity.set(withTiming(0.35, { duration: 350 }));
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={styles.centerPressable}>
      <Animated.View
        style={[
          styles.fabGlow,
          { backgroundColor: isClient ? '#10B981' : '#0F73F7' },
          glowStyle,
        ]}
      />
      <Animated.View style={[styles.fabWrapper, fabStyle]}>
        <LinearGradient
          colors={isClient ? ['#34D399', '#10B981'] : ['#38BDF8', '#0F73F7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}>
          <Ionicons
            name={isClient ? 'add' : 'scan-outline'}
            size={isClient ? 28 : 22}
            color="#FFFFFF"
          />
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

// ─── Main Tab Bar ──────────────────────────────────────────────────────────
export function FloatingTabBar({
  activeTab,
  onSelectTab,
  onCenterActionPress,
  unreadChats = 2,
}: FloatingTabBarProps) {
  const { isDark, colors } = useTheme();
  const { isClient } = useRole();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.floatingContainer, { bottom: Math.max(16, insets.bottom + 8) }]}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.96)' : 'rgba(255, 255, 255, 0.97)',
            borderColor: isDark ? 'rgba(51, 65, 85, 0.7)' : 'rgba(224, 231, 245, 0.9)',
          },
        ]}>
        <AnimatedTab
          isActive={activeTab === 'home'}
          label="Home"
          iconActive="home"
          iconInactive="home-outline"
          onPress={() => onSelectTab('home')}
        />
        <AnimatedTab
          isActive={activeTab === 'jobs'}
          label={isClient ? 'Talent' : 'Jobs'}
          iconActive={isClient ? 'people' : 'briefcase'}
          iconInactive={isClient ? 'people-outline' : 'briefcase-outline'}
          onPress={() => onSelectTab('jobs')}
        />
        <AnimatedCenterFAB
          isClient={isClient}
          onPress={onCenterActionPress ?? (() => onSelectTab('action'))}
        />
        <AnimatedTab
          isActive={activeTab === 'chats'}
          label="Chats"
          iconActive="chatbubble"
          iconInactive="chatbubble-outline"
          onPress={() => onSelectTab('chats')}
          badge={unreadChats > 0}
        />
        <AnimatedTab
          isActive={activeTab === 'profile'}
          label="Profile"
          iconActive="person"
          iconInactive="person-outline"
          onPress={() => onSelectTab('profile')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 22,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 100,
  },
  bar: {
    width: '100%',
    height: 68,
    borderRadius: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    borderWidth: 1,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 12,
  },
  tabItem: {
    width: 56,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 2,
  },
  iconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  activeTabLabel: {
    fontWeight: '700',
  },
  chatBadge: {
    position: 'absolute',
    top: -2,
    right: -5,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.light.accentCoral,
  },
  centerPressable: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
  },
  fabGlow: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  fabWrapper: {
    width: 52,
    height: 52,
    borderRadius: 20,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 8,
  },
  fabGradient: {
    width: 52,
    height: 52,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});