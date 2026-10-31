import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Platform, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
  isFilterActive?: boolean;
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function SearchBar({
  value,
  onChangeText,
  onFilterPress,
  placeholder,
  isFilterActive = false,
  onSubmitEditing,
  autoFocus = false,
  style,
}: SearchBarProps) {
  const { colors, isDark } = useTheme();
  const { isClient } = useRole();
  const [isFocused, setIsFocused] = useState(false);

  // Animated scale for the filter action button
  const filterScale = useSharedValue(1);
  const animFilterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: filterScale.get() }],
  }));

  // Animated scale for the clear action button
  const clearScale = useSharedValue(1);
  const animClearStyle = useAnimatedStyle(() => ({
    transform: [{ scale: clearScale.get() }],
  }));

  const defaultPlaceholder = isClient
    ? 'Search verified talent, skills, stacks…'
    : 'Search escrow jobs, skills, companies…';

  const handleFilterPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    filterScale.set(
      withSpring(0.88, { dampingRatio: 0.6, duration: 150 }, () => {
        filterScale.set(withSpring(1, { dampingRatio: 0.6, duration: 200 }));
      })
    );
    if (onFilterPress) {
      onFilterPress();
    }
  };

  const handleClear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    clearScale.set(
      withSpring(0.85, { dampingRatio: 0.6, duration: 120 }, () => {
        clearScale.set(withSpring(1, { dampingRatio: 0.6, duration: 180 }));
      })
    );
    onChangeText('');
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.75)' : '#FFFFFF',
            borderColor: isFocused
              ? colors.primary
              : isDark
              ? 'rgba(51, 65, 85, 0.8)'
              : '#E2E8F0',
            shadowColor: isFocused ? colors.primary : '#0F73F7',
            shadowOpacity: isFocused ? (isDark ? 0.35 : 0.12) : isDark ? 0.2 : 0.05,
            shadowRadius: isFocused ? 12 : 8,
            elevation: isFocused ? 4 : 2,
          },
        ]}>
        {/* Search Icon */}
        <Ionicons
          name="search"
          size={19}
          color={isFocused ? colors.primary : colors.textSecondary}
          style={styles.searchIcon}
        />

        {/* Text Input */}
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || defaultPlaceholder}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={onSubmitEditing}
          returnKeyType="search"
          autoFocus={autoFocus}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {/* Clear Button (Visible only when text is entered) */}
        {value.length > 0 && (
          <Pressable
            onPress={handleClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.clearBtnWrap}>
            <Animated.View style={animClearStyle}>
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textMuted}
              />
            </Animated.View>
          </Pressable>
        )}

        {/* Filter Button */}
        {onFilterPress && (
          <Pressable
            onPress={handleFilterPress}
            onPressIn={() => filterScale.set(withSpring(0.9, { dampingRatio: 0.7 }))}
            onPressOut={() => filterScale.set(withSpring(1, { dampingRatio: 0.7 }))}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
            style={styles.filterBtnWrap}>
            <Animated.View
              style={[
                styles.filterButton,
                animFilterStyle,
                {
                  backgroundColor: isFilterActive
                    ? colors.primary
                    : isDark
                    ? 'rgba(51, 65, 85, 0.85)'
                    : '#EBF4FE',
                },
              ]}>
              <Ionicons
                name={isFilterActive ? 'options' : 'options-outline'}
                size={18}
                color={isFilterActive ? '#FFFFFF' : colors.primary}
              />
              {isFilterActive && <View style={styles.activeDot} />}
            </Animated.View>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
  },
  inputWrapper: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowOffset: { width: 0, height: 4 },
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: Platform.OS === 'android' ? 0 : 4,
  },
  clearBtnWrap: {
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtnWrap: {
    marginLeft: 4,
  },
  filterButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
});
