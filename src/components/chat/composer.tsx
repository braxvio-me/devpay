import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Linking, Platform } from 'react-native';
import { Dialog } from '@/lib/dialog';
import { Text, TextInput } from '@/components/ui-text';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { Layout } from '@/constants/theme';

const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

function LevelBar({ i }: { i: number }) {
  const h = useSharedValue(6);
  useEffect(() => {
    const peak = 10 + ((i * 37) % 18);
    h.set(withRepeat(withSequence(withTiming(peak, { duration: 260 + (i % 4) * 70 }), withTiming(6, { duration: 260 + (i % 3) * 60 })), -1));
  }, [h, i]);
  const style = useAnimatedStyle(() => ({ height: h.get() }));
  return <Animated.View style={[styles.level, style]} />;
}

function RecDot() {
  const o = useSharedValue(1);
  useEffect(() => {
    o.set(withRepeat(withSequence(withTiming(0.25, { duration: 600 }), withTiming(1, { duration: 600 })), -1));
  }, [o]);
  const style = useAnimatedStyle(() => ({ opacity: o.get() }));
  return <Animated.View style={[styles.recDot, style]} />;
}

/** Plays sound through the speaker even with the silent switch on, and outside recording mode. */
export const playbackMode = () => setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true }).catch(() => {});

const WAVE = Array.from({ length: 26 }, (_, i) => 6 + ((i * 53) % 17));

/** Listen back to a recording before sending it. */
function ReviewBar({ uri, durationMs, onDiscard }: { uri: string; durationMs: number; onDiscard: () => void }) {
  const { colors } = useTheme();
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);
  const total = status.duration || durationMs / 1000;
  const progress = total > 0 ? Math.min(1, status.currentTime / total) : 0;

  useEffect(() => {
    if (status.didJustFinish) player.seekTo(0).catch(() => {});
  }, [player, status.didJustFinish]);

  const toggle = async () => {
    if (status.playing) return player.pause();
    await playbackMode();
    player.play();
  };

  return (
    <Animated.View entering={FadeIn.duration(160)} style={[styles.recBar, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
      <Pressable onPress={onDiscard} hitSlop={10} accessibilityRole="button" accessibilityLabel="Discard voice note">
        <Ionicons name="trash-outline" size={22} color={colors.accentCoral} />
      </Pressable>
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel={status.playing ? 'Pause' : 'Play your voice note'}
        style={[styles.reviewPlay, { backgroundColor: colors.action }]}>
        <Ionicons name={status.playing ? 'pause' : 'play'} size={16} color="#FFFFFF" style={!status.playing && { marginLeft: 2 }} />
      </Pressable>
      <View style={styles.levels}>
        {WAVE.map((h, i) => (
          <View key={i} style={[styles.level, { height: h, backgroundColor: i / WAVE.length <= progress ? colors.action : colors.backgroundSelected }]} />
        ))}
      </View>
      <Text style={[styles.recTime, { color: colors.text }]}>{fmt((status.playing || status.currentTime > 0 ? status.currentTime : total) * 1000)}</Text>
    </Animated.View>
  );
}

export function Composer({
  bottomInset,
  onSendText,
  onSendVoice,
  onAttach,
  onCamera,
  onTyping,
}: {
  bottomInset: number;
  onSendText: (text: string) => void;
  onSendVoice: (uri: string, durationMs: number) => void;
  onAttach: () => void;
  onCamera: () => void;
  onTyping?: (typing: boolean) => void;
}) {
  const { colors, isDark } = useTheme();
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);
  const [draft, setDraft] = useState<{ uri: string; durationMs: number } | null>(null);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recState = useAudioRecorderState(recorder, 200);
  const hasText = text.trim().length > 0;

  const morph = useSharedValue(0);
  useEffect(() => {
    morph.set(withSpring(hasText ? 1 : 0, { duration: 260, dampingRatio: 0.8 }));
  }, [hasText, morph]);
  const micStyle = useAnimatedStyle(() => ({ opacity: 1 - morph.get(), transform: [{ scale: 1 - morph.get() * 0.4 }, { rotate: `${morph.get() * -45}deg` }] }));
  const sendStyle = useAnimatedStyle(() => ({ opacity: morph.get(), transform: [{ scale: 0.6 + morph.get() * 0.4 }, { rotate: `${(1 - morph.get()) * 45}deg` }] }));

  const startRecording = async () => {
    try {
      const perm = await AudioModule.requestRecordingPermissionsAsync();
      if (!perm.granted) {
        Dialog.alert('Microphone access needed', 'Allow microphone access to record voice notes.', [
          { text: 'Not now', style: 'cancel' },
          ...(Platform.OS !== 'web' ? [{ text: 'Open Settings', onPress: () => Linking.openSettings() }] : []),
        ]);
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      setRecording(true);
    } catch {
      Dialog.alert('Couldn’t start recording', 'Something went wrong with the microphone. Try again.');
    }
  };

  /** Stop recording. `keep` moves to the listen-back step; otherwise the recording is discarded. */
  const stopRecording = async (keep: boolean) => {
    const duration = recState.durationMillis;
    try {
      await recorder.stop();
    } catch {}
    await playbackMode();
    setRecording(false);
    if (!keep) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      return;
    }
    if (!recorder.uri || duration < 600) {
      Dialog.alert('Too short', 'Hold on a little longer to record a voice note.');
      return;
    }
    Haptics.selectionAsync().catch(() => {});
    setDraft({ uri: recorder.uri, durationMs: duration });
  };

  const sendDraft = () => {
    if (!draft) return;
    Haptics.selectionAsync().catch(() => {});
    onSendVoice(draft.uri, draft.durationMs);
    setDraft(null);
  };

  const sendText = () => {
    if (!hasText) return;
    onSendText(text.trim());
    setText('');
    onTyping?.(false);
  };

  const inputBg = isDark ? colors.surface : '#FFFFFF';

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(bottomInset, 10) }]}>
      {draft ? (
        <ReviewBar uri={draft.uri} durationMs={draft.durationMs} onDiscard={() => setDraft(null)} />
      ) : recording ? (
        <Animated.View entering={FadeIn.duration(160)} exiting={FadeOut.duration(120)} style={[styles.recBar, { backgroundColor: inputBg }]}>
          <Pressable onPress={() => stopRecording(false)} hitSlop={10} accessibilityRole="button" accessibilityLabel="Delete recording">
            <Ionicons name="trash-outline" size={22} color={colors.accentCoral} />
          </Pressable>
          <RecDot />
          <Text style={[styles.recTime, { color: colors.text }]}>{fmt(recState.durationMillis)}</Text>
          <View style={styles.levels}>
            {Array.from({ length: 14 }).map((_, i) => (
              <LevelBar key={i} i={i} />
            ))}
          </View>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeIn.duration(160)} style={[styles.inputRow, { backgroundColor: inputBg }]}>
          <Pressable onPress={onAttach} hitSlop={8} accessibilityRole="button" accessibilityLabel="Attach" style={styles.inlineBtn}>
            <Ionicons name="add-circle-outline" size={25} color={colors.textSecondary} />
          </Pressable>
          <TextInput
            value={text}
            onChangeText={(t) => {
              setText(t);
              onTyping?.(t.length > 0);
            }}
            placeholder="Message"
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.primary}
            multiline
            style={[styles.input, { color: colors.text }]}
            accessibilityLabel="Message"
          />
          {!hasText && (
            <Pressable onPress={onCamera} hitSlop={8} accessibilityRole="button" accessibilityLabel="Take a photo" style={styles.inlineBtn}>
              <Ionicons name="camera-outline" size={24} color={colors.textSecondary} />
            </Pressable>
          )}
        </Animated.View>
      )}

      <Pressable
        onPress={draft ? sendDraft : recording ? () => stopRecording(true) : hasText ? sendText : startRecording}
        accessibilityRole="button"
        accessibilityLabel={draft ? 'Send voice note' : recording ? 'Stop recording' : hasText ? 'Send' : 'Record voice note'}>
        <View style={[styles.action, { backgroundColor: draft ? colors.accentGreen : recording ? colors.accentCoral : colors.action }]}>
          {draft ? (
            <Ionicons name="send" size={19} color="#FFFFFF" style={{ marginLeft: 2 }} />
          ) : recording ? (
            <View style={styles.stopSquare} />
          ) : (
            <>
              <Animated.View style={[styles.layer, micStyle]}>
                <Ionicons name="mic" size={22} color="#FFFFFF" />
              </Animated.View>
              <Animated.View style={[styles.layer, sendStyle]}>
                <Ionicons name="send" size={19} color="#FFFFFF" style={{ marginLeft: 2 }} />
              </Animated.View>
            </>
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: Layout.margin - 10, paddingTop: 6 },
  inputRow: {
    flex: 1,
    minHeight: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 6,
  },
  inlineBtn: { width: 40, height: 48, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, fontSize: 16, maxHeight: 120, paddingTop: 13, paddingBottom: 13, ...(Platform.OS === 'web' ? { outlineWidth: 0 } : null) },
  recBar: { flex: 1, height: 48, borderRadius: 24, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 },
  recDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E5484D' },
  recTime: { fontSize: 15, fontWeight: '500', fontVariant: ['tabular-nums'], minWidth: 40 },
  levels: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 3, height: 30 },
  level: { width: 3, borderRadius: 2, backgroundColor: '#3AA6DB' },
  action: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  layer: { position: 'absolute' },
  stopSquare: { width: 16, height: 16, borderRadius: 4, backgroundColor: '#FFFFFF' },
  reviewPlay: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
