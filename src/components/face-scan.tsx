import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, AccessibilityInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  withDelay,
  type SharedValue,
} from 'react-native-reanimated';
import { Button } from '@/components/ds';
import { Layout } from '@/constants/theme';

type Phase = 'scanning' | 'success' | 'failed';

const SIZE = 248;
const SKY = '#4DB4E4';
const GREEN = '#3CC796';
const CORAL = '#F06A6E';

/** Face-mesh dots inside the circle (precomputed once). */
const DOTS = (() => {
  const out: { x: number; y: number; d: number }[] = [];
  const step = 22;
  for (let y = step; y < SIZE; y += step)
    for (let x = step; x < SIZE; x += step) {
      const dx = x - SIZE / 2;
      const dy = (y - SIZE / 2) * 0.9;
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r < SIZE * 0.36) out.push({ x, y, d: r / (SIZE * 0.36) });
    }
  return out;
})();

function MeshDot({ x, y, d, progress }: { x: number; y: number; d: number; progress: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const on = progress.get() > d * 0.85 ? 1 : 0.15;
    return { opacity: withTiming(on, { duration: 180 }), transform: [{ scale: withTiming(on === 1 ? 1 : 0.6, { duration: 180 }) }] };
  });
  return <Animated.View style={[styles.dot, { left: x - 2, top: y - 2 }, style]} />;
}

function Corner({ pos, color }: { pos: 'tl' | 'tr' | 'bl' | 'br'; color: string }) {
  const s = 34;
  const w = 4;
  const base = { position: 'absolute' as const, width: s, height: s, borderColor: color };
  const map = {
    tl: { top: 0, left: 0, borderTopWidth: w, borderLeftWidth: w, borderTopLeftRadius: 18 },
    tr: { top: 0, right: 0, borderTopWidth: w, borderRightWidth: w, borderTopRightRadius: 18 },
    bl: { bottom: 0, left: 0, borderBottomWidth: w, borderLeftWidth: w, borderBottomLeftRadius: 18 },
    br: { bottom: 0, right: 0, borderBottomWidth: w, borderRightWidth: w, borderBottomRightRadius: 18 },
  };
  return <View style={[base, map[pos]]} />;
}

export function FaceScanModal({
  visible,
  onSuccess,
  onCancel,
  onUsePassword,
  title = 'Sign in with Face ID',
}: {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  onUsePassword?: () => void;
  title?: string;
}) {
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<Phase>('scanning');
  const [demo, setDemo] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const alive = useRef(true);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const cameraOn = !!permission?.granted && phase !== 'success';

  const spin = useSharedValue(0);
  const sweep = useSharedValue(0);
  const progress = useSharedValue(0);
  const pulse = useSharedValue(1);
  const check = useSharedValue(0);

  const startLoops = useCallback(
    (reduce: boolean) => {
      progress.set(0);
      check.set(0);
      if (reduce) return;
      spin.set(0);
      spin.set(withRepeat(withTiming(360, { duration: 2200, easing: Easing.linear }), -1));
      sweep.set(0);
      sweep.set(withRepeat(withSequence(withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.quad) }), withTiming(0, { duration: 1100, easing: Easing.inOut(Easing.quad) })), -1));
      pulse.set(withRepeat(withSequence(withTiming(1.05, { duration: 700 }), withTiming(1, { duration: 700 })), -1));
    },
    [check, progress, pulse, spin, sweep]
  );

  const stopLoops = useCallback(() => {
    cancelAnimation(spin);
    cancelAnimation(sweep);
    cancelAnimation(pulse);
    pulse.set(withTiming(1, { duration: 200 }));
  }, [pulse, spin, sweep]);

  const finish = useCallback(
    (ok: boolean) => {
      if (!alive.current) return;
      stopLoops();
      if (ok) {
        progress.set(withTiming(1, { duration: 250 }));
        check.set(withDelay(150, withSpring(1, { duration: 450, dampingRatio: 0.6 })));
        setPhase('success');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        setTimeout(() => alive.current && onSuccess(), 950);
      } else {
        setPhase('failed');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      }
    },
    [check, onSuccess, progress, stopLoops]
  );

  const run = useCallback(async () => {
    setPhase('scanning');
    let granted = permission?.granted ?? false;
    if (!granted && permission?.canAskAgain !== false) {
      granted = (await requestPermission().catch(() => null))?.granted ?? false;
    }
    const reduce = await AccessibilityInfo.isReduceMotionEnabled().catch(() => false);
    setReduceMotion(reduce);
    startLoops(reduce);
    progress.set(withTiming(0.92, { duration: 2200, easing: Easing.out(Easing.quad) }));

    let hasBio = false;
    try {
      hasBio = (await LocalAuthentication.hasHardwareAsync()) && (await LocalAuthentication.isEnrolledAsync());
    } catch {}
    setDemo(!hasBio);

    if (!hasBio) {
      // No enrolled biometrics (simulator / web): run the scan as a demo.
      setTimeout(() => finish(true), 2400);
      return;
    }
    setTimeout(async () => {
      try {
        const r = await LocalAuthentication.authenticateAsync({ promptMessage: 'Sign in to DevPay', fallbackLabel: 'Use password' });
        finish(r.success);
      } catch {
        finish(false);
      }
    }, 900);
  }, [finish, permission, progress, requestPermission, startLoops]);

  useEffect(() => {
    alive.current = visible;
    if (!visible) stopLoops();
    return () => {
      alive.current = false;
    };
  }, [visible, stopLoops]);

  const color = phase === 'success' ? GREEN : phase === 'failed' ? CORAL : SKY;

  const ringStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.get()}deg` }] }));
  const sweepStyle = useAnimatedStyle(() => ({ transform: [{ translateY: sweep.get() * (SIZE - 60) }], opacity: phase === 'scanning' ? 1 : 0 }));
  const frameStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.get() }] }));
  const checkStyle = useAnimatedStyle(() => ({ opacity: check.get(), transform: [{ scale: 0.6 + check.get() * 0.4 }] }));
  const barStyle = useAnimatedStyle(() => ({ width: `${Math.round(progress.get() * 100)}%` }));

  const status =
    phase === 'success' ? 'Face recognised' : phase === 'failed' ? 'We couldn’t match your face' : 'Hold still, scanning…';
  const hint =
    phase === 'success' ? 'Signing you in' : phase === 'failed' ? 'Move to better light and try again.' : 'Keep your face inside the frame';

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent onRequestClose={onCancel} onShow={run}>
      <LinearGradient colors={['#0B1A22', '#0C1317']} style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <View style={styles.top}>
          <Pressable onPress={onCancel} hitSlop={10} accessibilityRole="button" accessibilityLabel="Cancel" style={styles.close}>
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.title}>{title}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.center} accessible accessibilityLiveRegion="polite" accessibilityLabel={`${status}. ${hint}`}>
          <Animated.View style={[styles.frame, frameStyle]}>
            <View style={[styles.glow, { backgroundColor: color }]} />
            {!reduceMotion && phase === 'scanning' && (
              <Animated.View style={[styles.ring, ringStyle]}>
                <LinearGradient colors={['rgba(77,180,228,0)', SKY]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ringArc} />
              </Animated.View>
            )}
            <View style={[styles.circle, { borderColor: `${color}66` }]}>
              {cameraOn && (
                <CameraView
                  style={StyleSheet.absoluteFill}
                  facing="front"
                  mirror
                  onCameraReady={() => setCameraReady(true)}
                  accessibilityLabel="Front camera preview"
                />
              )}
              {cameraOn && <View style={[StyleSheet.absoluteFill, styles.tint]} />}
              {DOTS.map((p, i) => (
                <MeshDot key={i} x={p.x} y={p.y} d={p.d} progress={progress} />
              ))}
              {!(cameraOn && cameraReady) && (
                <MaterialCommunityIcons name="face-recognition" size={92} color={`${color}`} style={{ opacity: phase === 'success' ? 0 : 0.9 }} />
              )}
              <Animated.View style={[styles.sweep, sweepStyle]}>
                <LinearGradient colors={['rgba(77,180,228,0)', 'rgba(77,180,228,0.55)', 'rgba(77,180,228,0)']} style={StyleSheet.absoluteFill} />
                <View style={styles.sweepLine} />
              </Animated.View>
              <Animated.View style={[styles.check, checkStyle]}>
                <View style={[styles.checkDisc, { backgroundColor: GREEN }]}>
                  <Ionicons name="checkmark" size={54} color="#FFFFFF" />
                </View>
              </Animated.View>
            </View>
            <Corner pos="tl" color={color} />
            <Corner pos="tr" color={color} />
            <Corner pos="bl" color={color} />
            <Corner pos="br" color={color} />
          </Animated.View>

          <Text style={[styles.status, { color: phase === 'failed' ? CORAL : '#FFFFFF' }]}>{status}</Text>
          <Text style={styles.hint}>{hint}</Text>

          <View style={styles.bar}>
            <Animated.View style={[styles.barFill, { backgroundColor: color }, barStyle]} />
          </View>
          {permission && !permission.granted && phase === 'scanning' && (
            <Text style={styles.demo}>Camera is off. Allow camera access in Settings to see your face here.</Text>
          )}
          {demo && phase !== 'failed' && <Text style={styles.demo}>Demo scan · no Face ID set up on this device</Text>}
        </View>

        <View style={styles.actions}>
          {phase === 'failed' ? (
            <>
              <Button label="Try again" onPress={run} />
              {onUsePassword && <Button label="Use password instead" variant="ghost" fg="#FFFFFF" onPress={onUsePassword} />}
            </>
          ) : (
            onUsePassword && <Button label="Use password instead" variant="ghost" fg="rgba(255,255,255,0.8)" onPress={onUsePassword} disabled={phase === 'success'} />
          )}
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: Layout.margin },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  close: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  frame: { width: SIZE + 44, height: SIZE + 44, alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute', width: SIZE, height: SIZE, borderRadius: SIZE / 2, opacity: 0.12 },
  ring: { position: 'absolute', width: SIZE + 20, height: SIZE + 20, borderRadius: (SIZE + 20) / 2, overflow: 'hidden' },
  ringArc: { position: 'absolute', top: 0, right: 0, width: (SIZE + 20) / 2, height: (SIZE + 20) / 2, borderTopRightRadius: (SIZE + 20) / 2 },
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 2,
    backgroundColor: '#0E1E27',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tint: { backgroundColor: 'rgba(11, 26, 34, 0.28)' },
  dot: { position: 'absolute', width: 4, height: 4, borderRadius: 2, backgroundColor: SKY },
  sweep: { position: 'absolute', left: 0, right: 0, top: 0, height: 60, justifyContent: 'center' },
  sweepLine: { height: 2, backgroundColor: SKY, marginHorizontal: 24, borderRadius: 1 },
  check: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  checkDisc: { width: 104, height: 104, borderRadius: 52, alignItems: 'center', justifyContent: 'center' },
  status: { fontSize: 20, fontWeight: '600', marginTop: 32, letterSpacing: -0.3 },
  hint: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 6 },
  bar: { width: 180, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.12)', marginTop: 22, overflow: 'hidden' },
  barFill: { height: 4, borderRadius: 2 },
  demo: { color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 14 },
  actions: { gap: 6, minHeight: 56 },
});
