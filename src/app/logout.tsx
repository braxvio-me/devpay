import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export default function LogoutScreen() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      router.replace('/login');
    }, 800);
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sign Out</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.container}>
          {/* Avatar & User Details */}
          <View style={styles.card}>
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }}
                style={styles.avatar}
              />
              <View style={styles.onlineBadge} />
            </View>

            <Text style={styles.userName}>Kwame Mensah</Text>
            <Text style={styles.userRole}>Senior Mobile & React Native Engineer</Text>
            <Text style={styles.userPhone}>+233 24 123 4567 • Ghana Card Verified</Text>

            <View style={styles.noticeBox}>
              <Ionicons name="shield-checkmark" size={20} color="#0F73F7" />
              <View style={styles.noticeTextWrap}>
                <Text style={styles.noticeTitle}>Your Escrow Funds Remain Safe</Text>
                <Text style={styles.noticeDesc}>
                  Active milestone escrows and pending MoMo withdrawals will continue processing safely while you are signed out.
                </Text>
              </View>
            </View>

            <View style={styles.sessionBox}>
              <View style={styles.sessionRow}>
                <Ionicons name="phone-portrait-outline" size={16} color={Colors.light.textSecondary} />
                <Text style={styles.sessionText}>Active Session: Current Device (Accra, GH)</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsGroup}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleConfirmLogout}
              disabled={isLoggingOut}
              activeOpacity={0.85}>
              {isLoggingOut ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.logoutButtonText}>Sign Out Now</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={isLoggingOut}
              activeOpacity={0.8}>
              <Text style={styles.cancelButtonText}>Stay Signed In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF3FA',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.light.text,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    marginTop: 20,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E2E8F0',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginBottom: 20,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 16,
  },
  noticeTextWrap: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F73F7',
    marginBottom: 3,
  },
  noticeDesc: {
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 17,
  },
  sessionBox: {
    width: '100%',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  sessionText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  actionsGroup: {
    gap: 12,
    marginBottom: 16,
  },
  logoutButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
  },
});
