import { Tabs } from 'expo-router';
import React from 'react';

import { CustomTabBar } from './CustomTabBar';

export default function AppTabs() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="needs" options={{ title: 'List' }} />
      <Tabs.Screen name="expenses" options={{ title: 'Keuangan' }} />
      <Tabs.Screen name="budget" options={{ title: 'Profil' }} />

      {/* Hide secondary routes from tab bar */}
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="expenses/add" options={{ href: null }} />
      <Tabs.Screen name="expenses/[id]" options={{ href: null }} />
      <Tabs.Screen name="needs/add" options={{ href: null }} />
      <Tabs.Screen name="needs/[id]" options={{ href: null }} />
    </Tabs>
  );
}
