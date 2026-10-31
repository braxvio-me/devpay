import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Chip } from '@/components/ds';
import { Layout } from '@/constants/theme';

interface CategoryPillsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

/** Horizontal pill row that bleeds to the screen edge like the reference. */
export function CategoryPills({ categories, selectedCategory, onSelectCategory }: CategoryPillsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
      accessibilityRole="tablist">
      {categories.map((c) => (
        <Chip key={c} label={c} selected={c === selectedCategory} onPress={() => onSelectCategory(c)} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { marginHorizontal: -Layout.margin, flexGrow: 0 },
  content: { gap: 10, paddingHorizontal: Layout.margin },
});
