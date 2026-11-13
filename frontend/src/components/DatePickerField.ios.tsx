import { Feather } from '@expo/vector-icons';
import { DatePicker, Host } from '@expo/ui/swift-ui';
import { datePickerStyle } from '@expo/ui/swift-ui/modifiers';
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
          <Host style={styles.host} colorScheme="light" seedColor={COLORS.primary}>
            <DatePicker
              title="Pilih tanggal transaksi"
              selection={parseLocalDate(value)}
              displayedComponents={['date']}
              modifiers={[datePickerStyle('graphical')]}
              onDateChange={(selectedDate) => onChange(toLocalDateString(selectedDate))}
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
  host: { height: 360, backgroundColor: '#FFFFFF' },
});
