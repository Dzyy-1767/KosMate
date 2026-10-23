import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/colors';
import { useKosMate } from '@/context/KosMateContext';
import { formatRupiah } from '@/utils/currency';

export default function NeedDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { shoppingItems, toggleShoppingItem, deleteShoppingItem, showToast } = useKosMate();

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actualPriceInput, setActualPriceInput] = useState('');
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const item = shoppingItems.find((s) => s.id === id);

  const confirmDelete = () => {
    if (!id) return;
    setShowDeleteModal(false);
    router.back();
    setTimeout(() => {
      deleteShoppingItem(id);
    }, 100);
  };

  const handleToggleStatus = () => {
    if (!item) return;
    if (item.purchased) {
      // Toggle back to unpurchased
      toggleShoppingItem(item.id);
      showToast('Status diubah ke belum dibeli');
    } else {
      // Show actual price confirmation modal
      setActualPriceInput(item.price ? item.price.toString() : '');
      setPurchaseError(null);
      setShowPurchaseModal(true);
    }
  };

  const handleConfirmPurchase = async () => {
    if (!item) return;
    const cleanStr = actualPriceInput.replace(/[^0-9]/g, '');
    const num = parseInt(cleanStr, 10);

    if (isNaN(num) || num <= 0) {
      setPurchaseError('Masukkan harga aktual yang valid');
      return;
    }

    await toggleShoppingItem(item.id, num);
    setShowPurchaseModal(false);
    showToast(`Berhasil menandai "${item.name}" terbeli`);
  };

  if (!item) {
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
          <Text style={styles.headerTitle}>Detail Kebutuhan</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.notFoundContainer}>
          <Feather name="alert-circle" size={48} color={COLORS.disabled} />
          <Text style={styles.notFoundTitle}>Kebutuhan Tidak Ditemukan</Text>
          <Text style={styles.notFoundDesc}>
            Data kebutuhan yang Anda cari tidak tersedia atau sudah dihapus.
          </Text>
          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryActionText}>Kembali ke Daftar Kebutuhan</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const getPriorityTheme = () => {
    switch (item.priority) {
      case 'Tinggi':
        return { bg: '#FFEBEA', text: '#D32F2F', border: '#FFCDD2' };
      case 'Sedang':
        return { bg: '#FFF5E5', text: '#ED6C02', border: '#FFE0B2' };
      case 'Rendah':
      default:
        return { bg: '#EBF3FE', text: '#0288D1', border: '#B3E5FC' };
    }
  };

  const pTheme = getPriorityTheme();

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
        <Text style={styles.headerTitle}>Detail Kebutuhan</Text>
        <TouchableOpacity
          style={styles.deleteIconButton}
          onPress={() => setShowDeleteModal(true)}
          accessibilityLabel="Hapus Kebutuhan"
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
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: pTheme.bg, borderColor: pTheme.border },
              ]}
            >
              <Text style={[styles.priorityBadgeText, { color: pTheme.text }]}>
                Prioritas {item.priority}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                item.purchased ? styles.statusBadgePurchased : styles.statusBadgePending,
              ]}
            >
              <Feather
                name={item.purchased ? 'check-circle' : 'clock'}
                size={13}
                color={item.purchased ? COLORS.success : '#8E8A99'}
              />
              <Text
                style={[
                  styles.statusBadgeText,
                  item.purchased ? styles.statusTextPurchased : styles.statusTextPending,
                ]}
              >
                {item.purchased ? 'Sudah Dibeli' : 'Belum Dibeli'}
              </Text>
            </View>
          </View>

          <Text style={styles.nameHero}>{item.name}</Text>

          <Text style={styles.priceHero}>
            {formatRupiah(item.purchased && item.actualPrice ? item.actualPrice : item.price)}
          </Text>

          <Text style={styles.priceSubtitle}>
            {item.purchased && item.actualPrice
              ? `Harga beli aktual (estimasi: ${formatRupiah(item.price)})`
              : 'Estimasi biaya'}
          </Text>
        </View>

        {/* Detailed Info List */}
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailLabelGroup}>
              <Feather name="folder" size={16} color={COLORS.textSecondary} />
              <Text style={styles.detailLabel}>Kategori</Text>
            </View>
            <Text style={styles.detailValue}>{item.category}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLabelGroup}>
              <Feather name="calendar" size={16} color={COLORS.textSecondary} />
              <Text style={styles.detailLabel}>Target Dibeli</Text>
            </View>
            <Text style={styles.detailValue}>{item.targetDate}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLabelGroup}>
              <Feather name="dollar-sign" size={16} color={COLORS.textSecondary} />
              <Text style={styles.detailLabel}>Estimasi Awal</Text>
            </View>
            <Text style={styles.detailValue}>{formatRupiah(item.price)}</Text>
          </View>

          {item.purchased && item.actualPrice && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <View style={styles.detailLabelGroup}>
                  <Feather name="check" size={16} color={COLORS.success} />
                  <Text style={styles.detailLabel}>Harga Aktual</Text>
                </View>
                <Text style={[styles.detailValue, { color: COLORS.success }]}>
                  {formatRupiah(item.actualPrice)}
                </Text>
              </View>
            </>
          )}

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLabelGroup}>
              <Feather name="hash" size={16} color={COLORS.textSecondary} />
              <Text style={styles.detailLabel}>ID Kebutuhan</Text>
            </View>
            <Text style={[styles.detailValue, { fontFamily: 'monospace', fontSize: 13 }]}>
              {item.id}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.primaryActionButton,
              item.purchased && { backgroundColor: '#48426D' },
            ]}
            onPress={handleToggleStatus}
          >
            <Feather
              name={item.purchased ? 'rotate-ccw' : 'check'}
              size={18}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.primaryActionText}>
              {item.purchased ? 'Ubah ke Belum Dibeli' : 'Tandai Sudah Dibeli'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backActionButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
            <Text style={styles.backActionText}>Kembali ke Daftar Kebutuhan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryActionButton}
            onPress={() => setShowDeleteModal(true)}
          >
            <Feather name="trash-2" size={18} color={COLORS.error} style={{ marginRight: 8 }} />
            <Text style={styles.secondaryActionText}>Hapus Kebutuhan Ini</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Actual Price Modal */}
      <Modal visible={showPurchaseModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Konfirmasi Pembelian</Text>
            <Text style={styles.modalSubtitle}>
              Berapa harga aktual saat Anda membeli &quot;{item.name}&quot;?
            </Text>

            <View style={styles.inputWrap}>
              <Text style={styles.inputPrefix}>Rp</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                value={actualPriceInput}
                onChangeText={(text) => {
                  setActualPriceInput(text);
                  setPurchaseError(null);
                }}
                placeholder="0"
                autoFocus
              />
            </View>

            {purchaseError && <Text style={styles.errorText}>{purchaseError}</Text>}

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowPurchaseModal(false)}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmPurchase}
              >
                <Text style={styles.modalConfirmText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal (Cross-platform) */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.deleteModalIconBox}>
              <Feather name="trash-2" size={24} color={COLORS.error} />
            </View>
            <Text style={styles.modalTitle}>Hapus Kebutuhan?</Text>
            <Text style={styles.modalSubtitle}>
              Barang kebutuhan ini akan dihapus secara permanen dari daftar belanjamu.
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
                style={styles.deleteConfirmBtn}
                activeOpacity={0.85}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteConfirmText}>Ya, Hapus</Text>
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
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  priorityBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  statusBadgePurchased: {
    backgroundColor: '#EAF4EE',
  },
  statusBadgePending: {
    backgroundColor: '#F3EFEA',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextPurchased: {
    color: COLORS.success,
  },
  statusTextPending: {
    color: '#8E8A99',
  },
  nameHero: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  priceHero: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  priceSubtitle: {
    fontSize: 13,
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
  backActionButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECE8E3',
  },
  backActionText: {
    color: COLORS.primary,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECE8E3',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  inputPrefix: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginRight: 6,
  },
  modalInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: COLORS.text,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginBottom: 12,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F3EFEA',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deleteModalIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF0ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  deleteConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.error,
    alignItems: 'center',
  },
  deleteConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
