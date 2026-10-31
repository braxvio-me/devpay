import React, { memo, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

/** DevPay-themed glyphs tiled like a messenger wallpaper. */
const GLYPHS: (keyof typeof Ionicons.glyphMap)[] = [
  'briefcase-outline',
  'chatbubble-outline',
  'shield-checkmark-outline',
  'cash-outline',
  'code-slash-outline',
  'color-palette-outline',
  'phone-portrait-outline',
  'document-text-outline',
  'rocket-outline',
  'star-outline',
  'wallet-outline',
  'globe-outline',
];

const CELL = 64;

const Pattern = memo(function Pattern({ width, height, color }: { width: number; height: number; color: string }) {
  const cols = Math.ceil(width / CELL) + 1;
  const rows = Math.ceil(height / CELL) + 1;
  const items = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = (r * 7 + c * 5) % GLYPHS.length;
      const offset = r % 2 ? CELL / 2 : 0;
      items.push(
        <Ionicons
          key={`${r}-${c}`}
          name={GLYPHS[i]}
          size={20}
          color={color}
          style={{
            position: 'absolute',
            left: c * CELL + offset - 10,
            top: r * CELL + 12,
            transform: [{ rotate: `${((r + c) % 5) * 9 - 18}deg` }],
          }}
        />
      );
    }
  }
  return <>{items}</>;
});

/** Soft tinted gradient with a faint tiled icon pattern, like Telegram/WhatsApp chat backgrounds. */
export function ChatWallpaper() {
  const { isDark } = useTheme();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.width || height !== size.height) setSize({ width, height });
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" onLayout={onLayout}>
      <LinearGradient
        colors={isDark ? ['#0E2029', '#0B171D', '#0E1C24'] : ['#DCEFF8', '#EAF4EF', '#E1EEF7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {size.width > 0 && (
        <Pattern width={size.width} height={size.height} color={isDark ? 'rgba(124, 205, 242, 0.07)' : 'rgba(44, 136, 180, 0.09)'} />
      )}
    </View>
  );
}
