import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../constants/colors';
import { useKosMate } from '../context/KosMateContext';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, updateProfile } = useKosMate();

  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(profile.name);

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSaveName = async () => {
    if (draftName.trim()) {
      await updateProfile({ name: draftName.trim() });
    }
    setEditing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── Header ─────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      {/* ─── Profile Card ────────────────────────────────────────── */}
      <View style={styles.profileCard}>
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        {editing ? (
          <View style={styles.editRow}>
            <TextInput
              style={styles.nameInput}
              value={draftName}
              onChangeText={setDraftName}
              autoFocus
              placeholder="Nama kamu"
              placeholderTextColor="#AAA5B0"
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveName}>
              <Text style={styles.saveBtnText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
            <TouchableOpacity
              style={styles.editButton}
              activeOpacity={0.8}
              onPress={() => {
                setDraftName(profile.name);
                setEditing(true);
              }}
            >
              <Feather name="edit-2" size={14} color={COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={styles.editButtonText}>Edit profil</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* ─── Preferensi ──────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferensi</Text>
        <View style={styles.settingsCard}>
          {/* Notifikasi transaksi */}
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: '#F3F0F7' }]}>
              <Feather name="bell" size={18} color={COLORS.secondary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Notifikasi transaksi</Text>
              <Text style={styles.settingDesc}>Info saat ada aktivitas baru</Text>
            </View>
            <Switch
              value={profile.notifications}
              onValueChange={(val) => updateProfile({ notifications: val })}
              trackColor={{ true: COLORS.primary, false: '#D9D5DC' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          {/* Pengingat anggaran */}
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: '#F3F0F7' }]}>
              <Feather name="shield" size={18} color={COLORS.secondary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Pengingat anggaran</Text>
              <Text style={styles.settingDesc}>Peringatan saat mendekati batas</Text>
            </View>
            <Switch
              value={profile.budgetReminder}
              onValueChange={(val) => updateProfile({ budgetReminder: val })}
              trackColor={{ true: COLORS.primary, false: '#D9D5DC' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>

      {/* ─── Tentang ─────────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tentang</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={[styles.settingIcon, { backgroundColor: '#F3F0F7' }]}>
              <Feather name="info" size={18} color={COLORS.secondary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Tentang KosMate</Text>
              <Text style={styles.settingDesc}>Versi 1.0.0</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#AAA5B0" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.profileNote}>Dibuat untuk menemani hidup mandirimu.</Text>
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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ECE8E3',
    shadowColor: '#312C51',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    padding: 3,
    backgroundColor: '#FAF8F5',
    borderWidth: 2,
    borderColor: '#ECE8E3',
    marginBottom: 14,
  },
  avatar: {
    flex: 1,
    borderRadius: 38,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F0F7',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    marginTop: 8,
  },
  nameInput: {
    flex: 1,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E6E2EA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.text,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
  },
  settingsCard: {
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingContent: {
    flex: 1,
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F3F0',
    marginLeft: 68,
  },
  profileNote: {
    textAlign: 'center',
    fontSize: 12,
    color: '#AAA5B0',
    marginTop: 12,
    marginBottom: 24,
  },
});
