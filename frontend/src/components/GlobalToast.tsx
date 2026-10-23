import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useKosMate } from '../context/KosMateContext';

export function GlobalToast() {
  const { toast } = useKosMate();
  const insets = useSafeAreaInsets();

  if (!toast) return null;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        { bottom: insets.bottom + 84 },
      ]}
    >
      <View style={styles.toastBox}>
        <Text style={styles.toastText}>{toast}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastBox: {
    backgroundColor: 'rgba(37, 35, 58, 0.94)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
