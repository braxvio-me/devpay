/**
 * Virtual DevPay card. On first show it slides up out of a wallet pocket, then the wallet drops away.
 * Tap the card to flip it and see the balance breakdown; the eye hides the balance.
 */
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  AccessibilityInfo,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Text } from "@/components/ui-text";
import { DevPayMark } from "@/components/devpay-mark";
import { afterIntro } from "@/lib/intro";
import { Layout, Radius } from "@/constants/theme";

export type CardTone = "escrow" | "earnings";

const TONES: Record<
  CardTone,
  { base: string; shape1: string; shape2: string; accent: string; kind: string }
> = {
  escrow: {
    base: "#0E3A50",
    shape1: "#124A66",
    shape2: "#16587A",
    accent: "#13C3A3",
    kind: "ESCROW",
  },
  earnings: {
    base: "#15181B",
    shape1: "#1E2428",
    shape2: "#263036",
    accent: "#F5A524",
    kind: "WALLET",
  },
};

const POCKET = "#3B2A20";
const CLIP_PAD = 14;
const POCKET_EDGE = "#4E3829";

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

export function WalletCard({
  tone = "escrow",
  label,
  amount,
  holder,
  last4,
  badge,
  breakdown,
}: Props) {
  const { width } = useWindowDimensions();
  const cardW = Math.min(width - Layout.margin * 2, 460);
  const cardH = Math.round(cardW / 1.586);
  const t = TONES[tone];

  const [hidden, setHidden] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const rise = useSharedValue(0); // 0 = in the pocket, 1 = out
  const pocket = useSharedValue(1); // 1 = wallet visible, 0 = gone
  const flip = useSharedValue(0);

  useEffect(() => {
    let cancelled = false;
    const play = () =>
      AccessibilityInfo.isReduceMotionEnabled()
        .catch(() => false)
        .then((reduce) => {
          if (cancelled) return;
          if (reduce) {
            rise.set(1);
            pocket.set(0);
            return;
          }
          rise.set(
            withDelay(
              250,
              withSpring(1, { duration: 900, dampingRatio: 0.72 }),
            ),
          );
          pocket.set(
            withDelay(
              900,
              withTiming(0, { duration: 420, easing: Easing.in(Easing.cubic) }),
            ),
          );
          setTimeout(
            () =>
              !cancelled &&
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                () => {},
              ),
            700,
          );
        });
    // Wait for the launch splash so the pull-out is actually seen.
    const unsubscribe = afterIntro(play);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [pocket, rise]);

  const toggleFlip = () => {
    const next = !flipped;
    setFlipped(next);
    flip.set(
      withTiming(next ? 1 : 0, {
        duration: 520,
        easing: Easing.inOut(Easing.cubic),
      }),
    );
    Haptics.selectionAsync().catch(() => {});
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(rise.get(), [0, 1], [cardH * 0.36, 0]) },
      { rotate: `${interpolate(rise.get(), [0, 0.7, 1], [-2, 1, 0])}deg` },
    ],
  }));
  const frontStyle = useAnimatedStyle(() => ({
    opacity: flip.get() < 0.5 ? 1 : 0,
    transform: [{ perspective: 1200 }, { rotateY: `${flip.get() * 180}deg` }],
  }));
  const backStyle = useAnimatedStyle(() => ({
    opacity: flip.get() >= 0.5 ? 1 : 0,
    transform: [
      { perspective: 1200 },
      { rotateY: `${flip.get() * 180 - 180}deg` },
    ],
  }));
  const pocketBackStyle = useAnimatedStyle(() => ({ opacity: pocket.get() }));
  const pocketFrontStyle = useAnimatedStyle(() => ({
    opacity: pocket.get(),
    transform: [{ translateY: (1 - pocket.get()) * 70 }],
  }));

  const pocketH = Math.round(cardH * 0.55);

  return (
    // Clips the tucked-in card to the wallet; the padding leaves room for the card's shadow.
    <View
      style={[
        styles.clip,
        { width: cardW + CLIP_PAD * 2, height: cardH + CLIP_PAD + 6 },
      ]}
    >
      <View style={{ width: cardW, height: cardH }}>
        {/* Wallet back panel, peeking above the card while it's tucked in. */}
        <Animated.View
          pointerEvents="none"
          style={[styles.pocketBack, { height: pocketH + 26 }, pocketBackStyle]}
        />

        <Animated.View style={[StyleSheet.absoluteFill, cardStyle]}>
          <Pressable
            onPress={toggleFlip}
            // RN Web renders role=button as <button>, which can't contain the eye button.
            accessibilityRole={Platform.OS === "web" ? undefined : "button"}
            accessibilityLabel={`${label} ${hidden ? "hidden" : amount}. DevPay ${t.kind.toLowerCase()} card ending ${last4}.`}
            accessibilityHint={
              flipped
                ? "Shows the front of the card"
                : "Shows the balance breakdown"
            }
            style={StyleSheet.absoluteFill}
          >
            {/* Front */}
            <Animated.View
              style={[styles.face, { backgroundColor: t.base }, frontStyle]}
            >
              <View
                style={[
                  styles.shape,
                  {
                    backgroundColor: t.shape1,
                    width: cardW * 0.9,
                    height: cardW * 0.9,
                    right: -cardW * 0.42,
                    top: -cardW * 0.38,
                  },
                ]}
              />
              <View
                style={[
                  styles.shape,
                  {
                    backgroundColor: t.shape2,
                    width: cardW * 0.55,
                    height: cardW * 0.55,
                    right: -cardW * 0.22,
                    top: -cardW * 0.2,
                  },
                ]}
              />

              <View style={styles.rowBetween}>
                <View style={styles.brand}>
                  <DevPayMark size={18} />
                  <Text style={styles.brandText}>DevPay</Text>
                </View>
                <Text style={[styles.kind, { color: t.accent }]}>{t.kind}</Text>
              </View>

              <View style={{ marginTop: "auto" }}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>{label}</Text>
                  <Pressable
                    onPress={() => setHidden((h) => !h)}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel={
                      hidden ? "Show balance" : "Hide balance"
                    }
                  >
                    <Ionicons
                      name={hidden ? "eye-off-outline" : "eye-outline"}
                      size={16}
                      color="#D3E6F0"
                    />
                  </Pressable>
                </View>
                <Text
                  style={styles.amount}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  maxFontSizeMultiplier={1.2}
                >
                  {hidden ? "GH₵ ••••••" : amount}
                </Text>
              </View>

              <View style={[styles.rowBetween, { marginTop: 10 }]}>
                <View style={styles.chipRow}>
                  <Chip />
                  <MaterialCommunityIcons
                    name="contactless-payment"
                    size={22}
                    color="#E3F0F7"
                  />
                </View>
                <Text style={styles.number} maxFontSizeMultiplier={1.2}>
                  •••• {last4}
                </Text>
              </View>

              <View style={[styles.rowBetween, { marginTop: 10 }]}>
                <Text
                  style={styles.holder}
                  numberOfLines={1}
                  maxFontSizeMultiplier={1.2}
                >
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
            <Animated.View
              style={[
                styles.face,
                styles.back,
                { backgroundColor: t.base },
                backStyle,
              ]}
            >
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
                    <View
                      key={b.label}
                      style={[styles.bItem, i > 0 && styles.bDivider]}
                    >
                      <Text style={styles.bLabel} numberOfLines={1}>
                        {b.label}
                      </Text>
                      <Text
                        style={styles.bValue}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        maxFontSizeMultiplier={1.2}
                      >
                        {hidden ? "••••" : b.value}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.flipHint}>
                  Virtual card · tap to flip back
                </Text>
              </View>
            </Animated.View>
          </Pressable>
        </Animated.View>

        {/* Wallet front pocket, drawn over the tucked-in card. */}
        <Animated.View
          pointerEvents="none"
          style={[styles.pocketFront, { height: pocketH }, pocketFrontStyle]}
        >
          <View style={styles.stitch} />
          <View style={styles.clasp} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    alignSelf: "center",
    overflow: "hidden",
    paddingHorizontal: CLIP_PAD,
    paddingTop: 6,
    marginTop: -6,
    marginBottom: -CLIP_PAD,
  },
  face: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: Radius.xl,
    padding: 18,
    overflow: "hidden",
    backfaceVisibility: "hidden",
    boxShadow: "0px 10px 22px rgba(10, 25, 34, 0.28)",
  },
  back: { padding: 0 },
  shape: { position: "absolute", borderRadius: 999 },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 6 },
  brandText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  kind: { fontSize: 11, fontWeight: "700", letterSpacing: 1.6 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  label: { color: "#D3E6F0", fontSize: 12, fontWeight: "500" },
  amount: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.8,
    marginTop: 2,
    fontVariant: ["tabular-nums"],
  },
  chipRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  chip: {
    width: 38,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#D9B45A",
    overflow: "hidden",
  },
  chipLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#B8913A",
  },
  chipMid: {
    position: "absolute",
    left: 14,
    top: 0,
    bottom: 0,
    width: 10,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#B8913A",
  },
  number: {
    color: "#E6ECEF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 2,
    fontVariant: ["tabular-nums"],
  },
  holder: {
    color: "#C5CFD5",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.2,
    flexShrink: 1,
  },
  badge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    height: 24,
    borderRadius: 7,
    justifyContent: "center",
  },
  badgeText: { color: "#15181B", fontSize: 11, fontWeight: "700" },
  stripe: { height: 40, backgroundColor: "#05090B", marginTop: 20 },
  backBody: {
    flex: 1,
    padding: 18,
    paddingTop: 14,
    justifyContent: "space-between",
  },
  sigRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  sig: { flex: 1, height: 30, borderRadius: 4, backgroundColor: "#E6ECEF" },
  cvv: {
    width: 52,
    height: 30,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  cvvText: {
    color: "#15181B",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },
  breakdown: { flexDirection: "row" },
  bItem: { flex: 1, paddingRight: 8 },
  bDivider: {
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255,255,255,0.14)",
    paddingLeft: 12,
  },
  bLabel: { color: "#D3E6F0", fontSize: 11 },
  bValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
    fontVariant: ["tabular-nums"],
  },
  flipHint: { color: "#7F8C94", fontSize: 11 },
  pocketBack: {
    position: "absolute",
    left: -6,
    right: -6,
    bottom: -CLIP_PAD,
    borderRadius: 22,
    backgroundColor: POCKET_EDGE,
  },
  pocketFront: {
    position: "absolute",
    left: -6,
    right: -6,
    bottom: -CLIP_PAD,
    borderRadius: 22,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: POCKET,
    boxShadow: "0px -4px 10px rgba(0, 0, 0, 0.25)",
    alignItems: "center",
  },
  stitch: {
    position: "absolute",
    top: 8,
    left: 10,
    right: 10,
    bottom: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#7A5B44",
  },
  clasp: {
    marginTop: 18,
    width: 44,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#C9A267",
  },
});

/** Stable four digits for the virtual card, derived from the account id. */
export function cardDigits(id?: string) {
  let h = 7;
  for (const c of id ?? "devpay") h = (h * 31 + c.charCodeAt(0)) % 10000;
  return String(h).padStart(4, "0");
}
