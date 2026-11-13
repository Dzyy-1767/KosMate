import { Tabs } from 'expo-router';
import React from 'react';

import { CustomTabBar } from '@/components/CustomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="needs" options={{ title: 'List' }} />
      <Tabs.Screen name="recommendations" options={{ title: 'Hemat' }} />
      <Tabs.Screen name="expenses" options={{ title: 'Keuangan' }} />
      <Tabs.Screen name="market" options={{ title: 'Info Harian' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
