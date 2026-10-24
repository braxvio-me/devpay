import React from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';

interface CategoryPillsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryPills({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryPillsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {categories.map((category) => {
        const isSelected = category === selectedCategory;
        return (
          <TouchableOpacity
            key={category}
            style={[styles.pill, isSelected && styles.selectedPill]}
            onPress={() => onSelectCategory(category)}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.pillText,
                isSelected && styles.selectedPillText,
              ]}>
              {category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F3F6FA',
    borderWidth: 1,
    borderColor: '#E8EFF8',
  },
  selectedPill: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  selectedPillText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
