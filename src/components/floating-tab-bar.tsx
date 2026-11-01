import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Text } from '@/components/ui-text';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { Shadows } from '@/constants/theme';

export type TabType = 'home' | 'jobs' | 'action' | 'chats' | 'profile';

interface FloatingTabBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onCenterActionPress?: () => void;
  unreadChats?: number;
}

type IconName = keyof typeof Ionicons.glyphMap;

function Tab({
  active,
  label,
  icon,
  onPress,
  badge,
  size,
}: {
  active: boolean;
  label: string;
  icon: IconName;
  onPress: () => void;
  badge?: boolean;
  size: number;
}) {
  const { colors } = useTheme();
  const [labelW, setLabelW] = useState(0);
  // 0 = icon only, 1 = icon + name. Starts collapsed so the active tab springs open on arrival.
  const open = useSharedValue(0);
  const hop = useSharedValue(0);
  const press = useSharedValue(1);

  useEffect(() => {
    open.set(withSpring(active ? 1 : 0, { duration: 650, dampingRatio: active ? 0.5 : 0.9 }));
    if (active) hop.set(withSequence(withTiming(-4, { duration: 140 }), withSpring(0, { duration: 420, dampingRatio: 0.45 })));
  }, [active, hop, open]);

  const pill = useAnimatedStyle(() => ({
    width: size + Math.max(0, open.get()) * (labelW + 6),
    transform: [{ scale: press.get() }],
  }));
  const bg = useAnimatedStyle(() => ({ opacity: Math.min(1, Math.max(0, open.get())) }));
  const iconStyle = useAnimatedStyle(() => ({ transform: [{ translateY: hop.get() }] }));
  const text = useAnimatedStyle(() => ({
    opacity: Math.min(1, Math.max(0, open.get() * 1.4 - 0.4)),
    transform: [{ translateX: (1 - Math.min(1, open.get())) * -8 }],
  }));

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      hitSlop={4}
      onPressIn={() => press.set(withTiming(0.92, { duration: 100 }))}
      onPressOut={() => press.set(withSpring(1, { duration: 300, dampingRatio: 0.5 }))}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}>
      <Animated.View style={[styles.item, { height: size, borderRadius: size / 2 }, pill]}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#FFFFFF', borderRadius: size / 2 }, bg]} />
        <View style={[styles.iconBox, { width: size, height: size }]}>
          <Animated.View style={iconStyle}>
            <Ionicons name={icon} size={21} color={active ? colors.action : '#FFFFFF'} style={!active && { opacity: 0.85 }} />
          </Animated.View>
          {badge && <View style={[styles.badge, { backgroundColor: colors.accentCoral, borderColor: active ? '#FFFFFF' : colors.action }]} />}
        </View>
        {active && (
          <Animated.View style={[styles.labelBox, text]}>
            <Text numberOfLines={1} maxFontSizeMultiplier={1.2} style={[styles.label, { color: colors.action }]}>
              {label}
            </Text>
          </Animated.View>
        )}
      </Animated.View>
      {/* Invisible copy measures the label so the pill knows how wide to grow. */}
      <Text
        style={[styles.label, styles.measure]}
        maxFontSizeMultiplier={1.2}
        onLayout={(e) => setLabelW(Math.ceil(e.nativeEvent.layout.width))}
        accessibilityElementsHidden
        importantForAccessibility="no">
        {label}
      </Text>
    </Pressable>
  );
}

/** Floating ink pill navigation; the active tab springs open into a white pill with its name. */
export function FloatingTabBar({ activeTab, onSelectTab, onCenterActionPress, unreadChats = 2 }: FloatingTabBarProps) {
  const { colors } = useTheme();
  const { isClient } = useRole();
  const insets = useSafeAreaInsets();
  const size = useWindowDimensions().width < 370 ? 42 : 46;

  return (
    <View style={[styles.container, { bottom: Math.max(insets.bottom, 12) + 4 }]} pointerEvents="box-none">
      <View style={[styles.pill, { backgroundColor: colors.action }, Shadows.lifted]} accessibilityRole="tablist">
        <Tab size={size} active={activeTab === 'home'} label="Home" icon={activeTab === 'home' ? 'home' : 'home-outline'} onPress={() => onSelectTab('home')} />
        <Tab
          size={size}
          active={activeTab === 'jobs'}
          label={isClient ? 'Projects' : 'My work'}
          icon={activeTab === 'jobs' ? 'briefcase' : 'briefcase-outline'}
          onPress={() => onSelectTab('jobs')}
        />
        <Tab
          size={size}
          active={activeTab === 'action'}
          label="Search"
          icon="search"
          onPress={onCenterActionPress ?? (() => onSelectTab('action'))}
        />
        <Tab
          size={size}
          active={activeTab === 'chats'}
          label="Chats"
          icon="chatbubble-ellipses-outline"
          onPress={() => onSelectTab('chats')}
          badge={unreadChats > 0}
        />
        <Tab size={size} active={activeTab === 'profile'} label="Profile" icon="person-outline" onPress={() => onSelectTab('profile')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 100 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 6, borderRadius: 999 },
  item: { flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  iconBox: { alignItems: 'center', justifyContent: 'center' },
  labelBox: { paddingRight: 14, marginLeft: -6 },
  label: { fontSize: 13, fontWeight: '600' },
  measure: { position: 'absolute', opacity: 0, left: -9999 },
  badge: { position: 'absolute', top: 10, right: 10, width: 9, height: 9, borderRadius: 4.5, borderWidth: 1.5 },
});
