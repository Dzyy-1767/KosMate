import { Feather } from '@expo/vector-icons';
import { DateTimePicker, Host } from '@expo/ui/jetpack-compose';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '../constants/colors';
import { formatDateForDisplay, parseLocalDate, toLocalDateString, type DatePickerFieldProps } from './DatePickerField.types';

export function DatePickerField({ value, onChange }: DatePickerFieldProps) {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Pilih tanggal transaksi, ${formatDateForDisplay(value)}`}
        style={styles.trigger}
        onPress={() => setIsCalendarVisible((visible) => !visible)}
      >
        <Text style={styles.dateText}>{formatDateForDisplay(value)}</Text>
        <Feather name="calendar" size={18} color={COLORS.primary} />
      </TouchableOpacity>
      {isCalendarVisible && (
        <View style={styles.calendar}>
          <Host matchContents={{ vertical: true }} style={styles.host} colorScheme="light" seedColor={COLORS.primary}>
            <DateTimePicker
              displayedComponents="date"
              initialDate={parseLocalDate(value).toISOString()}
              variant="picker"
              showVariantToggle={false}
              color={COLORS.primary}
              onDateSelected={(selectedDate) => onChange(toLocalDateString(selectedDate))}
            />
          </Host>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E6E2EA',
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: { color: COLORS.text, fontSize: 15 },
  calendar: { marginTop: 10, borderRadius: 12, overflow: 'hidden' },
  host: { width: '100%', backgroundColor: '#FFFFFF' },
});
