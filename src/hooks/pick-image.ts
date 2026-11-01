import { Dialog } from '@/lib/dialog';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

/** Ask camera or library, request the permission, and resolve the picked URI (or null). */
export function pickImage(title: string, aspect: [number, number] = [1, 1]): Promise<string | null> {
  return new Promise((resolve) => {
    const finish = async (result: ImagePicker.ImagePickerResult) => {
      const uri = !result.canceled ? result.assets?.[0]?.uri ?? null : null;
      if (uri) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      resolve(uri);
    };

    Dialog.alert(title, undefined, [
      {
        text: 'Take photo',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Dialog.alert('Camera access needed', 'Allow camera access in Settings to take a photo.');
            return resolve(null);
          }
          finish(await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect, quality: 0.85 }));
        },
      },
      {
        text: 'Choose from library',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Dialog.alert('Photo access needed', 'Allow photo library access in Settings to choose a photo.');
            return resolve(null);
          }
          finish(
            await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect, quality: 0.85 })
          );
        },
      },
      { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
    ]);
  });
}
