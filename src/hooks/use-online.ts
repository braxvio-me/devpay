import { Dialog } from '@/lib/dialog';
import { useNetworkState } from 'expo-network';

/** True unless the device reports no connection or no internet. Unknown counts as online. */
export function useOnline() {
  const s = useNetworkState();
  return !(s.isConnected === false || s.isInternetReachable === false);
}

/** Standard message when an action needs the network. Returns false so callers can `return offlineAlert()`. */
export function offlineAlert(action = 'do this') {
  Dialog.alert('You’re offline', `Connect to the internet to ${action}. Nothing was sent.`);
  return false;
}
