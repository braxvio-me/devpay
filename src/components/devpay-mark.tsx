import React from 'react';
import { Image } from 'expo-image';

/** Logo artwork is 218×149 (cropped from assets/images/logo-source.jpg). */
const RATIO = 218 / 149;
const LOGO = require('../../assets/images/logo-mark.png');

/** DevPay logo mark: code brackets around Africa. `size` is the height in points. */
export function DevPayMark({ size = 32 }: { size?: number }) {
  return (
    <Image
      source={LOGO}
      contentFit="contain"
      style={{ width: size * RATIO, height: size }}
      accessibilityLabel="DevPay"
      accessibilityRole="image"
    />
  );
}
