import { View, Text, StyleSheet } from 'react-native';

interface BudgetCardProps {
  total: number;
  spent: number;
  remaining: number;
}

export function BudgetCard({ total, spent, remaining }: BudgetCardProps) {
  return (
    <View style={styles.container}>
      <Text>Budget Card</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
  },
});
