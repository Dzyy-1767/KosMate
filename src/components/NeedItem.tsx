import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Need } from '../types/need';

interface NeedItemProps {
  need: Need;
  onPress?: () => void;
}

export function NeedItem({ need, onPress }: NeedItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text>{need.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
