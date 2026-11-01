import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, SlideInDown, ZoomIn, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { Text } from '@/components/ui-text';
import { Button, Field } from '@/components/ds';
import { useTheme } from '@/contexts/ThemeContext';
import { PIN_LENGTH, useWalletLock } from '@/contexts/WalletLockContext';
import { Layout, Radius } from '@/constants/theme';

/** unlock: open the wallet · change: replace the PIN · create: set the first PIN */
export type PinMode = 'unlock' | 'change' | 'create';
type Step = 'enter' | 'old' | 'new' | 'confirm' | 'password';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

const COPY: Record<Step, { title: string; sub: string }> = {
  enter: { title: 'Enter wallet PIN', sub: 'Your PIN keeps your balance and card details private.' },
  old: { title: 'Current PIN', sub: 'Enter the PIN you use now.' },
  new: { title: 'Create a wallet PIN', sub: `Choose ${PIN_LENGTH} digits only you know. Avoid 1234 or your birth year.` },
  confirm: { title: 'Confirm your PIN', sub: 'Enter the same PIN again.' },
  password: { title: 'Forgot your PIN?', sub: 'Confirm your DevPay password, then set a new PIN.' },
};

const WEAK = new Set(['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '1234', '4321', '1212', '0123']);

export function PinSheet({ visible, mode = 'unlock', onClose, onDone }: { visible: boolean; mode?: PinMode; onClose: () => void; onDone?: () => void }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { hasPin, unlock, checkPin, createPin, resetWithPassword } = useWalletLock();
  const [step, setStep] = useState<Step>('enter');
  const [pin, setPin] = useState('');
  const [first, setFirst] = useState('');
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState('');
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() }] }));

  // Pick the first step each time the sheet opens.
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      setStep(mode === 'create' || hasPin === false ? 'new' : mode === 'change' ? 'old' : 'enter');
      setPin('');
      setFirst('');
      setError(undefined);
      setPassword('');
    }, 0);
    return () => clearTimeout(t);
  }, [hasPin, mode, visible]);

  const fail = (msg: string) => {
    setError(msg);
    setPin('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    shake.set(withSequence(withTiming(-12, { duration: 50 }), withTiming(12, { duration: 50 }), withTiming(-8, { duration: 50 }), withTiming(0, { duration: 50 })));
  };

  const finish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onDone?.();
    onClose();
  };

  const submit = async (value: string) => {
    setBusy(true);
    try {
      if (step === 'enter') {
        const err = await unlock(value);
        return err ? fail(err) : finish();
      }
      if (step === 'old') {
        const err = await checkPin(value);
        if (err) return fail(err);
        setPin('');
        return setStep('new');
      }
      if (step === 'new') {
        if (WEAK.has(value)) return fail('That PIN is too easy to guess. Try another.');
        setFirst(value);
        setPin('');
        return setStep('confirm');
      }
      if (step === 'confirm') {
        if (value !== first) {
          setStep('new');
          setFirst('');
          return fail('PINs didn’t match. Start again.');
        }
        await createPin(value);
        return finish();
      }
    } finally {
      setBusy(false);
    }
  };

  const press = (k: string) => {
    if (busy || !k) return;
    Haptics.selectionAsync().catch(() => {});
    setError(undefined);
    if (k === 'del') return setPin((p) => p.slice(0, -1));
    const next = (pin + k).slice(0, PIN_LENGTH);
    setPin(next);
    if (next.length === PIN_LENGTH) setTimeout(() => submit(next), 120);
  };

  const confirmPassword = async () => {
    if (!password) return setError('Enter your password.');
    setBusy(true);
    const err = await resetWithPassword(password);
    setBusy(false);
    if (err) return setError(err);
    setPassword('');
    setError(undefined);
    setStep('new');
  };

  const copy = COPY[step];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" accessibilityRole="button" />
      <Animated.View entering={SlideInDown.duration(300)} style={[styles.sheet, { backgroundColor: colors.surface, paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <View style={[styles.handle, { backgroundColor: colors.backgroundSelected }]} />
        <Animated.View key={step} entering={FadeIn.duration(200)} style={styles.head}>
          <View style={[styles.icon, { backgroundColor: colors.action }]}>
            <Ionicons name={step === 'password' ? 'key' : 'lock-closed'} size={20} color="#FFFFFF" />
          </View>
          <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
            {copy.title}
          </Text>
          <Text style={[styles.sub, { color: colors.textSecondary }]}>{copy.sub}</Text>
        </Animated.View>

        {step === 'password' ? (
          <View style={{ gap: 14, marginTop: 8 }}>
            <Field icon="lock-closed-outline" placeholder="Your DevPay password" secureTextEntry autoFocus value={password} onChangeText={setPassword} onSubmitEditing={confirmPassword} error={error} />
            <Button label="Continue" loading={busy} onPress={confirmPassword} />
            <Button label="Back" variant="ghost" onPress={() => setStep('enter')} />
          </View>
        ) : (
          <>
            <Animated.View style={[styles.dots, shakeStyle]} accessible accessibilityLabel={`${pin.length} of ${PIN_LENGTH} digits entered`}>
              {Array.from({ length: PIN_LENGTH }, (_, i) => {
                const filled = i < pin.length;
                return (
                  <View key={i} style={[styles.dot, { borderColor: error ? colors.accentCoral : filled ? colors.action : colors.backgroundSelected }]}>
                    {filled && <Animated.View entering={ZoomIn.duration(140)} style={[styles.dotFill, { backgroundColor: error ? colors.accentCoral : colors.action }]} />}
                  </View>
                );
              })}
            </Animated.View>
            <Text style={[styles.error, { color: colors.accentCoral }]} accessibilityLiveRegion="polite">
              {error ?? ' '}
            </Text>

            <View style={styles.pad}>
              {KEYS.map((k, i) =>
                k ? (
                  <Pressable
                    key={i}
                    onPress={() => press(k)}
                    accessibilityRole="button"
                    accessibilityLabel={k === 'del' ? 'Delete' : k}
                    style={({ pressed }) => [styles.key, { backgroundColor: pressed ? colors.backgroundSelected : colors.backgroundElement }]}>
                    {k === 'del' ? <Ionicons name="backspace-outline" size={24} color={colors.text} /> : <Text style={[styles.keyText, { color: colors.text }]}>{k}</Text>}
                  </Pressable>
                ) : (
                  <View key={i} style={styles.key} />
                )
              )}
            </View>

            {step === 'enter' && (
              <Pressable onPress={() => setStep('password')} hitSlop={10} accessibilityRole="button" style={styles.forgot}>
                <Text style={[styles.forgotText, { color: colors.action }]}>Forgot PIN?</Text>
              </Pressable>
            )}
          </>
        )}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(8, 16, 21, 0.55)' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopLeftRadius: Radius.xxl, borderTopRightRadius: Radius.xxl, paddingHorizontal: Layout.margin, paddingTop: 10, maxWidth: 560, alignSelf: 'center', width: '100%' },
  handle: { width: 40, height: 5, borderRadius: 3, alignSelf: 'center', marginBottom: 14 },
  head: { alignItems: 'center' },
  icon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700', letterSpacing: -0.4, marginTop: 14 },
  sub: { fontSize: 13, lineHeight: 19, marginTop: 6, textAlign: 'center', paddingHorizontal: 12 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 18, marginTop: 26 },
  dot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  dotFill: { width: 10, height: 10, borderRadius: 5 },
  error: { fontSize: 13, textAlign: 'center', marginTop: 12, minHeight: 18 },
  pad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10, marginTop: 10 },
  key: { width: '31.5%', height: 58, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },
  keyText: { fontSize: 24, fontWeight: '600' },
  forgot: { alignSelf: 'center', marginTop: 14, padding: 4 },
  forgotText: { fontSize: 14, fontWeight: '600' },
});
