import { View, Text, StyleSheet } from 'react-native';

export default function NeedsScreen() {
  return (
    <View style={styles.container}>
      <Text>Needs Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
