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

import { COLORS } from '../constants/colors';
import { useKosMate } from '../context/KosMateContext';
import type { TransactionType } from '../types/expense';

const EXPENSE_CATEGORIES = [
  'Makanan',
  'Transportasi',
  'Kos',
  'Tagihan',
  'Belanja',
  'Pendidikan',
  'Lainnya',
];

const INCOME_CATEGORIES = ['Keluarga', 'Freelance', 'Gaji', 'Lainnya'];

export function QuickActionModal() {
  const { quickSheet, closeQuickSheet, openQuickSheet, addTransaction } = useKosMate();

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!quickSheet) return null;

  const isForm = quickSheet === 'income' || quickSheet === 'expense';
  const type: TransactionType = quickSheet === 'income' ? 'income' : 'expense';

  const resetForm = () => {
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setNote('');
    setCategory('');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    closeQuickSheet();
  };

  const handleSubmit = async () => {
    const numAmount = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Masukkan nominal yang valid.');
      return;
    }
    if (type === 'expense' && !category) {
      setError('Pilih kategori pengeluaran.');
      return;
    }
    if (type === 'expense' && !note.trim()) {
      setError('Catatan pengeluaran wajib diisi.');
      return;
    }

    await addTransaction({
      type,
      amount: numAmount,
      date: date || new Date().toISOString().split('T')[0],
      note: note.trim() || (type === 'income' ? 'Pemasukan' : 'Pengeluaran'),
      category: category || (type === 'income' ? 'Keluarga' : 'Lainnya'),
    });

    handleClose();
  };

  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View style={styles.sheetContainer}>
          <View style={styles.sheetHandle} />

          {/* ─── Mode 1: Quick Action Picker ─────────────────────── */}
          {quickSheet === 'quick' && (
            <View style={styles.quickContent}>
              <View style={styles.quickHeader}>
                <Text style={styles.sheetTitle}>Tambah Transaksi</Text>
              </View>

              <View style={styles.quickRow}>
                <TouchableOpacity
                  style={styles.quickCard}
                  activeOpacity={0.7}
                  onPress={() => {
                    resetForm();
                    setCategory('Keluarga');
                    openQuickSheet('income');
                  }}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.iconCircle, { backgroundColor: '#EAF4EE' }]}>
                      <Feather name="arrow-down-left" size={20} color={COLORS.success} />
                    </View>
                    <Feather name="chevron-right" size={16} color="#AAA5B0" />
                  </View>
                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>Tambah Pemasukan</Text>
                    <Text style={styles.cardDesc}>Gaji, uang saku, atau pendapatan lain</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickCard}
                  activeOpacity={0.7}
                  onPress={() => {
                    resetForm();
                    setCategory('Makanan');
                    openQuickSheet('expense');
                  }}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.iconCircle, { backgroundColor: '#FFF0ED' }]}>
                      <Feather name="arrow-up-right" size={20} color="#E06D53" />
                    </View>
                    <Feather name="chevron-right" size={16} color="#AAA5B0" />
                  </View>
                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>Tambah Pengeluaran</Text>
                    <Text style={styles.cardDesc}>Belanja, tagihan, atau kebutuhan harian</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.8}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ─── Mode 2: Form Income / Expense ───────────────────── */}
          {isForm && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.formContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.formHeader}>
                <Text style={styles.sheetTitle}>
                  {type === 'income' ? 'Tambah Pemasukan' : 'Tambah Pengeluaran'}
                </Text>
                <TouchableOpacity onPress={handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Feather name="x" size={22} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Nominal */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Nominal *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Contoh: 150000"
                  placeholderTextColor="#AAA5B0"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={(val) => {
                    setAmount(val);
                    setError(null);
                  }}
                  autoFocus
                />
              </View>

              {/* Tanggal */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Tanggal (YYYY-MM-DD) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#AAA5B0"
                  value={date}
                  onChangeText={setDate}
                />
              </View>

              {/* Kategori */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Kategori *</Text>
                <View style={styles.chipsContainer}>
                  {(type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((cat) => {
                    const isSelected = category === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        style={[styles.chip, isSelected && styles.chipActive]}
                        onPress={() => {
                          setCategory(cat);
                          setError(null);
                        }}
                      >
                        <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Catatan */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Catatan {type === 'expense' ? '*' : ''}</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={type === 'expense' ? 'Contoh: Makan siang & kopi' : 'Contoh: Uang bulanan'}
                  placeholderTextColor="#AAA5B0"
                  value={note}
                  onChangeText={(val) => {
                    setNote(val);
                    setError(null);
                  }}
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.formCancelBtn} onPress={handleClose}>
                  <Text style={styles.formCancelBtnText}>Batal</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.formSubmitBtn} onPress={handleSubmit}>
                  <Text style={styles.formSubmitBtnText}>Simpan</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(37, 35, 58, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    paddingHorizontal: 20,
    maxHeight: '90%',
    shadowColor: '#312C51',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 20,
  },
  sheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E6E2EA',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  quickContent: {
    paddingBottom: 8,
  },
  quickHeader: {
    marginBottom: 2,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  quickCard: {
    flex: 1,
    backgroundColor: '#FAF8F5',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ECE8E3',
    justifyContent: 'space-between',
    minHeight: 136,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 18,
  },
  cardDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  cancelButton: {
    marginTop: 16,
    backgroundColor: '#F3F0F7',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  formContent: {
    paddingBottom: 16,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: '#FFE8E8',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '500',
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
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
  chipsContainer: {
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
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formCancelBtn: {
    flex: 1,
    backgroundColor: '#F3F0F7',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  formCancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  formSubmitBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  formSubmitBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
