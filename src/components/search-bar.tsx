import React, { ReactNode } from 'react';
import { View, StyleSheet, Pressable, StyleProp, ViewStyle, Platform } from 'react-native';
import { TextInput } from '@/components/ui-text';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { Radius } from '@/constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
  isFilterActive?: boolean;
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Replaces the filter button (e.g. mic + avatar on the search screen). */
  right?: ReactNode;
}

export function SearchBar({
  value,
  onChangeText,
  onFilterPress,
  placeholder = 'Search Here...',
  isFilterActive,
  onSubmitEditing,
  autoFocus,
  style,
  right,
}: SearchBarProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: colors.surface },
        { borderWidth: 1, borderColor: colors.border },
        style,
      ]}>
      <Ionicons name="search-outline" size={21} color={colors.text} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.primary}
        returnKeyType="search"
        onSubmitEditing={onSubmitEditing}
        autoFocus={autoFocus}
        accessibilityLabel="Search"
        style={[styles.input, { color: colors.text }]}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={10} accessibilityLabel="Clear search">
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </Pressable>
      )}
      {right ??
        (onFilterPress && (
          <Pressable
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              onFilterPress();
            }}
            accessibilityRole="button"
            accessibilityLabel="Filters"
            style={[styles.filter, { backgroundColor: isFilterActive ? colors.primary : colors.primarySoft }]}>
            <Ionicons name="options-outline" size={19} color={isFilterActive ? colors.onPrimary : colors.primary} />
          </Pressable>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 52,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 6,
    gap: 10,
  },
  input: { flex: 1, fontSize: 14, paddingVertical: 0, height: '100%', ...(Platform.OS === 'web' ? { outlineWidth: 0 } : null) },
  filter: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
