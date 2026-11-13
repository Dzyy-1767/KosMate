import React, { createElement } from 'react';

import { type DatePickerFieldProps } from './DatePickerField.types';

export function DatePickerField({ value, onChange }: DatePickerFieldProps) {
  // Di web, gunakan date input browser agar pemilihan tanggal tetap memakai kalender bawaan.
  return createElement('input', {
    type: 'date',
    value,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.currentTarget.value),
    'aria-label': 'Tanggal transaksi',
    style: {
      boxSizing: 'border-box',
      width: '100%',
      minHeight: 48,
      padding: '12px 14px',
      border: '1px solid #E6E2EA',
      borderRadius: 12,
      backgroundColor: '#FAF8F5',
      color: '#312C51',
      fontSize: 15,
    },
  });
}
