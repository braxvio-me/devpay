import React, { ReactNode, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { Radius } from '@/constants/theme';

export type MessageKind = 'text' | 'image' | 'voice' | 'file' | 'event';

export interface ChatMessage {
  id: string;
  sender: 'me' | 'them' | 'system';
  kind: MessageKind;
  text?: string;
  time: string;
  /** image / voice local URI */
  uri?: string;
  width?: number;
  height?: number;
  durationMs?: number;
  fileName?: string;
  status?: 'sent' | 'delivered' | 'read';
  /** animate in (new messages only) */
  fresh?: boolean;
}

/** Bubble colours: outgoing tinted sky, incoming white, like WhatsApp. */
function useBubbleColors() {
  const { colors, isDark } = useTheme();
  return {
    mine: isDark ? '#1D4A5E' : '#D3EEFB',
    theirs: isDark ? '#17242B' : '#FFFFFF',
    mineText: colors.text,
    meta: isDark ? 'rgba(238,243,246,0.6)' : '#6B8593',
    tick: isDark ? '#7CCDF2' : '#2C88B4',
  };
}

function Tail({ mine, color }: { mine: boolean; color: string }) {
  return (
    <View
      style={[
        styles.tail,
        mine
          ? { right: -6, borderLeftColor: color, borderLeftWidth: 12, borderRightWidth: 0 }
          : { left: -6, borderRightColor: color, borderRightWidth: 12, borderLeftWidth: 0 },
      ]}
    />
  );
}

function Meta({ msg, light }: { msg: ChatMessage; light?: boolean }) {
  const c = useBubbleColors();
  const fg = light ? 'rgba(255,255,255,0.92)' : c.meta;
  return (
    <View style={styles.meta}>
      <Text style={[styles.time, { color: fg }]}>{msg.time}</Text>
      {msg.sender === 'me' && (
        <Ionicons
          name={msg.status === 'sent' ? 'checkmark' : 'checkmark-done'}
          size={15}
          color={msg.status === 'read' ? (light ? '#FFFFFF' : c.tick) : fg}
        />
      )}
    </View>
  );
}

/** Shared frame: alignment, colour, tail, spacing within a group. */
export function BubbleFrame({
  msg,
  tail,
  children,
  padded = true,
  onLongPress,
}: {
  msg: ChatMessage;
  tail: boolean;
  children: ReactNode;
  padded?: boolean;
  onLongPress?: () => void;
}) {
  const c = useBubbleColors();
  const { isDark } = useTheme();
  const mine = msg.sender === 'me';
  const bg = mine ? c.mine : c.theirs;
  return (
    <Pressable
      onLongPress={onLongPress}
      delayLongPress={300}
      style={[
        styles.bubble,
        padded && styles.padded,
        mine ? styles.mine : styles.theirs,
        { backgroundColor: bg },
        tail && (mine ? { borderBottomRightRadius: 4 } : { borderBottomLeftRadius: 4 }),
        !isDark && styles.shadow,
      ]}>
      {tail && <Tail mine={mine} color={bg} />}
      {children}
    </Pressable>
  );
}

export function TextBubble({ msg, tail, onLongPress }: { msg: ChatMessage; tail: boolean; onLongPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <BubbleFrame msg={msg} tail={tail} onLongPress={onLongPress}>
      <Text style={[styles.text, { color: colors.text }]}>
        {msg.text}
        {/* invisible run that reserves room for the floating time/ticks on the last line */}
        <Text style={styles.spacer}>{'\u00A0'.repeat(msg.sender === 'me' ? 22 : 14)}</Text>
      </Text>
      <View style={styles.metaFloat}>
        <Meta msg={msg} />
      </View>
    </BubbleFrame>
  );
}

export function ImageBubble({
  msg,
  tail,
  onOpen,
}: {
  msg: ChatMessage;
  tail: boolean;
  onOpen: (uri: string) => void;
}) {
  const w = 232;
  const ratio = msg.width && msg.height ? msg.height / msg.width : 0.75;
  const h = Math.min(320, Math.max(140, w * ratio));
  return (
    <BubbleFrame msg={msg} tail={tail} padded={false}>
      <Pressable onPress={() => msg.uri && onOpen(msg.uri)} accessibilityRole="imagebutton" accessibilityLabel="Open photo" style={{ padding: 4 }}>
        <Image source={{ uri: msg.uri }} contentFit="cover" transition={200} style={{ width: w, height: h, borderRadius: Radius.md - 2 }} />
        {msg.text ? (
          <Text style={styles.caption}>{msg.text}</Text>
        ) : (
          <View style={styles.imageMeta}>
            <Meta msg={msg} light />
          </View>
        )}
      </Pressable>
      {msg.text ? (
        <View style={[styles.metaFloat, { right: 10, bottom: 6 }]}>
          <Meta msg={msg} />
        </View>
      ) : null}
    </BubbleFrame>
  );
}

/** Deterministic pseudo-waveform per message id. */
function waveform(id: string) {
  const out: number[] = [];
  let seed = id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  for (let i = 0; i < 28; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    out.push(6 + (seed / 233280) * 20);
  }
  return out;
}

const fmt = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;

export function VoiceBubble({ msg, tail }: { msg: ChatMessage; tail: boolean }) {
  const { colors } = useTheme();
  const c = useBubbleColors();
  const player = useAudioPlayer(msg.uri ?? null);
  const status = useAudioPlayerStatus(player);
  const total = status.duration || (msg.durationMs ?? 0) / 1000;
  const progress = total > 0 ? Math.min(1, status.currentTime / total) : 0;

  useEffect(() => {
    if (status.didJustFinish) player.seekTo(0).catch(() => {});
  }, [player, status.didJustFinish]);

  const bars = useMemo(() => waveform(msg.id), [msg.id]);

  const mine = msg.sender === 'me';
  const active = mine ? c.tick : colors.primary;

  return (
    <BubbleFrame msg={msg} tail={tail}>
      <View style={styles.voice}>
        <Pressable
          onPress={() => (status.playing ? player.pause() : player.play())}
          disabled={!msg.uri}
          accessibilityRole="button"
          accessibilityLabel={status.playing ? 'Pause voice note' : 'Play voice note'}
          style={[styles.play, { backgroundColor: active }]}>
          <Ionicons name={status.playing ? 'pause' : 'play'} size={18} color="#FFFFFF" style={!status.playing && { marginLeft: 2 }} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <View style={styles.wave}>
            {bars.map((hgt, i) => (
              <View
                key={i}
                style={[styles.bar, { height: hgt, backgroundColor: i / bars.length <= progress ? active : `${c.meta}66` }]}
              />
            ))}
          </View>
          <View style={styles.voiceFoot}>
            <Text style={[styles.time, { color: c.meta }]}>{fmt(status.playing || status.currentTime > 0 ? status.currentTime : total)}</Text>
            <Meta msg={msg} />
          </View>
        </View>
      </View>
    </BubbleFrame>
  );
}

export function FileBubble({ msg, tail }: { msg: ChatMessage; tail: boolean }) {
  const { colors } = useTheme();
  return (
    <BubbleFrame msg={msg} tail={tail}>
      <View style={styles.file}>
        <View style={[styles.fileIcon, { backgroundColor: colors.primary }]}>
          <Ionicons name="document-attach" size={20} color="#FFFFFF" />
        </View>
        <View style={{ flexShrink: 1 }}>
          <Text style={[styles.fileTitle, { color: colors.text }]}>{msg.text}</Text>
          <Text style={[styles.fileName, { color: colors.textSecondary }]} numberOfLines={1}>
            {msg.fileName}
          </Text>
        </View>
      </View>
      <View style={{ alignSelf: 'flex-end', marginTop: 4 }}>
        <Meta msg={msg} />
      </View>
    </BubbleFrame>
  );
}

export function EventPill({ msg }: { msg: ChatMessage }) {
  const { colors, isDark } = useTheme();
  return (
    <View style={[styles.event, { backgroundColor: isDark ? 'rgba(31,174,122,0.18)' : 'rgba(229,246,239,0.95)' }]}>
      <Ionicons name="lock-closed" size={13} color={colors.accentGreen} />
      <Text style={[styles.eventText, { color: colors.text }]}>{msg.text}</Text>
    </View>
  );
}

export function DayPill({ label }: { label: string }) {
  const { isDark, colors } = useTheme();
  return (
    <View style={[styles.day, { backgroundColor: isDark ? 'rgba(23,36,43,0.85)' : 'rgba(255,255,255,0.85)' }]}>
      <Text style={[styles.dayText, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

function Dot({ delay, color }: { delay: number; color: string }) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.set(withDelay(delay, withRepeat(withSequence(withTiming(-4, { duration: 280 }), withTiming(0, { duration: 280 })), -1)));
  }, [delay, y]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.get() }], opacity: 0.5 + (-y.get() / 4) * 0.5 }));
  return <Animated.View style={[styles.typingDot, { backgroundColor: color }, style]} />;
}

/** Three bouncing dots in an incoming bubble. */
export function TypingBubble() {
  const c = useBubbleColors();
  const { isDark, colors } = useTheme();
  return (
    <View
      style={[styles.bubble, styles.theirs, styles.typing, { backgroundColor: c.theirs, borderBottomLeftRadius: 4 }, !isDark && styles.shadow]}
      accessibilityLabel="Typing">
      <Tail mine={false} color={c.theirs} />
      <Dot delay={0} color={colors.textSecondary} />
      <Dot delay={140} color={colors.textSecondary} />
      <Dot delay={280} color={colors.textSecondary} />
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { maxWidth: '82%', borderRadius: 16 },
  padded: { paddingHorizontal: 10, paddingTop: 7, paddingBottom: 7 },
  mine: { alignSelf: 'flex-end' },
  theirs: { alignSelf: 'flex-start' },
  shadow: {
    shadowColor: '#5B7C8F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 1,
  },
  tail: {
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  text: { fontSize: 15, lineHeight: 21 },
  spacer: { fontSize: 11 },
  metaFloat: { position: 'absolute', right: 8, bottom: 5 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  time: { fontSize: 11, fontVariant: ['tabular-nums'] },
  caption: { fontSize: 15, lineHeight: 21, paddingHorizontal: 6, paddingTop: 6, paddingBottom: 18 },
  imageMeta: { position: 'absolute', right: 12, bottom: 10, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  voice: { flexDirection: 'row', alignItems: 'center', gap: 10, width: 236 },
  play: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  wave: { flexDirection: 'row', alignItems: 'center', gap: 2, height: 28 },
  bar: { width: 3, borderRadius: 2 },
  voiceFoot: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  file: { flexDirection: 'row', alignItems: 'center', gap: 10, minWidth: 200 },
  fileIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  fileTitle: { fontSize: 14, fontWeight: '600' },
  fileName: { fontSize: 12, marginTop: 1 },
  event: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.pill, marginVertical: 4 },
  eventText: { fontSize: 12, fontWeight: '500' },
  day: { alignSelf: 'center', paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.pill, marginVertical: 6 },
  dayText: { fontSize: 12, fontWeight: '500' },
  typing: { flexDirection: 'row', gap: 5, paddingHorizontal: 14, paddingVertical: 14 },
  typingDot: { width: 7, height: 7, borderRadius: 4 },
});
