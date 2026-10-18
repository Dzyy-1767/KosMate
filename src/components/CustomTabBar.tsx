import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../constants/colors';
import { useKosMate } from '../context/KosMateContext';

type TabsProps = React.ComponentProps<typeof Tabs>;
export type CustomTabBarProps = Parameters<NonNullable<TabsProps['tabBar']>>[0];

export function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { openQuickSheet } = useKosMate();

  const leftRoutes = state.routes.filter((r) => r.name === 'index' || r.name === 'needs');
  const rightRoutes = state.routes.filter((r) => r.name === 'expenses' || r.name === 'budget');

  const renderTabButton = (route: (typeof state.routes)[0]) => {
    const isFocused = state.routes[state.index]?.key === route.key;
    const descriptor = descriptors[route.key];
    const options = descriptor?.options || {};

    let label = options.title ?? route.name;
    let iconName: keyof typeof Feather.glyphMap = 'home';

    if (route.name === 'index') {
      label = 'Dashboard';
      iconName = 'home';
    } else if (route.name === 'needs') {
      label = 'List';
      iconName = 'list';
    } else if (route.name === 'expenses') {
      label = 'Keuangan';
      iconName = 'credit-card';
    } else if (route.name === 'budget') {
      label = 'Profil';
      iconName = 'user';
    }

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    const activeColor = COLORS.primary;
    const inactiveColor = '#AAA5B0';
    const color = isFocused ? activeColor : inactiveColor;

    return (
      <TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarButtonTestID}
        onPress={onPress}
        style={styles.tabButton}
        activeOpacity={0.7}
      >
        <Feather name={iconName} size={21} color={color} />
        <Text style={[styles.tabLabel, { color, fontWeight: isFocused ? '700' : '500' }]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.barContainer,
        {
          paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 14 : 10),
        },
      ]}
    >
      {/* Left 2 Tabs: Dashboard, List */}
      <View style={styles.tabGroup}>
        {leftRoutes.map((route) => renderTabButton(route))}
      </View>

      {/* Center Floating Plus Button */}
      <View style={styles.centerContainer}>
        <TouchableOpacity
          style={styles.plusNav}
          activeOpacity={0.85}
          onPress={() => openQuickSheet('quick')}
          accessibilityLabel="Tambah transaksi"
          accessibilityRole="button"
        >
          <Feather name="plus" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Right 2 Tabs: Keuangan, Profil */}
      <View style={styles.tabGroup}>
        {rightRoutes.map((route) => renderTabButton(route))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopWidth: 1,
    borderTopColor: '#ECE8E3',
    paddingTop: 10,
    paddingHorizontal: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#312C51',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 12,
  },
  tabGroup: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 54,
    gap: 4,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusNav: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    borderWidth: 4,
    borderColor: '#FAF8F5',
    shadowColor: '#312C51',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
});
