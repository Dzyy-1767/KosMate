import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../constants/colors';
import { useKosMate } from '../context/KosMateContext';
import type { ShoppingCategory, ShoppingItem, ShoppingPriority } from '../types/need';

const CATEGORIES: ShoppingCategory[] = [
  'Kamar',
  'Dapur',
  'Kebersihan',
  'Belajar',
  'Elektronik',
  'Lainnya',
];

const PRIORITIES: ShoppingPriority[] = ['Tinggi', 'Sedang', 'Rendah'];

function formatShortRupiah(amount: number): string {
  return `Rp${new Intl.NumberFormat('id-ID').format(amount)}`;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(`${dateStr}T12:00:00`);
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(d);
  } catch {
    return dateStr;
  }
}

export default function NeedsScreen() {
  const insets = useSafeAreaInsets();
  const { shoppingItems, addShoppingItem, toggleShoppingItem } = useKosMate();

  // Expandable sections ('unpurchased' | 'purchased' | null)
  const [expandedSection, setExpandedSection] = useState<'unpurchased' | 'purchased' | null>(null);

  // Add Item Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ShoppingCategory>('Kamar');
  const [newPrice, setNewPrice] = useState('');
  const [newPriority, setNewPriority] = useState<ShoppingPriority>('Sedang');
  const [newTargetDate, setNewTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [addError, setAddError] = useState<string | null>(null);

  // Confirm Purchase Modal (Actual Price)
  const [selectedItemForPurchase, setSelectedItemForPurchase] = useState<ShoppingItem | null>(null);
  const [actualPriceInput, setActualPriceInput] = useState('');
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const unpurchased = shoppingItems.filter((item) => !item.purchased);
  const purchased = shoppingItems.filter((item) => item.purchased);
  const totalEstimated = unpurchased.reduce((sum, item) => sum + item.price, 0);

  // Handle click on checkbox
  const handleItemPress = (item: ShoppingItem) => {
    if (item.purchased) {
      // Revert to unpurchased
      toggleShoppingItem(item.id);
    } else {
      // Open confirm purchase modal
      setSelectedItemForPurchase(item);
      setActualPriceInput(String(item.price));
      setPurchaseError(null);
    }
  };

  const handleConfirmPurchase = async () => {
    if (!selectedItemForPurchase) return;
    const num = parseFloat(actualPriceInput.replace(/[^0-9]/g, ''));
    if (isNaN(num) || num <= 0) {
      setPurchaseError('Masukkan harga aktual yang valid.');
      return;
    }
    await toggleShoppingItem(selectedItemForPurchase.id, num);
    setSelectedItemForPurchase(null);
  };

  const handleCreateItem = async () => {
    if (!newName.trim()) {
      setAddError('Nama barang wajib diisi.');
      return;
    }
    const numPrice = parseFloat(newPrice.replace(/[^0-9]/g, ''));
    if (isNaN(numPrice) || numPrice <= 0) {
      setAddError('Masukkan estimasi harga yang valid.');
      return;
    }
    if (!newTargetDate.trim()) {
      setAddError('Target tanggal wajib diisi.');
      return;
    }

    await addShoppingItem({
      name: newName.trim(),
      category: newCategory,
      price: numPrice,
      priority: newPriority,
      targetDate: newTargetDate,
    });

    // Reset & close
    setNewName('');
    setNewPrice('');
    setAddError(null);
    setShowAddModal(false);
  };

  const getPriorityStyle = (priority: ShoppingPriority) => {
    switch (priority) {
      case 'Tinggi':
        return { bg: '#FFEBEA', text: '#D32F2F', border: '#FFCDD2' };
      case 'Sedang':
        return { bg: '#FFF5E5', text: '#ED6C02', border: '#FFE0B2' };
      case 'Rendah':
      default:
        return { bg: '#EBF3FE', text: '#0288D1', border: '#B3E5FC' };
    }
  };

  const renderShoppingRow = (item: ShoppingItem) => {
    const pStyle = getPriorityStyle(item.priority);

    return (
      <View key={item.id} style={[styles.shoppingRow, item.purchased && styles.shoppingRowPurchased]}>
        {/* Checkbox Button */}
        <TouchableOpacity
          style={[styles.checkbox, item.purchased && styles.checkboxChecked]}
          activeOpacity={0.8}
          onPress={() => handleItemPress(item)}
        >
          {item.purchased && <Feather name="check" size={14} color="#FFFFFF" />}
        </TouchableOpacity>

        {/* Item Info */}
        <View style={styles.itemMain}>
          <Text
            style={[styles.itemName, item.purchased && styles.itemNamePurchased]}
            numberOfLines={1}
          >
            {item.name}
          </Text>

          <View style={styles.itemMeta}>
            <Text style={styles.itemCategory}>{item.category}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: pStyle.bg, borderColor: pStyle.border }]}>
              <Text style={[styles.priorityText, { color: pStyle.text }]}>{item.priority}</Text>
            </View>
            <View style={styles.targetDateRow}>
              <Feather name="calendar" size={12} color="#8E8A99" />
              <Text style={styles.targetDateText}>{formatDate(item.targetDate)}</Text>
            </View>
          </View>
        </View>

        {/* Price Info */}
        <View style={styles.itemPriceCol}>
          <Text style={[styles.itemPriceText, item.purchased && styles.itemPricePurchased]}>
            {formatShortRupiah(item.purchased && item.actualPrice ? item.actualPrice : item.price)}
          </Text>
          <Text style={styles.itemPriceLabel}>
            {item.purchased ? 'Aktual' : 'Estimasi'}
          </Text>
        </View>
      </View>
    );
  };

  const displayedUnpurchased =
    expandedSection === 'unpurchased' ? unpurchased : unpurchased.slice(0, 3);
  const displayedPurchased =
    expandedSection === 'purchased' ? purchased : purchased.slice(0, 3);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── Header ─────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>List Kebutuhan</Text>
      </View>

      {/* ─── Total Estimate Card ─────────────────────────────────── */}
      <View style={styles.estimateCard}>
        <View style={styles.estimateIconBox}>
          <Feather name="shopping-cart" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.estimateDetails}>
          <View>
            <Text style={styles.estimateLabel}>Total estimasi</Text>
            <Text style={styles.estimateAmount}>{formatShortRupiah(totalEstimated)}</Text>
          </View>
          <View style={styles.estimateDivider} />
          <View>
            <Text style={styles.estimateLabel}>Belum dibeli</Text>
            <Text style={styles.estimateCount}>{unpurchased.length} barang</Text>
          </View>
        </View>
      </View>

      {/* ─── Add Button ─────────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.85}
        onPress={() => {
          setAddError(null);
          setShowAddModal(true);
        }}
      >
        <Feather name="plus" size={18} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Tambah kebutuhan</Text>
      </TouchableOpacity>

      {/* ─── Section: Belum Dibeli ───────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Belum dibeli</Text>
        {unpurchased.length > 3 && (
          <TouchableOpacity
            onPress={() =>
              setExpandedSection((prev) => (prev === 'unpurchased' ? null : 'unpurchased'))
            }
          >
            <Text style={styles.actionText}>
              {expandedSection === 'unpurchased' ? 'Tutup' : 'Lihat Semua'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardContainer}>
        {unpurchased.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Semua kebutuhan sudah terbeli. 🎉</Text>
          </View>
        ) : (
          displayedUnpurchased.map(renderShoppingRow)
        )}
      </View>

      {/* ─── Section: Sudah Dibeli ───────────────────────────────── */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <Text style={styles.sectionTitle}>Sudah dibeli</Text>
        {purchased.length > 3 && (
          <TouchableOpacity
            onPress={() =>
              setExpandedSection((prev) => (prev === 'purchased' ? null : 'purchased'))
            }
          >
            <Text style={styles.actionText}>
              {expandedSection === 'purchased' ? 'Tutup' : 'Lihat Semua'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardContainer}>
        {purchased.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Belum ada barang yang dibeli.</Text>
          </View>
        ) : (
          displayedPurchased.map(renderShoppingRow)
        )}
      </View>

      {/* ─── Modal: Confirm Purchase (Actual Price) ─────────────── */}
      <Modal
        visible={!!selectedItemForPurchase}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedItemForPurchase(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setSelectedItemForPurchase(null)}
          />

          <View style={styles.sheetBox}>
            <View style={styles.sheetHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Konfirmasi Pembelian</Text>
              <TouchableOpacity onPress={() => setSelectedItemForPurchase(null)}>
                <Feather name="x" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            {selectedItemForPurchase && (
              <View style={styles.itemContextBox}>
                <Text style={styles.contextName}>{selectedItemForPurchase.name}</Text>
                <Text style={styles.contextEstimate}>
                  Estimasi: {formatShortRupiah(selectedItemForPurchase.price)}
                </Text>
              </View>
            )}

            {purchaseError && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{purchaseError}</Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Harga aktual *</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                placeholder="Masukkan harga riil saat dibeli"
                placeholderTextColor="#AAA5B0"
                value={actualPriceInput}
                onChangeText={(v) => {
                  setActualPriceInput(v);
                  setPurchaseError(null);
                }}
                autoFocus
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={() => setSelectedItemForPurchase(null)}
              >
                <Text style={styles.btnSecondaryText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={handleConfirmPurchase}>
                <Text style={styles.btnPrimaryText}>Tandai dibeli</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ─── Modal: Add Shopping Item ────────────────────────────── */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setShowAddModal(false)}
          />

          <View style={styles.sheetBox}>
            <View style={styles.sheetHandle} />

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Tambah Kebutuhan</Text>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <Feather name="x" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              {addError && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{addError}</Text>
                </View>
              )}

              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nama barang *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Contoh: Sprei kasur, Lampu belajar"
                  placeholderTextColor="#AAA5B0"
                  value={newName}
                  onChangeText={(v) => {
                    setNewName(v);
                    setAddError(null);
                  }}
                  autoFocus
                />
              </View>

              {/* Category */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Kategori *</Text>
                <View style={styles.chipsWrap}>
                  {CATEGORIES.map((cat) => {
                    const active = newCategory === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        style={[styles.chip, active && styles.chipActive]}
                        onPress={() => setNewCategory(cat)}
                      >
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Price */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Estimasi harga *</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  placeholder="Contoh: 150000"
                  placeholderTextColor="#AAA5B0"
                  value={newPrice}
                  onChangeText={(v) => {
                    setNewPrice(v);
                    setAddError(null);
                  }}
                />
              </View>

              {/* Priority */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Prioritas *</Text>
                <View style={styles.chipsWrap}>
                  {PRIORITIES.map((p) => {
                    const active = newPriority === p;
                    return (
                      <TouchableOpacity
                        key={p}
                        style={[styles.chip, active && styles.chipActive]}
                        onPress={() => setNewPriority(p)}
                      >
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>
                          {p}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Target Date */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Target tanggal (YYYY-MM-DD) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#AAA5B0"
                  value={newTargetDate}
                  onChangeText={setNewTargetDate}
                />
              </View>

              {/* Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.btnSecondary}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={styles.btnSecondaryText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPrimary} onPress={handleCreateItem}>
                  <Text style={styles.btnPrimaryText}>Tambah</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  estimateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECE8E3',
    shadowColor: '#312C51',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  estimateIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FAF8F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E6E2EA',
  },
  estimateDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  estimateLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 3,
  },
  estimateAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  estimateDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E6E2EA',
    marginHorizontal: 12,
  },
  estimateCount: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
    marginBottom: 24,
    shadowColor: '#312C51',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ECE8E3',
    overflow: 'hidden',
    shadowColor: '#312C51',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  shoppingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F3F0',
  },
  shoppingRowPurchased: {
    opacity: 0.65,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#C7C2D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  itemMain: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  itemNamePurchased: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  itemCategory: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  priorityBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  targetDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  targetDateText: {
    fontSize: 11,
    color: '#8E8A99',
  },
  itemPriceCol: {
    alignItems: 'flex-end',
  },
  itemPriceText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  itemPricePurchased: {
    color: COLORS.textSecondary,
  },
  itemPriceLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  emptyBox: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(37, 35, 58, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetBox: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    paddingHorizontal: 20,
    maxHeight: '90%',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E6E2EA',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  itemContextBox: {
    backgroundColor: '#FAF8F5',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E6E2EA',
  },
  contextName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  contextEstimate: {
    fontSize: 13,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  errorBanner: {
    backgroundColor: '#FFE8E8',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  errorBannerText: {
    color: COLORS.error,
    fontSize: 13,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E6E2EA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E6E2EA',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 10,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: '#F3F0F7',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  btnPrimary: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
