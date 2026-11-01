/**
 * DevPay UI kit — atoms rebuilt from the reference set in `ui/`.
 * Every screen composes these so the frosted sky-blue world stays consistent.
 */
import React, { ReactNode, useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, TextInputProps, StyleProp, ViewStyle, TextStyle, AccessibilityInfo, Platform, LayoutChangeEvent, Modal } from 'react-native';
import { Text, TextInput } from '@/components/ui-text';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  Extrapolation,
  runOnJS,
  FadeInDown,
  LinearTransition,
  interpolateColor,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '@/contexts/ThemeContext';
import { Radius, Shadows, Layout } from '@/constants/theme';
import type { Company, CompanyMark } from '@/constants/companies';

type IconName = keyof typeof Ionicons.glyphMap;

// ─── Press feedback ────────────────────────────────────────────────────────
export function PressableScale({
  children,
  onPress,
  style,
  disabled,
  haptic = true,
  scaleTo = 0.97,
  accessibilityLabel,
  accessibilityRole = 'button',
  hitSlop,
  container,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  haptic?: boolean;
  scaleTo?: number;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link' | 'tab' | 'none';
  hitSlop?: number;
  /** Set when children contain their own buttons (cards). */
  container?: boolean;
}) {
  // RN Web renders role=button as <button>, which can't nest buttons.
  const role = container && Platform.OS === 'web' ? 'none' : accessibilityRole;
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  return (
    <AnimatedPressable
      disabled={disabled}
      hitSlop={hitSlop}
      accessibilityRole={role}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      onPressIn={() => scale.set(withTiming(scaleTo, { duration: 110 }))}
      onPressOut={() => scale.set(withSpring(1, { duration: 260, dampingRatio: 0.8 }))}
      onPress={() => {
        if (haptic) Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      style={[style, animated, disabled && { opacity: 0.5 }]}>
      {children}
    </AnimatedPressable>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─── Entrance: short staggered fade-up for list items (honours Reduce Motion) ─
export function Appear({
  index = 0,
  children,
  style,
}: {
  index?: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 8) * 45).duration(320)}
      layout={LinearTransition.duration(220)}
      style={style}>
      {children}
    </Animated.View>
  );
}

// ─── Screen background: flat canvas (height kept for API compatibility) ────
export function ScreenBackground(_: { height?: number }) {
  const { colors } = useTheme();
  return <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />;
}

// ─── Glass card ────────────────────────────────────────────────────────────
export function GlassCard({
  children,
  style,
  onPress,
  padded = true,
  accessibilityLabel,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  padded?: boolean;
  accessibilityLabel?: string;
}) {
  const { colors, isDark } = useTheme();
  const base: StyleProp<ViewStyle> = [
    styles.card,
    padded && styles.cardPadded,
    { backgroundColor: colors.surface },
    { borderWidth: 1, borderColor: colors.border },
    !isDark && Shadows.soft,
    style,
  ];
  if (onPress) {
    return (
      <PressableScale onPress={onPress} style={base} scaleTo={0.985} haptic={false} container accessibilityLabel={accessibilityLabel}>
        {children}
      </PressableScale>
    );
  }
  return <View style={base}>{children}</View>;
}

// ─── Circular icon button (bell, back, more) ───────────────────────────────
export function IconButton({
  icon,
  onPress,
  size = 44,
  iconSize = 20,
  badge,
  color,
  accessibilityLabel,
  style,
}: {
  icon: IconName;
  onPress?: () => void;
  size?: number;
  iconSize?: number;
  badge?: boolean;
  color?: string;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.92}
      hitSlop={6}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.iconBtn,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.surface },
        { borderWidth: 1, borderColor: colors.border },
        style,
      ]}>
      <Ionicons name={icon} size={iconSize} color={color ?? colors.text} />
      {badge && <View style={[styles.iconBadge, { backgroundColor: colors.accentCoral, borderColor: colors.surface }]} />}
    </PressableScale>
  );
}

// ─── Bookmark (coral filled on soft pink, or outline) ─────────────────────
export function BookmarkButton({
  active,
  onPress,
  size = 34,
  onGradient,
}: {
  active?: boolean;
  onPress?: () => void;
  size?: number;
  onGradient?: boolean;
}) {
  const { colors, isDark } = useTheme();
  // Saved: just the filled icon, no circle behind it.
  const bg = active ? 'transparent' : onGradient ? '#FFFFFF' : colors.surface;
  const pop = useSharedValue(1);
  const wasActive = useRef(active);
  useEffect(() => {
    if (active && !wasActive.current) {
      pop.set(withSequence(withTiming(1.35, { duration: 120 }), withSpring(1, { duration: 320, dampingRatio: 0.45 })));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    wasActive.current = active;
  }, [active, pop]);
  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.get() }] }));

  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.88}
      hitSlop={8}
      accessibilityLabel={active ? 'Remove from saved' : 'Save job'}
      style={[
        styles.iconBtn,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
        !active && !onGradient && { borderWidth: 1, borderColor: isDark ? colors.border : '#E3E7EA' },
      ]}>
      <Animated.View style={popStyle}>
        <Ionicons
          name={active ? 'bookmark' : 'bookmark-outline'}
          size={active ? size * 0.6 : size * 0.44}
          color={active ? (onGradient ? '#FFFFFF' : colors.accentCoral) : onGradient ? colors.action : colors.textMuted}
        />
      </Animated.View>
    </PressableScale>
  );
}

// ─── Company logo ──────────────────────────────────────────────────────────
export function CompanyLogo({
  mark,
  size = 40,
  ring = true,
}: {
  mark: CompanyMark;
  size?: number;
  ring?: boolean;
}) {
  const { colors, isDark } = useTheme();
  const inner = size * 0.46;
  return (
    <View
      style={[
        styles.logo,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isDark ? '#F4F7F9' : '#FFFFFF',
          borderColor: ring ? (isDark ? colors.border : '#EEF1F3') : 'transparent',
        },
      ]}>
      {mark.kind === 'tiles' ? (
        <View style={{ width: inner, height: inner, flexDirection: 'row', flexWrap: 'wrap', gap: inner * 0.08 }}>
          {mark.colors.map((c, i) => (
            <View key={i} style={{ width: inner * 0.46, height: inner * 0.46, backgroundColor: c }} />
          ))}
        </View>
      ) : (
        <Text style={{ fontSize: size * 0.48, fontWeight: '700', color: mark.color, letterSpacing: -0.5 }}>
          {mark.letter}
        </Text>
      )}
    </View>
  );
}

// ─── Verified badge ─────────────────────────────────────────────────────────
export function TrustedBadge({ light }: { light?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row4}>
      <MaterialCommunityIcons name="check-decagram" size={14} color={light ? '#FFFFFF' : colors.action} />
      <Text maxFontSizeMultiplier={1.4} style={[styles.trusted, { color: light ? '#E3F0F7' : colors.textSecondary }]}>Verified</Text>
    </View>
  );
}

/** Logo + name + "City · Trusted" block used on every job card. */
export function CompanyRow({
  company,
  light,
  logoSize = 40,
}: {
  company: Company;
  light?: boolean;
  logoSize?: number;
}) {
  const { colors } = useTheme();
  const sub = light ? '#E3F0F7' : colors.textSecondary;
  return (
    <View style={styles.companyRow}>
      <CompanyLogo mark={company.mark} size={logoSize} ring={!light} />
      <View style={{ gap: 2, flexShrink: 1 }}>
        <Text numberOfLines={1} style={[styles.companyName, { color: light ? '#FFFFFF' : colors.text }]}>
          {company.name}
        </Text>
        <View style={styles.row4}>
          <Text style={[styles.companyCity, { color: sub }]}>{company.city}</Text>
          {company.verified && (
            <>
              <Text style={[styles.companyCity, { color: sub }]}>·</Text>
              <TrustedBadge light={light} />
            </>
          )}
        </View>
      </View>
    </View>
  );
}

// ─── Avatars ───────────────────────────────────────────────────────────────
export function Avatar({
  uri,
  size = 44,
  ring = true,
  online,
}: {
  uri: string;
  size?: number;
  ring?: boolean;
  online?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ width: size, height: size }}>
      <Image
        source={{ uri }}
        contentFit="cover"
        transition={200}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: ring ? 2 : 0,
          borderColor: colors.surface,
          backgroundColor: colors.backgroundSelected,
        }}
        accessibilityIgnoresInvertColors
      />
      {online && (
        <View
          style={[
            styles.onlineDot,
            { backgroundColor: colors.accentGreen, borderColor: colors.surface, width: size * 0.26, height: size * 0.26, borderRadius: size * 0.13 },
          ]}
        />
      )}
    </View>
  );
}

export function AvatarStack({
  uris,
  extra,
  size = 26,
  light,
}: {
  uris: readonly string[];
  extra?: number;
  size?: number;
  light?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.stack} accessibilityLabel={`${uris.length + (extra ?? 0)} applicants`}>
      {uris.map((u, i) => (
        <View key={u} style={{ marginLeft: i === 0 ? 0 : -size * 0.32, zIndex: uris.length - i }}>
          <Image
            source={{ uri: u }}
            contentFit="cover"
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: 1.5,
              borderColor: light ? '#FFFFFF' : colors.surface,
              backgroundColor: colors.backgroundSelected,
            }}
          />
        </View>
      ))}
      {extra != null && extra > 0 && (
        <View
          style={[
            styles.stackCount,
            {
              height: size,
              borderRadius: size / 2,
              marginLeft: -size * 0.32,
              backgroundColor: light ? '#FFFFFF' : colors.backgroundElement,
              borderColor: light ? '#FFFFFF' : colors.surface,
            },
          ]}>
          <Text maxFontSizeMultiplier={1.4} style={[styles.stackCountText, { color: light ? colors.primaryText : colors.textSecondary }]}>+{extra}</Text>
        </View>
      )}
    </View>
  );
}

// ─── Chips / pills ─────────────────────────────────────────────────────────
export function Chip({
  label,
  selected,
  onPress,
  icon,
  size = 'md',
  style,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  const content = (
    <>
      {icon && <Ionicons name={icon} size={14} color={selected ? colors.onPrimary : colors.textSecondary} />}
      <Text maxFontSizeMultiplier={1.4}
        numberOfLines={1}
        style={[
          size === 'sm' ? styles.chipTextSm : styles.chipText,
          { color: selected ? colors.onPrimary : size === 'sm' ? colors.textSecondary : colors.text },
        ]}>
        {label}
      </Text>
    </>
  );
  const chipStyle = [
    size === 'sm' ? styles.chipSm : styles.chip,
    { backgroundColor: selected ? colors.primary : colors.backgroundElement },
    style,
  ];
  if (!onPress) return <View style={chipStyle}>{content}</View>;
  return (
    <PressableScale onPress={onPress} style={chipStyle} scaleTo={0.94} accessibilityRole="tab" accessibilityLabel={label}>
      {content}
    </PressableScale>
  );
}

// ─── Section header: title (+ icon) ........ See all ──────────────────────
export function SectionHeader({
  title,
  onSeeAll,
  actionLabel = 'See all',
  style,
  icon,
  iconColor,
}: {
  title: string;
  icon?: IconName;
  iconColor?: string;
  onSeeAll?: () => void;
  actionLabel?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.sectionHeader, style]}>
      <View style={styles.row4}>
        <Text style={[styles.sectionTitle, { color: colors.text }]} accessibilityRole="header">
          {title}
        </Text>
        {icon && <Ionicons name={icon} size={16} color={iconColor ?? colors.primary} />}
      </View>
      {onSeeAll && (
        <Pressable onPress={onSeeAll} hitSlop={10} style={styles.row4} accessibilityRole="link">
          <Text maxFontSizeMultiplier={1.4} style={[styles.seeAll, { color: colors.textSecondary }]}>{actionLabel}</Text>
          <MaterialCommunityIcons name="chevron-double-right" size={16} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

// ─── "Apply" corner on white cards ────────────────────────────────────────
export function ApplyCorner({ onPress, label = 'Apply' }: { onPress?: () => void; label?: string }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => [styles.applyPill, { backgroundColor: colors.action, opacity: pressed ? 0.85 : 1 }]}>
      <Text maxFontSizeMultiplier={1.4} style={[styles.applyText, { color: '#FFFFFF' }]}>{label}</Text>
      <Feather name="arrow-up-right" size={14} color="#FFFFFF" />
    </Pressable>
  );
}

// ─── Top bar: back · title (+verified) · action ────────────────────────────
export function TopBar({
  title,
  verified,
  onBack,
  right,
  subtitle,
}: {
  title?: string;
  verified?: boolean;
  onBack?: () => void;
  right?: ReactNode;
  subtitle?: string;
}) {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <View style={styles.topBar}>
      <IconButton
        icon="chevron-back"
        accessibilityLabel="Go back"
        onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
      />
      <View style={styles.topBarTitle}>
        {title && (
          <View style={styles.row4}>
            <Text maxFontSizeMultiplier={1.4} numberOfLines={1} style={[styles.topBarText, { color: colors.text }]} accessibilityRole="header">
              {title}
            </Text>
            {verified && <MaterialCommunityIcons name="check-decagram" size={17} color={colors.primary} />}
          </View>
        )}
        {subtitle && <Text style={[styles.topBarSub, { color: colors.textSecondary }]}>{subtitle}</Text>}
      </View>
      <View style={{ width: 44, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

// ─── Buttons ───────────────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'dark' | 'light' | 'soft' | 'danger' | 'ghost';

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  iconRight,
  loading,
  disabled,
  style,
  size = 'lg',
  fg,
}: {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  size?: 'md' | 'lg';
  /** Label/icon colour override, e.g. a ghost button on a gradient. */
  fg?: string;
}) {
  const { colors } = useTheme();
  const height = size === 'lg' ? 56 : 46;
  const text: TextStyle = { fontSize: size === 'lg' ? 16 : 14, fontWeight: '600' };
  const palette: Record<ButtonVariant, { bg?: string; fg: string; border?: string }> = {
    primary: { bg: colors.action, fg: '#FFFFFF' },
    dark: { bg: colors.ink, fg: colors.onInk },
    light: { bg: colors.surface, fg: colors.text, border: colors.border },
    soft: { bg: colors.primarySoft, fg: colors.primaryText },
    danger: { bg: colors.coralSoft, fg: colors.accentCoral },
    ghost: { bg: 'transparent', fg: colors.textSecondary },
  };
  const p = palette[variant];
  const inner = (
    <>
      {icon}
      <Text maxFontSizeMultiplier={1.4} numberOfLines={1} style={[text, { color: fg ?? p.fg }]}>
        {loading ? 'Please wait…' : label}
      </Text>
      {iconRight}
    </>
  );
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={label}
      style={[
        { height, borderRadius: Radius.pill, overflow: 'hidden' },
        style,
      ]}>
      <View style={[styles.btnInner, { backgroundColor: p.bg, borderWidth: p.border ? 1 : 0, borderColor: p.border }]}>
        {inner}
      </View>
    </PressableScale>
  );
}

// ─── Segmented control ─────────────────────────────────────────────────────
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  variant = 'soft',
  style,
}: {
  options: { value: T; label: string; icon?: IconName }[];
  /** `null` shows no selection (the thumb hides). */
  value: T | null;
  onChange: (v: T) => void;
  variant?: 'soft' | 'cta';
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, isDark } = useTheme();
  const [width, setWidth] = React.useState(0);
  const found = options.findIndex((o) => o.value === value);
  const index = Math.max(0, found);
  const x = useSharedValue(0);
  const segW = width > 0 ? (width - 8) / options.length : 0;

  useEffect(() => {
    x.set(withSpring(index * segW, { duration: 300, dampingRatio: 0.9 }));
  }, [index, segW, x]);

  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));
  const isCta = variant === 'cta';

  const body = (
    <>
      {segW > 0 && found >= 0 && (
        <Animated.View
          style={[
            styles.segThumb,
            { width: segW, backgroundColor: isCta ? '#FFFFFF' : isDark ? colors.backgroundSelected : colors.surface },
            thumb,
          ]}
        />
      )}
      {options.map((o) => {
        const active = o.value === value;
        const fg = isCta ? (active ? colors.action : '#FFFFFF') : active ? colors.text : colors.textSecondary;
        return (
          <Pressable
            key={o.value}
            style={styles.segItem}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              onChange(o.value);
            }}>
            {o.icon && <Ionicons name={o.icon} size={15} color={fg} />}
            <Text maxFontSizeMultiplier={1.4} style={[styles.segText, { color: fg }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </>
  );

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  if (isCta) {
    return (
      <View onLayout={onLayout} style={[styles.seg, { backgroundColor: colors.action }, Shadows.lifted, style]}>
        {body}
      </View>
    );
  }
  return (
    <View onLayout={onLayout} style={[styles.seg, { backgroundColor: colors.backgroundElement }, style]}>
      {body}
    </View>
  );
}

// ─── Slide to confirm ("Apply Now  › › › ›") ───────────────────────────────
export function SlideToConfirm({
  label,
  onConfirm,
  disabled,
}: {
  label: string;
  onConfirm: () => void;
  disabled?: boolean;
}) {
  const { colors } = useTheme();
  const [trackW, setTrackW] = React.useState(0);
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const x = useSharedValue(0);
  const THUMB = 120;
  const max = Math.max(0, trackW - THUMB - 8);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
  }, []);

  const confirm = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onConfirm();
  };

  const pan = Gesture.Pan()
    .enabled(!disabled && max > 0)
    .onChange((e) => {
      x.set(Math.min(max, Math.max(0, x.get() + e.changeX)));
    })
    .onEnd((e) => {
      if (x.get() > max * 0.72 || e.velocityX > 900) {
        x.set(withTiming(max, { duration: 140 }, () => {
          runOnJS(confirm)();
          x.set(withTiming(0, { duration: 400 }));
        }));
      } else {
        x.set(withSpring(0, { duration: 320, dampingRatio: 0.85 }));
      }
    });

  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));
  const chevrons = useAnimatedStyle(() => ({
    opacity: interpolate(x.get(), [0, max * 0.6 || 1], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <View
      onLayout={(e) => setTrackW(e.nativeEvent.layout.width)}
      style={[styles.slider, { backgroundColor: colors.action }, disabled && { opacity: 0.6 }]}>
      <Animated.View style={[styles.sliderChevrons, chevrons]} pointerEvents="none">
        {[0.35, 0.5, 0.65, 0.82, 1].map((o, i) => (
          <Ionicons key={i} name="chevron-forward" size={18} color="#FFFFFF" style={{ marginLeft: -5, opacity: o }} />
        ))}
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.sliderThumb, { width: THUMB }, thumbStyle]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityHint={reduceMotion ? undefined : 'Slide right or double tap to confirm'}
            onPress={disabled ? undefined : confirm}
            style={styles.sliderThumbInner}>
            <Text maxFontSizeMultiplier={1.4} style={[styles.sliderLabel, { color: colors.action }]}>{label}</Text>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

// ─── Inputs ────────────────────────────────────────────────────────────────
export function Field({
  label,
  icon,
  error,
  right,
  prefix,
  style,
  ...input
}: TextInputProps & {
  label?: string;
  icon?: IconName;
  error?: string;
  right?: ReactNode;
  prefix?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  const [focused, setFocused] = React.useState(false);
  return (
    <View style={[{ gap: 8 }, style]}>
      {label && <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>}
      <View
        style={[
          styles.field,
          { backgroundColor: colors.surface, borderColor: error ? colors.accentCoral : focused ? colors.primary : colors.border },
          input.multiline && { borderRadius: Radius.lg, alignItems: 'flex-start' },
        ]}>
        {icon && <Ionicons name={icon} size={19} color={colors.textMuted} />}
        {prefix}
        <TextInput
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          {...input}
          onFocus={(e) => {
            setFocused(true);
            input.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            input.onBlur?.(e);
          }}
          style={[styles.fieldInput, { color: colors.text }, input.multiline && { minHeight: 96, textAlignVertical: 'top', paddingTop: 14 }]}
        />
        {right}
      </View>
      {error && <Text style={[styles.fieldError, { color: colors.accentCoral }]}>{error}</Text>}
    </View>
  );
}

// ─── Settings-style list row ───────────────────────────────────────────────
export function ListRow({
  icon,
  label,
  value,
  onPress,
  danger,
  right,
  last,
  tint,
}: {
  icon?: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  right?: ReactNode;
  last?: boolean;
  tint?: string;
}) {
  const { colors } = useTheme();
  const fg = danger ? colors.accentCoral : colors.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => [
        styles.listRow,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
        pressed && { opacity: 0.6 },
      ]}>
      {icon && (
        <View style={[styles.listIcon, { backgroundColor: danger ? colors.coralSoft : colors.primaryWash }]}>
          <Ionicons name={icon} size={18} color={danger ? colors.accentCoral : tint ?? colors.navActive} />
        </View>
      )}
      <Text style={[styles.listLabel, { color: fg }]} numberOfLines={1}>
        {label}
      </Text>
      {value && <Text style={[styles.listValue, { color: colors.textSecondary }]}>{value}</Text>}
      {right ?? (onPress && <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />)}
    </Pressable>
  );
}

// ─── Status pill ───────────────────────────────────────────────────────────
export function StatusPill({
  label,
  tone = 'blue',
  icon,
}: {
  label: string;
  tone?: 'blue' | 'green' | 'amber' | 'coral' | 'grey';
  icon?: IconName;
}) {
  const { colors } = useTheme();
  // Solid fills with white text: no tinted washes.
  const map = {
    blue: [colors.action, '#FFFFFF'],
    green: ['#178A60', '#FFFFFF'],
    amber: ['#B26A00', '#FFFFFF'],
    coral: ['#CF3A40', '#FFFFFF'],
    grey: [colors.text, colors.background],
  } as const;
  const [bg, fg] = map[tone];
  return (
    <View style={[styles.statusPill, { backgroundColor: bg }]}>
      {icon && <Ionicons name={icon} size={12} color={fg} />}
      <Text maxFontSizeMultiplier={1.4} style={[styles.statusText, { color: fg }]}>{label}</Text>
    </View>
  );
}

// ─── Selectable card with radio ────────────────────────────────────────────
export function ChoiceCard({
  selected,
  onPress,
  icon,
  title,
  description,
  children,
}: {
  selected: boolean;
  onPress: () => void;
  icon?: IconName;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  const { colors, isDark } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.985}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[
        styles.choice,
        { backgroundColor: colors.surface, borderColor: selected ? colors.primary : isDark ? colors.border : 'transparent' },
        !isDark && Shadows.soft,
      ]}>
      <View style={styles.choiceTop}>
        {icon && (
          <View style={[styles.choiceIcon, { backgroundColor: selected ? colors.primary : colors.primaryWash }]}>
            <Ionicons name={icon} size={22} color={selected ? colors.onPrimary : colors.navActive} />
          </View>
        )}
        <Text style={[styles.choiceTitle, { color: colors.text }]}>{title}</Text>
        <View style={[styles.radio, { borderColor: selected ? colors.primary : colors.backgroundSelected }]}>
          {selected && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
        </View>
      </View>
      {description && <Text style={[styles.choiceDesc, { color: colors.textSecondary }]}>{description}</Text>}
      {children}
    </PressableScale>
  );
}

// ─── Switch: identical on iOS and Android (replaces the native switch) ────
export function Switch({
  value,
  onValueChange,
  disabled,
  accessibilityLabel,
  trackColor,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  /** Accepted for API compatibility with the native switch; `true` sets the on colour. */
  trackColor?: { true?: string; false?: string };
  thumbColor?: string;
}) {
  const { colors } = useTheme();
  const t = useSharedValue(value ? 1 : 0);
  useEffect(() => {
    t.set(withSpring(value ? 1 : 0, { duration: 260, dampingRatio: 0.85 }));
  }, [t, value]);
  const on = trackColor?.true ?? colors.primary;
  const off = colors.backgroundSelected;
  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: t.get() * 20 }] }));
  const track = useAnimatedStyle(() => ({ backgroundColor: interpolateColor(t.get(), [0, 1], [off, on]) }));
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onValueChange(!value);
      }}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}>
      <Animated.View style={[styles.switchTrack, track, disabled && { opacity: 0.5 }]}>
        <Animated.View style={[styles.switchThumb, thumb]} />
      </Animated.View>
    </Pressable>
  );
}

// ─── Bottom sheet ──────────────────────────────────────────────────────────
export function Sheet({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" accessibilityRole="button" />
      <View style={styles.sheetDock} pointerEvents="box-none">
      <View style={[styles.sheet, { backgroundColor: colors.surface, paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <View style={[styles.handle, { backgroundColor: colors.backgroundSelected }]} />
        {title && (
          <Text style={[styles.sheetTitle, { color: colors.text }]} accessibilityRole="header">
            {title}
          </Text>
        )}
        {children}
      </View>
      </View>
    </Modal>
  );
}

/** Bottom padding that clears the floating nav and the home indicator. */
export function useNavClearance() {
  const insets = useSafeAreaInsets();
  return Layout.navHeight + Math.max(insets.bottom, 12) + 36;
}

const styles = StyleSheet.create({
  row4: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  card: { borderRadius: Radius.lg },
  cardPadded: { padding: 16 },
  iconBtn: { alignItems: 'center', justifyContent: 'center' },
  iconBadge: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1.5,
  },
  logo: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, overflow: 'hidden' },
  trusted: { fontSize: 12, fontWeight: '400' },
  companyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 },
  companyName: { fontSize: 15, fontWeight: '500', letterSpacing: -0.1 },
  companyCity: { fontSize: 12 },
  onlineDot: { position: 'absolute', right: 0, top: 0, borderWidth: 2 },
  stack: { flexDirection: 'row', alignItems: 'center' },
  stackCount: { alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, minWidth: 30, paddingHorizontal: 4 },
  stackCountText: { fontSize: 9, fontWeight: '600' },
  chip: {
    minHeight: 38,
    paddingHorizontal: 16,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  chipSm: {
    minHeight: 30,
    paddingHorizontal: 12,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  chipText: { fontSize: 14, fontWeight: '400' },
  chipTextSm: { fontSize: 12, fontWeight: '400' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '600', letterSpacing: -0.1 },
  seeAll: { fontSize: 13 },
  applyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 34,
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
  },
  applyText: { fontSize: 13, fontWeight: '600' },
  topBar: {
    height: Layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.margin,
  },
  topBarTitle: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  topBarText: { fontSize: 17, fontWeight: '600', letterSpacing: -0.2 },
  topBarSub: { fontSize: 12, marginTop: 1 },
  btnInner: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 16 },
  seg: { height: 48, borderRadius: Radius.pill, flexDirection: 'row', padding: 4 },
  segThumb: { position: 'absolute', top: 4, left: 4, bottom: 4, borderRadius: Radius.pill },
  segItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  segText: { fontSize: 14, fontWeight: '500' },
  slider: { height: 58, borderRadius: Radius.pill, padding: 4, justifyContent: 'center' },
  sliderChevrons: { position: 'absolute', right: 22, flexDirection: 'row', alignItems: 'center' },
  sliderThumb: { height: 50, borderRadius: Radius.pill, backgroundColor: '#FFFFFF' },
  sliderThumbInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sliderLabel: { fontSize: 15, fontWeight: '500', color: '#17191C' },
  fieldLabel: { fontSize: 13, fontWeight: '500' },
  field: {
    minHeight: 54,
    borderRadius: Radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 10,
  },
  fieldInput: { flex: 1, fontSize: 15, paddingVertical: 12, ...(Platform.OS === 'web' ? { outlineWidth: 0 } : null) },
  fieldError: { fontSize: 12, marginLeft: 16 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  listIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  listLabel: { flex: 1, fontSize: 15, fontWeight: '400' },
  listValue: { fontSize: 14 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    height: 24,
    borderRadius: 7,
    alignSelf: 'flex-start',
  },
  statusText: { fontSize: 12, fontWeight: '600', letterSpacing: 0.1 },
  choice: { borderRadius: Radius.lg, padding: 16, borderWidth: 1.5, gap: 10 },
  choiceTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  choiceIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  choiceTitle: { flex: 1, fontSize: 16, fontWeight: '600' },
  choiceDesc: { fontSize: 13, lineHeight: 19 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  switchTrack: { width: 50, height: 30, borderRadius: 15, padding: 3 },
  switchThumb: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFFFFF', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)' },
  backdrop: { flex: 1, backgroundColor: 'rgba(12, 22, 28, 0.38)' },
  sheetDock: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center' },
  sheet: {
    width: '100%',
    maxWidth: 640,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    paddingHorizontal: Layout.margin,
    paddingTop: 10,
  },
  handle: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, marginBottom: 14 },
  sheetTitle: { fontSize: 17, fontWeight: '600', marginBottom: 8 },
});
