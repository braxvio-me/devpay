import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { AuthShell } from '@/components/auth-shell';
import { Button, ChoiceCard } from '@/components/ds';

type Role = 'freelancer' | 'client';

const POINTS: Record<Role, { icon: keyof typeof Ionicons.glyphMap; text: string }[]> = {
  freelancer: [
    { icon: 'shield-checkmark', text: 'Milestones funded before you start' },
    { icon: 'flash', text: 'Payouts to MoMo in minutes' },
  ],
  client: [
    { icon: 'lock-closed', text: 'Pay only for approved work' },
    { icon: 'people', text: 'Ghana Card verified talent' },
  ],
};

export default function ChooseRoleScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [role, setRole] = useState<Role>('freelancer');

  return (
    <AuthShell
      title="How will you use DevPay?"
      subtitle="You can switch between modes anytime from your profile."
      step={{ index: 1, total: 3 }}
      footer={
        <>
          <Button
            label={`Continue as ${role === 'freelancer' ? 'Freelancer' : 'Client'}`}
            onPress={() => router.push({ pathname: '/register', params: { defaultRole: role } })}
          />
          <Pressable onPress={() => router.push('/login')} style={styles.footer} accessibilityRole="link">
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Already have an account? <Text style={{ color: colors.text, fontWeight: '600' }}>Sign In</Text>
            </Text>
          </Pressable>
        </>
      }>
      <ChoiceCard
        selected={role === 'freelancer'}
        onPress={() => setRole('freelancer')}
        icon="laptop-outline"
        title="I want to work"
        description="Apply to verified jobs. Every milestone sits in escrow before you write a line of code.">
        <Points items={POINTS.freelancer} />
      </ChoiceCard>
      <ChoiceCard
        selected={role === 'client'}
        onPress={() => setRole('client')}
        icon="briefcase-outline"
        title="I want to hire"
        description="Post milestone contracts, fund escrow, and release payment when the work is approved.">
        <Points items={POINTS.client} />
      </ChoiceCard>
    </AuthShell>
  );
}

function Points({ items }: { items: { icon: keyof typeof Ionicons.glyphMap; text: string }[] }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      {items.map((p) => (
        <View key={p.text} style={styles.point}>
          <Ionicons name={p.icon} size={14} color={colors.accentGreen} />
          <Text style={[styles.pointText, { color: colors.text }]}>{p.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  point: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pointText: { fontSize: 13 },
  footer: { alignItems: 'center', paddingVertical: 8 },
  footerText: { fontSize: 13 },
});
