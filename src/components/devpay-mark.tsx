import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Gradients } from '@/constants/theme';

/** Brand mark: the nav's rotated sky squircle with a shield-check. */
export function DevPayMark({ size = 72 }: { size?: number }) {
  const r = size * 0.33;
  return (
    <View style={{ width: size * 1.1, height: size * 1.1, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: size * 0.78,
          height: size * 0.78,
          borderRadius: r,
          transform: [{ rotate: '45deg' }],
          shadowColor: '#3FA7DA',
          shadowOffset: { width: 0, height: size * 0.12 },
          shadowOpacity: 0.35,
          shadowRadius: size * 0.22,
          elevation: 8,
        }}>
        <LinearGradient
          colors={Gradients.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, borderRadius: r, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ transform: [{ rotate: '-45deg' }] }}>
            <MaterialCommunityIcons name="shield-check" size={size * 0.38} color="#FFFFFF" />
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}
