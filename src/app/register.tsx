import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateProfile, showToast, login } = useKosMate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!name.trim()) {
      setErrorMessage('Silakan masukkan nama lengkap Anda.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Silakan masukkan alamat email Anda.');
      return;
    }
    if (!password) {
      setErrorMessage('Silakan masukkan kata sandi.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setErrorMessage(null);
    await updateProfile({
      name: name.trim(),
      email: email.trim(),
    });
    showToast(`Akun berhasil dibuat. Selamat datang, ${name.trim()}!`);
    await login();
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Background Organic Shapes */}
        <View style={styles.organicCircleTopRight} />
        <View style={styles.organicCircleLeft} />

        {/* ─── Header: App Logo & Brand ─────────────────────────── */}
        <View style={styles.brandRow}>
          <View style={styles.logoBox}>
            <Feather name="home" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.brandName}>KosMate</Text>
        </View>

        {/* ─── Hero Headline Section ───────────────────────────── */}
        <View style={styles.heroSection}>
          <Text style={styles.subBadge}>TEMAN HIDUP ANAK KOS</Text>
          <Text style={styles.mainTitle}>Mulai hidup lebih{'\n'}teratur</Text>
          <Text style={styles.description}>
            Buat akun KosMate dan kelola kebutuhan kosmu dengan lebih tenang.
          </Text>
        </View>

        {/* ─── Form Card ────────────────────────────────────────── */}
        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Buat akun baru</Text>
          <Text style={styles.cardSubtitle}>
            Lengkapi data berikut untuk mulai menggunakan KosMate.
          </Text>

          {errorMessage && (
            <View style={styles.errorAlert}>
              <Feather name="alert-circle" size={16} color={COLORS.error} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Full Name Field */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Nama lengkap</Text>
              <Text style={styles.asterisk}>*</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Naya Ardhani"
              placeholderTextColor="#B9B5C2"
              value={name}
              onChangeText={(val) => {
                setName(val);
                setErrorMessage(null);
              }}
              autoCapitalize="words"
            />
          </View>

          {/* Email Field */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.asterisk}>*</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="nama@email.com"
              placeholderTextColor="#B9B5C2"
              value={email}
              onChangeText={(val) => {
                setEmail(val);
                setErrorMessage(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Field */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Kata sandi</Text>
              <Text style={styles.asterisk}>*</Text>
            </View>
            <View style={styles.passwordInputWrap}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Minimal 6 karakter"
                placeholderTextColor="#B9B5C2"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  setErrorMessage(null);
                }}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                accessibilityLabel="Toggle password visibility"
              >
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={18}
                  color="#AAA5B0"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Field */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Konfirmasi kata sandi</Text>
              <Text style={styles.asterisk}>*</Text>
            </View>
            <View style={styles.passwordInputWrap}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Ulangi kata sandi"
                placeholderTextColor="#B9B5C2"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(val) => {
                  setConfirmPassword(val);
                  setErrorMessage(null);
                }}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
                accessibilityLabel="Toggle confirm password visibility"
              >
                <Feather
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={18}
                  color="#AAA5B0"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            activeOpacity={0.85}
            onPress={handleRegister}
          >
            <Text style={styles.submitButtonText}>Daftar sekarang</Text>
            <Feather name="chevron-right" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Switch to Login */}
          <View style={styles.switchRow}>
            <Text style={styles.switchPrompt}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.switchLink}>Masuk</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Footer Terms Note ─────────────────────────────────── */}
        <Text style={styles.footerNote}>
          Dengan mendaftar, kamu menyetujui penggunaan KosMate untuk membantu mengelola
          kebutuhan harianmu.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  organicCircleTopRight: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: '#F6E9DC',
    opacity: 0.85,
  },
  organicCircleLeft: {
    position: 'absolute',
    top: 240,
    left: -110,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F3EFE9',
    opacity: 0.6,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    marginLeft: 12,
    letterSpacing: -0.3,
  },
  heroSection: {
    marginBottom: 26,
  },
  subBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9E7852',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.primary,
    lineHeight: 40,
    letterSpacing: -0.6,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#ECE8E3',
    shadowColor: '#312C51',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#8E8A99',
    marginBottom: 20,
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0ED',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.error,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  asterisk: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.error,
    marginLeft: 3,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ECE8E3',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: '#FFFFFF',
  },
  passwordInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#ECE8E3',
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: COLORS.text,
  },
  eyeButton: {
    padding: 6,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 18,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  switchPrompt: {
    fontSize: 13,
    color: '#8E8A99',
  },
  switchLink: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  footerNote: {
    fontSize: 11,
    color: '#AAA5B0',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
    marginTop: 24,
  },
});
