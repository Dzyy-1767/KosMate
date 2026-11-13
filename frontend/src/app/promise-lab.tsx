import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '@/constants/colors';
import { executeTransfer, type TransferInput } from '@/services/transfer';

type LogLabel = 'resolve' | 'reject' | 'then' | 'catch' | 'finally' | 'info';
type TransferDemo = 'success' | 'low-balance' | 'invalid-account';

interface LogEntry {
  id: number;
  label: LogLabel;
  message: string;
  time: string;
}

interface TimingResult {
  parallelMs: number;
  sequentialMs: number;
}

const LOG_COLORS: Record<LogLabel, string> = {
  resolve: COLORS.success,
  reject: COLORS.error,
  then: COLORS.secondary,
  catch: COLORS.error,
  finally: COLORS.warning,
  info: COLORS.textSecondary,
};

// KONSEP #3: Promise buatan ini memberi durasi terukur untuk membandingkan pola eksekusi.
function waitFor(milliseconds: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
}

function getErrorCode(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string') {
    return error.code;
  }
  return 'UNKNOWN_ERROR';
}

export default function PromiseLabScreen() {
  const insets = useSafeAreaInsets();
  const nextLogId = useRef(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [transferRunning, setTransferRunning] = useState(false);
  const [comparisonRunning, setComparisonRunning] = useState(false);
  const [timing, setTiming] = useState<TimingResult | null>(null);

  // KONSEP #3: Log disimpan dalam state bertipe agar label dan urutan proses terlihat di layar.
  const addLog = (label: LogLabel, message: string) => {
    nextLogId.current += 1;
    setLogs((current) => [
      ...current,
      {
        id: nextLogId.current,
        label,
        message,
        time: new Date().toLocaleTimeString('id-ID'),
      },
    ]);
  };

  const clearLogs = () => {
    nextLogId.current = 0;
    setLogs([]);
    setTiming(null);
  };

  // KONSEP #3: Pemanggil mengamati hasil transfer melalui then, catch, dan finally.
  const runTransferDemo = (scenario: TransferDemo) => {
    if (transferRunning || comparisonRunning) return;

    clearLogs();
    setTransferRunning(true);

    const inputs: Record<TransferDemo, TransferInput> = {
      success: { accountNumber: '123456789012', transferAmount: 45000, balance: 100000 },
      'low-balance': { accountNumber: '123456789012', transferAmount: 45000, balance: 30000 },
      'invalid-account': { accountNumber: '12345', transferAmount: 45000, balance: 100000 },
    };

    addLog('info', 'Memulai simulasi transfer.');
    executeTransfer(inputs[scenario])
      .then((receipt) => {
        addLog('resolve', `Transfer berhasil. Referensi: ${receipt.referenceId}.`);
        addLog('then', `Total debit Rp${receipt.totalDebit.toLocaleString('id-ID')}; biaya admin Rp${receipt.adminFee.toLocaleString('id-ID')}.`);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
        addLog('reject', `Promise ditolak (${getErrorCode(error)}).`);
        addLog('catch', message);
      })
      .finally(() => {
        addLog('finally', 'Alur transfer selesai; indikator proses dapat ditutup.');
        setTransferRunning(false);
      });
  };

  // KONSEP #3: Promise.all menjalankan jeda bersama-sama, sedangkan await berurutan menunggu satu per satu.
  const compareDurations = async () => {
    if (transferRunning || comparisonRunning) return;

    clearLogs();
    setComparisonRunning(true);
    try {
      addLog('info', 'Mengukur tiga pekerjaan simulasi (600, 900, dan 450 ms).');

      const parallelStart = Date.now();
      await Promise.all([waitFor(600), waitFor(900), waitFor(450)]);
      const parallelMs = Date.now() - parallelStart;
      addLog('then', `Promise.all selesai dalam ${parallelMs} ms.`);

      const sequentialStart = Date.now();
      await waitFor(600);
      await waitFor(900);
      await waitFor(450);
      const sequentialMs = Date.now() - sequentialStart;
      addLog('then', `Await berurutan selesai dalam ${sequentialMs} ms.`);

      setTiming({ parallelMs, sequentialMs });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Pengukuran gagal.';
      addLog('catch', message);
    } finally {
      addLog('finally', 'Pengukuran durasi selesai.');
      setComparisonRunning(false);
    }
  };

  const busy = transferRunning || comparisonRunning;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Promise Lab</Text>
        <Text style={styles.subtitle}>Amati alur berhasil, gagal, dan proses asynchronous.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeading}>
          <Feather name="send" size={18} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Simulasi transfer</Text>
        </View>
        <Text style={styles.description}>Pilih skenario untuk melihat resolve/reject, lalu then/catch dan finally.</Text>
        <View style={styles.buttonGroup}>
          <ActionButton label="Transfer berhasil / server acak" onPress={() => runTransferDemo('success')} disabled={busy} />
          <ActionButton label="Uji saldo kurang" onPress={() => runTransferDemo('low-balance')} disabled={busy} secondary />
          <ActionButton label="Uji rekening tidak valid" onPress={() => runTransferDemo('invalid-account')} disabled={busy} secondary />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeading}>
          <Feather name="clock" size={18} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Paralel vs berurutan</Text>
        </View>
        <Text style={styles.description}>Tiga tugas dengan durasi simulasi yang sama dijalankan dengan dua pola.</Text>
        <ActionButton label="Bandingkan durasi" onPress={() => void compareDurations()} disabled={busy} />
        {comparisonRunning && <ActivityIndicator style={styles.loader} color={COLORS.primary} />}
        {timing && (
          <View style={styles.timingRow}>
            <TimingCard title="Promise.all" duration={timing.parallelMs} />
            <TimingCard title="Await berurutan" duration={timing.sequentialMs} />
          </View>
        )}
      </View>

      <View style={styles.logHeader}>
        <Text style={styles.cardTitle}>Log proses</Text>
        <TouchableOpacity onPress={clearLogs} disabled={busy} accessibilityRole="button">
          <Text style={[styles.clearText, busy && styles.disabledText]}>Bersihkan</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.logCard}>
        {logs.length === 0 ? (
          <Text style={styles.emptyText}>Belum ada log. Jalankan salah satu simulasi.</Text>
        ) : (
          logs.map((entry) => (
            <View key={entry.id} style={styles.logRow}>
              <Text style={[styles.logLabel, { color: LOG_COLORS[entry.label] }]}>{entry.label}</Text>
              <View style={styles.logContent}>
                <Text style={styles.logMessage}>{entry.message}</Text>
                <Text style={styles.logTime}>{entry.time}</Text>
              </View>
            </View>
          ))
        )}
      </View>
      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  disabled: boolean;
  secondary?: boolean;
}

function ActionButton({ label, onPress, disabled, secondary = false }: ActionButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.actionButton, secondary && styles.secondaryButton, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
    >
      <Text style={[styles.actionText, secondary && styles.secondaryText]}>{label}</Text>
    </TouchableOpacity>
  );
}

interface TimingCardProps {
  title: string;
  duration: number;
}

function TimingCard({ title, duration }: TimingCardProps) {
  return (
    <View style={styles.timingCard}>
      <Text style={styles.timingTitle}>{title}</Text>
      <Text style={styles.timingValue}>{duration} ms</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 20, paddingBottom: 30 },
  header: { marginBottom: 20 },
  title: { color: COLORS.primary, fontSize: 26, fontWeight: '800' },
  subtitle: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 4 },
  card: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  cardHeading: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 10 },
  cardTitle: { color: COLORS.primary, fontSize: 16, fontWeight: '700' },
  description: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18, marginBottom: 14 },
  buttonGroup: { gap: 9 },
  actionButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14, paddingVertical: 11, borderRadius: 12, backgroundColor: COLORS.primary },
  actionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', textAlign: 'center' },
  secondaryButton: { backgroundColor: '#F3F0F7' },
  secondaryText: { color: COLORS.primary },
  disabledButton: { opacity: 0.5 },
  disabledText: { opacity: 0.5 },
  loader: { marginTop: 14 },
  timingRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  timingCard: { flex: 1, padding: 12, borderRadius: 12, backgroundColor: '#F7F5F8' },
  timingTitle: { color: COLORS.textSecondary, fontSize: 11 },
  timingValue: { color: COLORS.primary, fontSize: 17, fontWeight: '800', marginTop: 5 },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 2, marginBottom: 10 },
  clearText: { color: COLORS.secondary, fontSize: 12, fontWeight: '700', padding: 6 },
  logCard: { backgroundColor: COLORS.surface, borderRadius: 18, paddingHorizontal: 14, borderWidth: 1, borderColor: COLORS.border },
  emptyText: { color: COLORS.textSecondary, fontSize: 13, textAlign: 'center', paddingVertical: 24 },
  logRow: { flexDirection: 'row', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1EEF2' },
  logLabel: { width: 58, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', paddingTop: 1 },
  logContent: { flex: 1 },
  logMessage: { color: COLORS.text, fontSize: 12, lineHeight: 17 },
  logTime: { color: COLORS.textSecondary, fontSize: 10, marginTop: 4 },
  bottomSpace: { height: 24 },
});
