import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

export default function Error({ message = 'Ocorreu um erro ao carregar os dados.', onRetry }: ErrorProps) {
  return (
    <View style={styles.container} accessibilityLabel="Erro ao carregar dados">
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          style={styles.button}
          onPress={onRetry}
          accessibilityLabel="Tentar novamente"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      )}
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
  message: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

