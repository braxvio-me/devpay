/**
 * Toast notification system for DevPay.
 * Usage:
 *   import { Toast, useToast } from '@/components/toast';
 *   // In component:
 *   const toast = useToast();
 *   toast.show({ title: 'Success!', message: 'Escrow funded.', type: 'success' });
 *   // In render:
 *   <Toast ref={toast.ref} />
 */
import React, { useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastConfig {
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number; // ms — default 3200
}

const ICON: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'close-circle',
  info: 'information-circle',
  warning: 'alert-circle',
};

const COLORS: Record<ToastType, { bg: string; border: string; icon: string; text: string }> = {
  success: { bg: '#F0FDF4', border: '#BBF7D0', icon: '#10B981', text: '#065F46' },
  error:   { bg: '#FEF2F2', border: '#FECACA', icon: '#EF4444', text: '#7F1D1D' },
  info:    { bg: '#EFF6FF', border: '#BFDBFE', icon: '#0F73F7', text: '#1E40AF' },
  warning: { bg: '#FFFBEB', border: '#FDE68A', icon: '#F59E0B', text: '#78350F' },
};

export interface ToastHandle {
  show: (config: ToastConfig) => void;
  hide: () => void;
}

export const Toast = forwardRef<ToastHandle>((_, ref) => {
  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);
  const [config, setConfig] = React.useState<ToastConfig | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    translateY.set(withTiming(-120, { duration: 280, easing: Easing.bezier(0.77, 0, 0.175, 1) }));
    opacity.set(withTiming(0, { duration: 260 }));
  }, []);

  const show = useCallback((newConfig: ToastConfig) => {
    // Clear existing timer
    if (timerRef.current) clearTimeout(timerRef.current);
    setConfig(newConfig);

    // Slide in
    translateY.set(withSpring(0, { duration: 420, dampingRatio: 0.72 }));
    opacity.set(withTiming(1, { duration: 200 }));

    // Auto-dismiss
    timerRef.current = setTimeout(() => {
      hide();
    }, newConfig.duration ?? 3200);
  }, [hide]);

  useImperativeHandle(ref, () => ({ show, hide }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.get() }],
    opacity: opacity.get(),
  }));

  if (!config) return null;

  const type: ToastType = config.type ?? 'info';
  const palette = COLORS[type];

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
        },
        containerStyle,
      ]}
      pointerEvents="none">
      <View style={[styles.iconWrap, { backgroundColor: palette.border }]}>
        <Ionicons name={ICON[type]} size={20} color={palette.icon} />
      </View>
      <View style={styles.textWrap}>
        <Text style={[styles.toastTitle, { color: palette.text }]}>{config.title}</Text>
        {config.message ? (
          <Text style={[styles.toastMsg, { color: palette.text + 'CC' }]}>{config.message}</Text>
        ) : null}
      </View>
    </Animated.View>
  );
});

Toast.displayName = 'Toast';

/**
 * useToast — returns a ref and convenience `show` method.
 * Mount <Toast ref={toast.ref} /> at the top of your screen.
 */
export function useToast() {
  const toastRef = useRef<ToastHandle>(null);

  const show = useCallback((config: ToastConfig) => {
    toastRef.current?.show(config);
  }, []);

  const hide = useCallback(() => {
    toastRef.current?.hide();
  }, []);

  return { ref: toastRef, toastRef, show, hide };
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 14,
    left: 20,
    right: 20,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  toastMsg: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 17,
  },
});
