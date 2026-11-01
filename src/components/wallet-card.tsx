/**
 * Virtual DevPay card kept inside a leather wallet. The wallet stays closed (balance hidden) until the
 * owner enters their wallet PIN; then the card slides out and the wallet drops away. It closes again
 * on the lock button, after 2 minutes, or when the app goes to the background (WalletLockContext).
 * Tap the open card to flip it for the balance breakdown.
 */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, AccessibilityInfo, Platform, useWindowDimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { Text } from '@/components/ui-text';
import { DevPayMark } from '@/components/devpay-mark';
import { PinSheet } from '@/components/pin-sheet';
import { useWalletLock } from '@/contexts/WalletLockContext';
import { Layout, Radius } from '@/constants/theme';

export type CardTone = 'escrow' | 'earnings';

/** Both cards use the app's action blue; only the label differs. */
const TONES: Record<CardTone, { base: string; shape1: string; shape2: string; kind: string }> = {
  escrow: { base: '#1C6E99', shape1: '#2279A8', shape2: '#2A86B6', kind: 'ESCROW' },
  earnings: { base: '#1C6E99', shape1: '#2279A8', shape2: '#2A86B6', kind: 'WALLET' },
};

const LEATHER = '#3B2A20';
const LEATHER_EDGE = '#4E3829';
const STITCH = '#7A5B44';
const BRASS = '#C9A267';
const CLIP_PAD = 14;
/** Closed: how far the card sits down in the wallet, and where the pocket's top edge is. */
const TUCK = 0.14;
const POCKET_TOP = 0.25;

interface Props {
  tone?: CardTone;
  label: string;
  amount: string;
  holder: string;
  /** Last four digits shown on the card. */
  last4: string;
  badge?: string;
  /** Shown on the back of the card. */
  breakdown: { label: string; value: string }[];
}

function Chip() {
  return (
    <View style={styles.chip}>
      <View style={[styles.chipLine, { top: 9 }]} />
      <View style={[styles.chipLine, { top: 18 }]} />
      <View style={styles.chipMid} />
    </View>
  );
}

export function WalletCard({ tone = 'escrow', label, amount, holder, last4, badge, breakdown }: Props) {
  const { width } = useWindowDimensions();
  const cardW = Math.min(width - Layout.margin * 2, 460);
  const cardH = Math.round(cardW / 1.586);
  const t = TONES[tone];
  const { unlocked, hasPin, lock } = useWalletLock();

  const [hidden, setHidden] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);

  const out = useSharedValue(unlocked ? 1 : 0); // 0 = card tucked in a closed wallet, 1 = card out
  const pocket = useSharedValue(unlocked ? 0 : 1); // 1 = wallet front in place, 0 = dropped away
  const flip = useSharedValue(0);

  // Open or close the wallet whenever the lock state changes.
  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduce) => {
        if (cancelled) return;
        if (reduce) {
          out.set(unlocked ? 1 : 0);
          pocket.set(unlocked ? 0 : 1);
          return;
        }
        if (unlocked) {
          out.set(withSpring(1, { duration: 850, dampingRatio: 0.74 }));
          pocket.set(withDelay(420, withTiming(0, { duration: 380, easing: Easing.in(Easing.cubic) })));
        } else {
          flip.set(withTiming(0, { duration: 200 }));
          pocket.set(withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) }));
          out.set(withDelay(80, withTiming(0, { duration: 420, easing: Easing.inOut(Easing.cubic) })));
        }
      });
    if (!unlocked) setTimeout(() => !cancelled && setFlipped(false), 0);
    return () => {
      cancelled = true;
    };
  }, [flip, out, pocket, unlocked]);

  const toggleFlip = () => {
    const next = !flipped;
    setFlipped(next);
    flip.set(withTiming(next ? 1 : 0, { duration: 520, easing: Easing.inOut(Easing.cubic) }));
    Haptics.selectionAsync().catch(() => {});
  };

  const closeWallet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    lock();
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(out.get(), [0, 1], [cardH * TUCK, 0]) }, { rotate: `${interpolate(out.get(), [0, 0.7, 1], [0, 1, 0])}deg` }],
  }));
  const frontStyle = useAnimatedStyle(() => ({
    opacity: flip.get() < 0.5 ? 1 : 0,
    transform: [{ perspective: 1200 }, { rotateY: `${flip.get() * 180}deg` }],
  }));
  const backStyle = useAnimatedStyle(() => ({
    opacity: flip.get() >= 0.5 ? 1 : 0,
    transform: [{ perspective: 1200 }, { rotateY: `${flip.get() * 180 - 180}deg` }],
  }));
  const walletBackStyle = useAnimatedStyle(() => ({ opacity: pocket.get() }));
  const pocketStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pocket.get(), [0, 0.3, 1], [0, 1, 1]),
    transform: [{ translateY: (1 - pocket.get()) * cardH * 0.9 }],
  }));

  const pocketH = Math.round(cardH * (1 - POCKET_TOP)) + CLIP_PAD;

  return (
    // Clips the tucked-in card and the dropping pocket; the padding leaves room for the card's shadow.
    <View style={[styles.clip, { width: cardW + CLIP_PAD * 2, height: cardH + CLIP_PAD + 6 }]}>
      <View style={{ width: cardW, height: cardH }}>
        {/* Wallet body behind the card. */}
        <Animated.View pointerEvents="none" style={[styles.walletBack, { top: cardH * 0.04 }, walletBackStyle]} />

        <Animated.View style={[StyleSheet.absoluteFill, cardStyle]} pointerEvents={unlocked ? 'auto' : 'none'}>
          <Pressable
            onPress={toggleFlip}
            // RN Web renders role=button as <button>, which can't contain the eye and lock buttons.
            accessibilityRole={Platform.OS === 'web' ? undefined : 'button'}
            accessibilityLabel={`${label} ${hidden ? 'hidden' : amount}. DevPay ${t.kind.toLowerCase()} card ending ${last4}.`}
            accessibilityHint={flipped ? 'Shows the front of the card' : 'Shows the balance breakdown'}
            style={StyleSheet.absoluteFill}>
            {/* Front */}
            <Animated.View style={[styles.face, { backgroundColor: t.base }, frontStyle]}>
              <View style={[styles.shape, { backgroundColor: t.shape1, width: cardW * 0.9, height: cardW * 0.9, right: -cardW * 0.42, top: -cardW * 0.38 }]} />
              <View style={[styles.shape, { backgroundColor: t.shape2, width: cardW * 0.55, height: cardW * 0.55, right: -cardW * 0.22, top: -cardW * 0.2 }]} />

              <View style={styles.rowBetween}>
                <View style={styles.brand}>
                  <DevPayMark size={18} />
                  <Text style={styles.brandText}>DevPay</Text>
                </View>
                <View style={styles.brand}>
                  <Text style={styles.kind}>{t.kind}</Text>
                  <Pressable onPress={closeWallet} hitSlop={10} accessibilityRole="button" accessibilityLabel="Lock wallet">
                    <Ionicons name="lock-open-outline" size={16} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>

              <View style={{ marginTop: 'auto' }}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>{label}</Text>
                  <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10} accessibilityRole="button" accessibilityLabel={hidden ? 'Show balance' : 'Hide balance'}>
                    <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={16} color="#D3E6F0" />
                  </Pressable>
                </View>
                <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1.2}>
                  {hidden ? 'GH₵ ••••••' : amount}
                </Text>
              </View>

              <View style={[styles.rowBetween, { marginTop: 10 }]}>
                <View style={styles.chipRow}>
                  <Chip />
                  <MaterialCommunityIcons name="contactless-payment" size={22} color="#E3F0F7" />
                </View>
                <Text style={styles.number} maxFontSizeMultiplier={1.2}>
                  ••••  {last4}
                </Text>
              </View>

              <View style={[styles.rowBetween, { marginTop: 10 }]}>
                <Text style={styles.holder} numberOfLines={1} maxFontSizeMultiplier={1.2}>
                  {holder.toUpperCase()}
                </Text>
                {badge ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badge}</Text>
                  </View>
                ) : (
                  <Text style={styles.holder}>11/29</Text>
                )}
              </View>
            </Animated.View>

            {/* Back */}
            <Animated.View style={[styles.face, styles.back, { backgroundColor: t.base }, backStyle]}>
              <View style={styles.stripe} />
              <View style={styles.backBody}>
                <View style={styles.sigRow}>
                  <View style={styles.sig} />
                  <View style={styles.cvv}>
                    <Text style={styles.cvvText}>•••</Text>
                  </View>
                </View>
                <View style={styles.breakdown}>
                  {breakdown.map((b, i) => (
                    <View key={b.label} style={[styles.bItem, i > 0 && styles.bDivider]}>
                      <Text style={styles.bLabel} numberOfLines={1}>
                        {b.label}
                      </Text>
                      <Text style={styles.bValue} numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1.2}>
                        {hidden ? '••••' : b.value}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.flipHint}>Virtual card · tap to flip back</Text>
              </View>
            </Animated.View>
          </Pressable>
        </Animated.View>

        {/* Wallet front pocket: covers the card until the PIN is entered. */}
        <Animated.View style={[styles.pocket, { height: pocketH }, pocketStyle]} pointerEvents={unlocked ? 'none' : 'auto'}>
          <Pressable
            onPress={() => setPinOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={hasPin === false ? 'Wallet locked. Create a PIN to open it.' : 'Wallet locked. Enter your PIN to open it.'}
            style={({ pressed }) => [styles.pocketInner, pressed && { opacity: 0.92 }]}>
            <View style={styles.stitch} />
            <View style={styles.strap}>
              <View style={styles.snap} />
            </View>
            <View style={styles.pocketBody}>
              <View style={styles.lockRow}>
                <Ionicons name="lock-closed" size={15} color={BRASS} />
                <Text style={styles.lockedLabel}>{label}</Text>
              </View>
              <Text style={styles.lockedAmount}>GH₵ ••••••</Text>
              <View style={styles.cta}>
                <Text style={styles.ctaText}>{hasPin === false ? 'Set a PIN to open' : 'Tap to open with PIN'}</Text>
                <Ionicons name="arrow-forward" size={14} color="#1C1410" />
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </View>

      <PinSheet visible={pinOpen} mode="unlock" onClose={() => setPinOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { alignSelf: 'center', overflow: 'hidden', paddingHorizontal: CLIP_PAD, paddingTop: 6, marginTop: -6, marginBottom: -CLIP_PAD },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: Radius.xl,
    padding: 18,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
    boxShadow: '0px 10px 22px rgba(10, 25, 34, 0.28)',
  },
  back: { padding: 0 },
  shape: { position: 'absolute', borderRadius: 999 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
  kind: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', letterSpacing: 1.6 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { color: '#D3E6F0', fontSize: 12, fontWeight: '500' },
  amount: { color: '#FFFFFF', fontSize: 28, fontWeight: '700', letterSpacing: -0.8, marginTop: 2, fontVariant: ['tabular-nums'] },
  chipRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  chip: { width: 38, height: 28, borderRadius: 6, backgroundColor: '#D9B45A', overflow: 'hidden' },
  chipLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#B8913A' },
  chipMid: { position: 'absolute', left: 14, top: 0, bottom: 0, width: 10, borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#B8913A' },
  number: { color: '#E6ECEF', fontSize: 16, fontWeight: '600', letterSpacing: 2, fontVariant: ['tabular-nums'] },
  holder: { color: '#E3F0F7', fontSize: 12, fontWeight: '600', letterSpacing: 1.2, flexShrink: 1 },
  badge: { backgroundColor: '#FFFFFF', paddingHorizontal: 10, height: 24, borderRadius: 7, justifyContent: 'center' },
  badgeText: { color: '#1C6E99', fontSize: 11, fontWeight: '700' },
  stripe: { height: 40, backgroundColor: '#0B2533', marginTop: 20 },
  backBody: { flex: 1, padding: 18, paddingTop: 14, justifyContent: 'space-between' },
  sigRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sig: { flex: 1, height: 30, borderRadius: 4, backgroundColor: '#E6ECEF' },
  cvv: { width: 52, height: 30, borderRadius: 4, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  cvvText: { color: '#15181B', fontSize: 14, fontWeight: '700', letterSpacing: 2 },
  breakdown: { flexDirection: 'row' },
  bItem: { flex: 1, paddingRight: 8 },
  bDivider: { borderLeftWidth: 1, borderLeftColor: '#4A8FB5', paddingLeft: 12 },
  bLabel: { color: '#D3E6F0', fontSize: 11 },
  bValue: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginTop: 2, fontVariant: ['tabular-nums'] },
  flipHint: { color: '#BFDCEB', fontSize: 11 },
  walletBack: { position: 'absolute', left: -6, right: -6, bottom: -CLIP_PAD, borderRadius: 22, backgroundColor: LEATHER_EDGE },
  pocket: { position: 'absolute', left: -6, right: -6, bottom: -CLIP_PAD },
  pocketInner: {
    flex: 1,
    borderRadius: 22,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: LEATHER,
    boxShadow: '0px -6px 14px rgba(0, 0, 0, 0.28)',
    overflow: 'hidden',
  },
  stitch: { position: 'absolute', top: 8, left: 10, right: 10, bottom: CLIP_PAD + 6, borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed', borderColor: STITCH },
  strap: { position: 'absolute', right: 0, top: 22, width: 64, height: 34, borderTopLeftRadius: 17, borderBottomLeftRadius: 17, backgroundColor: '#2E2018', justifyContent: 'center', paddingLeft: 10 },
  snap: { width: 16, height: 16, borderRadius: 8, backgroundColor: BRASS, borderWidth: 3, borderColor: '#A8834B' },
  pocketBody: { flex: 1, paddingHorizontal: 24, paddingTop: 22, paddingBottom: CLIP_PAD + 18, justifyContent: 'space-between' },
  lockRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lockedLabel: { color: '#D9C2A3', fontSize: 13, fontWeight: '600' },
  lockedAmount: { color: '#F2E6D6', fontSize: 26, fontWeight: '700', letterSpacing: 1 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: BRASS, paddingHorizontal: 14, height: 34, borderRadius: 10 },
  ctaText: { color: '#1C1410', fontSize: 13, fontWeight: '700' },
});

/** Stable four digits for the virtual card, derived from the account id. */
export function cardDigits(id?: string) {
  let h = 7;
  for (const c of id ?? 'devpay') h = (h * 31 + c.charCodeAt(0)) % 10000;
  return String(h).padStart(4, '0');
}
