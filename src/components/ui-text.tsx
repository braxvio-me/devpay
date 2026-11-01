/**
 * App-wide Text and TextInput: same typeface (Inter) and metrics on iOS, Android and web.
 *
 * Android only renders bold/semibold correctly when each weight is its own font file, so
 * `fontWeight` is mapped to the matching Inter family and reset to normal. Android's extra
 * font padding is turned off so line heights match iOS.
 */
import React, { forwardRef } from 'react';
import {
  Text as RNText,
  TextInput as RNTextInput,
  StyleSheet,
  type TextProps,
  type TextInputProps,
  type TextStyle,
  type StyleProp,
} from 'react-native';

export const InterFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

const BY_WEIGHT: Record<string, string> = {
  normal: InterFamily.regular,
  '100': InterFamily.regular,
  '200': InterFamily.regular,
  '300': InterFamily.regular,
  '400': InterFamily.regular,
  '500': InterFamily.medium,
  '600': InterFamily.semibold,
  '700': InterFamily.bold,
  bold: InterFamily.bold,
  '800': InterFamily.bold,
  '900': InterFamily.bold,
};

function withInter(style: StyleProp<TextStyle>): StyleProp<TextStyle> {
  const flat = StyleSheet.flatten(style) ?? {};
  // Respect explicit non-Inter families (e.g. monospace for codes).
  if (flat.fontFamily && !flat.fontFamily.startsWith('Inter')) return [styles.base, style];
  const family = BY_WEIGHT[String(flat.fontWeight ?? '400')] ?? InterFamily.regular;
  return [styles.base, style, { fontFamily: family, fontWeight: 'normal' }];
}

export const Text = forwardRef<React.ComponentRef<typeof RNText>, TextProps>(function Text({ style, ...props }, ref) {
  return <RNText ref={ref} {...props} style={withInter(style)} />;
});

export const TextInput = forwardRef<React.ComponentRef<typeof RNTextInput>, TextInputProps>(function TextInput(
  { style, ...props },
  ref
) {
  return <RNTextInput ref={ref} {...props} style={withInter(style)} />;
});

const styles = StyleSheet.create({
  base: { includeFontPadding: false },
});
