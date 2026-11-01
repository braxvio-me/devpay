/**
 * Local notifications (no push server yet). Events in the app call `notify()`;
 * it is a no-op on web, without permission, or when the user switched notifications off.
 */
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';

const ENABLED_KEY = 'devpay_notifications_on';
const CHANNEL = 'devpay';
const supported = Platform.OS !== 'web';

let enabled = true;

/** Call once at startup. */
export async function setupNotifications() {
  if (!supported) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'DevPay updates',
      importance: AndroidImportance.HIGH,
      lightColor: '#1C6E99',
    }).catch(() => {});
  }
  enabled = (await AsyncStorage.getItem(ENABLED_KEY).catch(() => null)) !== '0';
}

export async function hasPermission() {
  if (!supported) return false;
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

/** Ask for permission if needed. Returns whether notifications can be shown. */
export async function requestPermission() {
  if (!supported) return false;
  if (await hasPermission()) return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export function notificationsEnabled() {
  return enabled;
}

export async function setNotificationsEnabled(on: boolean) {
  enabled = on;
  await AsyncStorage.setItem(ENABLED_KEY, on ? '1' : '0').catch(() => {});
  if (!on && supported) await Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});
}

/**
 * Show a notification now, or after `inSeconds`. `route` opens when the user taps it.
 */
export async function notify(title: string, body: string, route?: string, inSeconds?: number) {
  if (!supported || !enabled) return;
  if (!(await hasPermission())) return;
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data: route ? { route } : {} },
    trigger: inSeconds
      ? { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: inSeconds, channelId: CHANNEL }
      : Platform.OS === 'android'
        ? { channelId: CHANNEL }
        : null,
  }).catch(() => {});
}

const scheduledDeadlines = new Set<string>();

/** Local reminders for a deadline: 1 hour before and at the deadline. */
export async function scheduleDeadline(key: string, title: string, body: string, dueAt: number, route: string) {
  if (!supported || scheduledDeadlines.has(key)) return;
  scheduledDeadlines.add(key);
  const secs = Math.floor((dueAt - Date.now()) / 1000);
  if (secs > 3600) await notify(`${title} in 1 hour`, body, route, secs - 3600);
  if (secs > 0) await notify(`${title} now`, body, route, secs);
}
