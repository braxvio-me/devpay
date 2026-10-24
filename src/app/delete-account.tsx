import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export default function DeleteAccountScreen() {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState<string>('Found another platform');
  const [feedback, setFeedback] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const reasons = [
    'Found work elsewhere',
    'Too high platform / escrow fees',
    'Taking a temporary break',
    'Privacy or data concerns',
    'Difficulty with Ghana Card KYC',
    'Other reason',
  ];

  const handleDelete = () => {
    if (!agreed) {
      Alert.alert('Agreement Required', 'Please confirm that you understand account deletion is permanent.');
      return;
    }

    if (confirmText.trim().toUpperCase() !== 'DELETE') {
      Alert.alert('Verification Needed', 'Please type DELETE in the confirmation box to authorize account termination.');
      return;
    }

    Alert.alert(
      'Final Confirmation',
      'This will immediately revoke your DevPay Africa session, terminate your verified Ghana Card link, and close your account. Proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Permanently Delete',
          style: 'destructive',
          onPress: () => {
            setIsDeleting(true);
            setTimeout(() => {
              Alert.alert('Account Deleted', 'Your DevPay Africa account has been permanently closed.');
              router.replace('/welcome');
            }, 1000);
          },
        },
      ]
    );
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
          <Text style={styles.headerTitle}>Delete Account</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Warning Banner */}
          <View style={styles.warningCard}>
            <View style={styles.warningIconCircle}>
              <Ionicons name="warning-outline" size={26} color="#DC2626" />
            </View>
            <Text style={styles.warningHeading}>Permanent Account Termination</Text>
            <Text style={styles.warningText}>
              Deleting your account is irreversible. Your profile, milestone history, 5.0 client rating, and verified Ghana Card credentials will be permanently erased.
            </Text>
          </View>

          {/* Pre-flight Escrow Checks */}
          <View style={styles.checklistCard}>
            <Text style={styles.checklistTitle}>Escrow Pre-flight Checklist</Text>

            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <View style={styles.checkItemTextWrap}>
                <Text style={styles.checkItemTitle}>No Active Escrow Holds</Text>
                <Text style={styles.checkItemDesc}>All ongoing milestone funds have been completed or released.</Text>
              </View>
            </View>

            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <View style={styles.checkItemTextWrap}>
                <Text style={styles.checkItemTitle}>Wallet Cleared</Text>
                <Text style={styles.checkItemDesc}>No pending MoMo withdrawals remain in processing.</Text>
              </View>
            </View>
          </View>

          {/* Reason Selector */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>Why are you leaving DevPay Africa?</Text>
            <View style={styles.reasonsList}>
              {reasons.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <TouchableOpacity
                    key={reason}
                    style={[styles.reasonOption, isSelected && styles.reasonSelected]}
                    onPress={() => setSelectedReason(reason)}
                    activeOpacity={0.8}>
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <Text style={[styles.reasonText, isSelected && styles.reasonTextActive]}>
                      {reason}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Optional Feedback */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>Additional Feedback (Optional)</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Tell us what we could have done better..."
              placeholderTextColor={Colors.light.textMuted}
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Confirmation Checkbox */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAgreed(!agreed)}
            activeOpacity={0.8}>
            <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
              {agreed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
            </View>
            <Text style={styles.checkboxLabel}>
              I understand that this action is permanent and cannot be undone. All reputation and verified credentials will be deleted.
            </Text>
          </TouchableOpacity>

          {/* Confirmation Input Box */}
          <View style={styles.confirmBox}>
            <Text style={styles.confirmInstruction}>
              Type <Text style={{ fontWeight: '800', color: '#DC2626' }}>DELETE</Text> below to confirm:
            </Text>
            <TextInput
              style={styles.confirmInput}
              placeholder="DELETE"
              placeholderTextColor={Colors.light.textMuted}
              value={confirmText}
              onChangeText={setConfirmText}
              autoCapitalize="characters"
            />
          </View>

          {/* Delete Button */}
          <TouchableOpacity
            style={[
              styles.deleteButton,
              (!agreed || confirmText.trim().toUpperCase() !== 'DELETE' || isDeleting) &&
                styles.deleteButtonDisabled,
            ]}
            onPress={handleDelete}
            disabled={!agreed || confirmText.trim().toUpperCase() !== 'DELETE' || isDeleting}
            activeOpacity={0.85}>
            <Ionicons name="trash" size={18} color="#FFFFFF" />
            <Text style={styles.deleteButtonText}>
              {isDeleting ? 'Deleting Account...' : 'Permanently Delete Account'}
            </Text>
          </TouchableOpacity>

          {/* Cancel button */}
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}>
            <Text style={styles.cancelBtnText}>Never mind, keep my account</Text>
          </TouchableOpacity>
        </ScrollView>
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
    color: '#DC2626',
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  warningCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    textAlign: 'center',
  },
  warningIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  warningHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#991B1B',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#B91C1C',
    textAlign: 'center',
  },
  checklistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    gap: 12,
  },
  checklistTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkItemTextWrap: {
    flex: 1,
  },
  checkItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
  },
  checkItemDesc: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  sectionBlock: {
    gap: 10,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  reasonsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    overflow: 'hidden',
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  reasonSelected: {
    backgroundColor: '#FFF5F5',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#DC2626',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#DC2626',
  },
  reasonText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  reasonTextActive: {
    fontWeight: '700',
    color: '#DC2626',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    padding: 14,
    fontSize: 14,
    color: Colors.light.text,
    minHeight: 80,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.light.textSecondary,
  },
  confirmBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 16,
    gap: 10,
  },
  confirmInstruction: {
    fontSize: 13,
    color: Colors.light.text,
  },
  confirmInput: {
    height: 46,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
    backgroundColor: '#F8FAFC',
  },
  deleteButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  deleteButtonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
});
