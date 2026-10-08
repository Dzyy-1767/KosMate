import { View, Text, StyleSheet } from 'react-native';

export default function AddNeedScreen() {
  return (
    <View style={styles.container}>
      <Text>Add Need Screen</Text>
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
