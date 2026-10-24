import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
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
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  return (
    <Pressable
      style={styles.tabItem}
      onPressIn={() => {
        scale.set(withSpring(0.86, { duration: 100, dampingRatio: 1 }));
      }}
      onPressOut={() => {
        scale.set(withSpring(1, { duration: 300, dampingRatio: 0.6 }));
      }}
      onPress={onPress}>
      <Animated.View style={[styles.tabInner, animStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

// ─── Animated Center Action ───────────────────────────────────────────────
function AnimatedCenter({
  onPress,
}: {
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.set(withSpring(0.88, { duration: 100, dampingRatio: 1 }));
      }}
      onPressOut={() => {
        scale.set(withSpring(1, { duration: 340, dampingRatio: 0.55 }));
      }}
      onPress={onPress}>
      <Animated.View style={[styles.centerButtonWrapper, animStyle]}>
        <LinearGradient
          colors={['#38BDF8', '#0F73F7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.centerGradient}>
          <Ionicons name="scan-outline" size={22} color="#FFFFFF" />
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

export function FloatingTabBar({
  activeTab,
  onSelectTab,
  onCenterActionPress,
  unreadChats = 2,
}: FloatingTabBarProps) {
  return (
    <View style={styles.floatingContainer}>
      <View style={styles.bar}>
        {/* Tab 1: Home */}
        <AnimatedTab onPress={() => onSelectTab('home')}>
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={22}
            color={activeTab === 'home' ? Colors.light.text : Colors.light.textMuted}
          />
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.activeTabLabel]}>
            Home
          </Text>
        </AnimatedTab>

        {/* Tab 2: Jobs */}
        <AnimatedTab onPress={() => onSelectTab('jobs')}>
          <Ionicons
            name={activeTab === 'jobs' ? 'briefcase' : 'briefcase-outline'}
            size={22}
            color={activeTab === 'jobs' ? Colors.light.text : Colors.light.textMuted}
          />
          <Text style={[styles.tabLabel, activeTab === 'jobs' && styles.activeTabLabel]}>
            Jobs
          </Text>
        </AnimatedTab>

        {/* Tab 3: Center Elevated Action Button */}
        <AnimatedCenter
          onPress={onCenterActionPress ?? (() => onSelectTab('action'))}
        />

        {/* Tab 4: Chats */}
        <AnimatedTab onPress={() => onSelectTab('chats')}>
          <View style={styles.iconWithBadge}>
            <Ionicons
              name={activeTab === 'chats' ? 'chatbubble' : 'chatbubble-outline'}
              size={21}
              color={activeTab === 'chats' ? Colors.light.text : Colors.light.textMuted}
            />
            {unreadChats > 0 && <View style={styles.chatBadge} />}
          </View>
          <Text style={[styles.tabLabel, activeTab === 'chats' && styles.activeTabLabel]}>
            Chats
          </Text>
        </AnimatedTab>

        {/* Tab 5: Profile */}
        <AnimatedTab onPress={() => onSelectTab('profile')}>
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={22}
            color={activeTab === 'profile' ? Colors.light.text : Colors.light.textMuted}
          />
          <Text style={[styles.tabLabel, activeTab === 'profile' && styles.activeTabLabel]}>
            Profile
          </Text>
        </AnimatedTab>
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
    height: 66,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 33,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(238, 243, 250, 0.95)',
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 8,
  },
  tabItem: {
    width: 52,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.light.textMuted,
    marginTop: 3,
  },
  activeTabLabel: {
    color: Colors.light.text,
    fontWeight: '700',
  },
  centerButtonWrapper: {
    width: 48,
    height: 48,
    borderRadius: 18,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  centerGradient: {
    flex: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWithBadge: {
    position: 'relative',
  },
  chatBadge: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.light.accentCoral,
  },
});
