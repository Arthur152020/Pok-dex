import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function Loading() {
  return (
    <View style={styles.container} accessibilityLabel="Carregando dados">
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

