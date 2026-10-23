import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/colors';
import { useKosMate } from '@/context/KosMateContext';
import { formatRupiah } from '@/utils/currency';

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { transactions, deleteTransaction } = useKosMate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const tx = transactions.find((item) => item.id === id);

  const confirmDelete = async () => {
    if (!id) return;
    setShowDeleteModal(false);
    await deleteTransaction(id);
    router.back();
  };

  if (!tx) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityLabel="Kembali"
          >
            <Feather name="arrow-left" size={22} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Transaksi</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.notFoundContainer}>
          <Feather name="alert-circle" size={48} color={COLORS.disabled} />
          <Text style={styles.notFoundTitle}>Transaksi Tidak Ditemukan</Text>
          <Text style={styles.notFoundDesc}>
            Data transaksi yang Anda cari tidak tersedia atau sudah dihapus.
          </Text>
          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryActionText}>Kembali ke Keuangan</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isIncome = tx.type === 'income';

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Top App Bar */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Kembali"
        >
          <Feather name="arrow-left" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Transaksi</Text>
        <TouchableOpacity
          style={styles.deleteIconButton}
          onPress={() => setShowDeleteModal(true)}
          accessibilityLabel="Hapus Transaksi"
        >
          <Feather name="trash-2" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Card Hero */}
        <View style={styles.heroCard}>
          <View
            style={[
              styles.typeBadge,
              isIncome ? styles.typeBadgeIncome : styles.typeBadgeExpense,
            ]}
          >
            <Feather
              name={isIncome ? 'arrow-down-left' : 'arrow-up-right'}
              size={14}
              color={isIncome ? COLORS.success : '#E06D53'}
            />
            <Text
              style={[
                styles.typeBadgeText,
                isIncome ? styles.typeTextIncome : styles.typeTextExpense,
              ]}
            >
              {isIncome ? 'Pemasukan' : 'Pengeluaran'}
            </Text>
          </View>

          <Text
            style={[
              styles.amountHero,
              isIncome ? styles.amountIncome : styles.amountExpense,
            ]}
          >
            {isIncome ? '+' : '-'} {formatRupiah(tx.amount)}
          </Text>

          <Text style={styles.noteHero}>{tx.note}</Text>
        </View>

        {/* Detailed Info List */}
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailLabelGroup}>
              <Feather name="tag" size={16} color={COLORS.textSecondary} />
              <Text style={styles.detailLabel}>Kategori</Text>
            </View>
            <Text style={styles.detailValue}>{tx.category}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLabelGroup}>
              <Feather name="calendar" size={16} color={COLORS.textSecondary} />
              <Text style={styles.detailLabel}>Tanggal Transaksi</Text>
            </View>
            <Text style={styles.detailValue}>{tx.date}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLabelGroup}>
              <Feather name="file-text" size={16} color={COLORS.textSecondary} />
              <Text style={styles.detailLabel}>Keterangan</Text>
            </View>
            <Text style={styles.detailValue}>{tx.note || '-'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLabelGroup}>
              <Feather name="hash" size={16} color={COLORS.textSecondary} />
              <Text style={styles.detailLabel}>ID Catatan</Text>
            </View>
            <Text style={[styles.detailValue, { fontFamily: 'monospace', fontSize: 13 }]}>
              {tx.id}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryActionText}>Kembali ke Keuangan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryActionButton}
            onPress={() => setShowDeleteModal(true)}
          >
            <Feather name="trash-2" size={18} color={COLORS.error} style={{ marginRight: 8 }} />
            <Text style={styles.secondaryActionText}>Hapus Transaksi Ini</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ─── Delete Confirmation Modal (Cross-platform) ──────────── */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconCircle}>
              <Feather name="trash-2" size={24} color={COLORS.error} />
            </View>

            <Text style={styles.modalTitle}>Hapus Transaksi?</Text>
            <Text style={styles.modalSubtitle}>
              Catatan transaksi ini akan dihapus secara permanen dari riwayat keuanganmu.
            </Text>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                activeOpacity={0.7}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalDeleteBtn}
                activeOpacity={0.85}
                onPress={confirmDelete}
              >
                <Text style={styles.modalDeleteText}>Ya, Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#FAF8F5',
    borderBottomWidth: 1,
    borderBottomColor: '#ECE8E3',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECE8E3',
  },
  deleteIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  content: {
    padding: 20,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECE8E3',
    marginBottom: 16,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 14,
  },
  typeBadgeIncome: {
    backgroundColor: '#EAF4EE',
  },
  typeBadgeExpense: {
    backgroundColor: '#FFF0ED',
  },
  typeBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  typeTextIncome: {
    color: COLORS.success,
  },
  typeTextExpense: {
    color: '#E06D53',
  },
  amountHero: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  amountIncome: {
    color: COLORS.success,
  },
  amountExpense: {
    color: COLORS.primary,
  },
  noteHero: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ECE8E3',
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3EFEA',
  },
  actionsContainer: {
    gap: 12,
  },
  primaryActionButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryActionButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  secondaryActionText: {
    color: COLORS.error,
    fontSize: 15,
    fontWeight: '600',
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginTop: 40,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  notFoundDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFF0ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3EFEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  modalDeleteBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDeleteText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
