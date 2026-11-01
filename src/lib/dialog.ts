/**
 * In-app replacement for Alert.alert so dialogs look identical on iOS, Android and web.
 * Same call signature: Dialog.alert(title, message?, buttons?).
 */
export interface DialogButton {
  text?: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

export interface DialogRequest {
  id: number;
  title: string;
  message?: string;
  buttons: DialogButton[];
}

type Listener = (req: DialogRequest) => void;
let listener: Listener | null = null;
let nextId = 1;

export const Dialog = {
  alert(title: string, message?: string, buttons?: DialogButton[]) {
    const req: DialogRequest = { id: nextId++, title, message, buttons: buttons?.length ? buttons : [{ text: 'OK' }] };
    listener?.(req);
  },
};

/** Used by DialogHost only. */
export function subscribeDialogs(l: Listener) {
  listener = l;
  return () => {
    if (listener === l) listener = null;
  };
}
