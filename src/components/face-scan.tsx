/**
 * Identity face scan (KYC): full-screen front camera with a round cut-out, a ring of ticks
 * that fill as the user follows the movement prompts, then a selfie capture.
 * Device unlock uses the system Face ID / fingerprint prompt instead (see AppLockContext).
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Modal, Pressable, AccessibilityInfo, Platform, Linking, useWindowDimensions } from 'react-native';
import { Text } from '@/components/ui-text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import Animated, {
  cancelAnimation,
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { Button } from '@/components/ds';
import { Layout } from '@/constants/theme';

type Phase = 'scanning' | 'success' | 'failed';

const TICKS = 72;
const SKY = '#4DB4E4';
const GREEN = '#2FCB8E';
const CORAL = '#F06A6E';
const IDLE = 'rgba(255,255,255,0.22)';
const SCRIM = 'rgba(6, 13, 17, 0.88)';

const PROMPTS: { text: string; icon: keyof typeof Ionicons.glyphMap; nudge: -1 | 0 | 1 }[] = [
  { text: 'Look straight at the camera', icon: 'scan-outline', nudge: 0 },
  { text: 'Turn your head slightly left', icon: 'arrow-back', nudge: -1 },
  { text: 'Now slightly right', icon: 'arrow-forward', nudge: 1 },
  { text: 'Blink once', icon: 'eye-outline', nudge: 0 },
];
const STEP_MS = 1400;

function Tick({ i, radius, progress, done }: { i: number; radius: number; progress: SharedValue<number>; done: SharedValue<number> }) {
  const at = i / TICKS;
  const style = useAnimatedStyle(() => {
    const lit = progress.get() > at;
    return {
      backgroundColor: lit ? interpolateColor(done.get(), [0, 1], [SKY, GREEN]) : IDLE,
      transform: [{ rotate: `${(i * 360) / TICKS}deg` }, { translateY: -radius }, { scaleY: withTiming(lit ? 1.5 : 1, { duration: 160 }) }],
    };
  });
  return <Animated.View style={[styles.tick, style]} />;
}

export function FaceScanModal({
  visible,
  onSuccess,
  onCancel,
  title = 'Verify it’s you',
}: {
  visible: boolean;
  /** Receives the selfie captured at the end of the scan. */
  onSuccess: (selfieUri?: string) => void;
  onCancel: () => void;
  title?: string;
}) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const size = Math.min(width * 0.74, height * 0.4, 320);
  const radius = size / 2 + 20;
  // A huge border around the cut-out darkens everything outside the circle.
  const scrimBorder = Math.max(width, height);

  const [phase, setPhase] = useState<Phase>('scanning');
  const [prompt, setPrompt] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraDenied, setCameraDenied] = useState(false);
  const [flash, setFlash] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<React.ComponentRef<typeof CameraView>>(null);
  const selfie = useRef<string | undefined>(undefined);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const alive = useRef(false);

  const progress = useSharedValue(0);
  const done = useSharedValue(0);
  const nudge = useSharedValue(0);
  const check = useSharedValue(0);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(() => alive.current && fn(), ms));

  const finish = useCallback(
    (ok: boolean) => {
      cancelAnimation(nudge);
      if (ok) {
        progress.set(withTiming(1.01, { duration: 220 }));
        done.set(withTiming(1, { duration: 260 }));
        check.set(withDelay(120, withSpring(1, { duration: 480, dampingRatio: 0.6 })));
        setPhase('success');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        later(() => onSuccess(selfie.current), 1100);
      } else {
        setPhase('failed');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      }
    },
    [check, done, nudge, onSuccess, progress]
  );

  const run = useCallback(async () => {
    clearTimers();
    setPhase('scanning');
    setPrompt(0);
    progress.set(0);
    done.set(0);
    check.set(0);
    selfie.current = undefined;

    let granted = permission?.granted ?? false;
    if (!granted && permission?.canAskAgain !== false) granted = (await requestPermission().catch(() => null))?.granted ?? false;
    setCameraDenied(!granted);
    if (!granted) return finish(false);

    const reduce = await AccessibilityInfo.isReduceMotionEnabled().catch(() => false);
    const total = STEP_MS * PROMPTS.length;
    progress.set(withTiming(0.97, { duration: total, easing: Easing.inOut(Easing.quad) }));
    PROMPTS.forEach((p, i) =>
      later(() => {
        setPrompt(i);
        Haptics.selectionAsync().catch(() => {});
        cancelAnimation(nudge);
        nudge.set(0);
        if (p.nudge && !reduce) nudge.set(withRepeat(withSequence(withTiming(p.nudge * 8, { duration: 380 }), withTiming(0, { duration: 380 })), -1));
      }, i * STEP_MS)
    );
    later(async () => {
      setFlash(true);
      try {
        const photo = await cameraRef.current?.takePictureAsync({ quality: 0.6 });
        selfie.current = photo?.uri;
      } catch {}
      later(() => setFlash(false), 140);
      finish(true);
    }, total + 200);
  }, [check, clearTimers, done, finish, nudge, permission, progress, requestPermission]);

  useEffect(() => {
    alive.current = visible;
    if (!visible) clearTimers();
    return () => {
      alive.current = false;
      clearTimers();
    };
  }, [clearTimers, visible]);

  const nudgeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: nudge.get() }] }));
  const checkStyle = useAnimatedStyle(() => ({ opacity: check.get(), transform: [{ scale: 0.5 + check.get() * 0.5 }] }));
  const ringStyle = useAnimatedStyle(() => ({ borderColor: interpolateColor(done.get(), [0, 1], ['rgba(255,255,255,0.35)', GREEN]) }));

  const cameraOn = !!permission?.granted && phase !== 'failed';
  const p = PROMPTS[prompt];
  const status =
    phase === 'success' ? 'Face captured' : phase === 'failed' ? (cameraDenied ? 'Camera access needed' : 'We couldn’t see your face') : p.text;
  const hint =
    phase === 'success'
      ? 'Matching it with your Ghana Card'
      : phase === 'failed'
        ? cameraDenied
          ? 'Allow camera access to verify your identity.'
          : 'Move to better light and try again.'
        : 'Keep your whole face inside the circle';

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent onRequestClose={onCancel} onShow={run}>
      <View style={styles.root}>
        {cameraOn && (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing="front"
            mirror
            onCameraReady={() => setCameraReady(true)}
            accessibilityLabel="Front camera preview"
          />
        )}

        {/* Scrim with a round window onto the camera. */}
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.centerAll, { paddingBottom: height * 0.12 }]}>
          <View
            style={{
              width: size + scrimBorder * 2,
              height: size + scrimBorder * 2,
              borderRadius: size / 2 + scrimBorder,
              borderWidth: scrimBorder,
              borderColor: SCRIM,
            }}
          />
        </View>

        <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.centerAll, { paddingBottom: height * 0.12 }]}>
          <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            {Array.from({ length: TICKS }, (_, i) => (
              <Tick key={i} i={i} radius={radius} progress={progress} done={done} />
            ))}
            <Animated.View style={[StyleSheet.absoluteFill, { borderRadius: size / 2, borderWidth: 2 }, ringStyle]} />
            {!(cameraOn && cameraReady) && phase !== 'success' && (
              <Ionicons name="scan-circle" size={size * 0.34} color="rgba(255,255,255,0.5)" />
            )}
            <Animated.View style={[styles.check, checkStyle]}>
              <View style={styles.checkDisc}>
                <Ionicons name="checkmark" size={50} color="#FFFFFF" />
              </View>
            </Animated.View>
          </View>
        </View>

        {flash && <Animated.View exiting={FadeOut.duration(260)} pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#FFFFFF' }]} />}

        <View style={[styles.top, { paddingTop: insets.top + 12 }]}>
          <Pressable onPress={onCancel} hitSlop={10} accessibilityRole="button" accessibilityLabel="Cancel" style={styles.close}>
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.steps} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            {PROMPTS.map((_, i) => (
              <View
                key={i}
                style={[styles.step, { backgroundColor: phase === 'success' ? GREEN : i <= prompt && phase === 'scanning' ? SKY : 'rgba(255,255,255,0.25)' }]}
              />
            ))}
          </View>
        </View>

        <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
          <Animated.View
            key={`${phase}-${prompt}`}
            entering={FadeInDown.duration(220)}
            style={styles.promptRow}
            accessible
            accessibilityLiveRegion="polite"
            accessibilityLabel={`${status}. ${hint}`}>
            <View style={[styles.promptIcon, { backgroundColor: phase === 'success' ? GREEN : phase === 'failed' ? CORAL : '#FFFFFF' }]}>
              {phase === 'scanning' ? (
                <Animated.View style={nudgeStyle}>
                  <Ionicons name={p.icon} size={22} color="#0B1419" />
                </Animated.View>
              ) : (
                <Ionicons name={phase === 'success' ? 'checkmark' : 'alert'} size={22} color="#FFFFFF" />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.status}>{status}</Text>
              <Text style={styles.hint}>{hint}</Text>
            </View>
          </Animated.View>

          {phase === 'failed' ? (
            <Animated.View entering={FadeIn.duration(200)} style={styles.actions}>
              {cameraDenied && Platform.OS !== 'web' ? (
                <Button label="Open Settings" onPress={() => Linking.openSettings()} />
              ) : (
                <Button label="Try again" onPress={run} />
              )}
            </Animated.View>
          ) : (
            <View style={styles.privacy}>
              <Ionicons name="lock-closed" size={12} color="rgba(255,255,255,0.55)" />
              <Text style={styles.privacyText}>Your selfie is only used to match your Ghana Card photo.</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#060D11' },
  centerAll: { alignItems: 'center', justifyContent: 'center' },
  tick: { position: 'absolute', width: 3, height: 12, borderRadius: 1.5 },
  check: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  checkDisc: { width: 96, height: 96, borderRadius: 48, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center' },
  top: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Layout.margin },
  close: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1C2A31', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  steps: { width: 40, flexDirection: 'row', gap: 3, justifyContent: 'flex-end' },
  step: { width: 7, height: 4, borderRadius: 2 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: Layout.margin, gap: 16 },
  promptRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 20, backgroundColor: '#13212A', borderWidth: 1, borderColor: '#22343F' },
  promptIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  status: { color: '#FFFFFF', fontSize: 17, fontWeight: '600', letterSpacing: -0.2 },
  hint: { color: '#A9B4BB', fontSize: 13, marginTop: 2 },
  actions: { gap: 6 },
  privacy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 52 },
  privacyText: { color: 'rgba(255,255,255,0.55)', fontSize: 12 },
});
