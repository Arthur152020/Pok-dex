import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { PokemonListItem, PokemonDetails } from '../types/pokemon';
import { pokemonService } from '../services/api';

interface PokemonCardProps {
  pokemon: PokemonListItem;
  onPress: (pokemon: PokemonDetails) => void;
}

export default function PokemonCard({ pokemon, onPress }: PokemonCardProps) {
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadPokemonDetails();
  }, []);

  const loadPokemonDetails = async () => {
    try {
      setLoading(true);
      setError(false);
      const details = await pokemonService.getPokemonDetails(pokemon.url);
      setPokemonDetails(details);
    } catch (err) {
      setError(true);
      console.error('Erro ao carregar detalhes do Pokémon:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    if (pokemonDetails) {
      onPress(pokemonDetails);
    }
  };

  const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const imageUri = pokemonDetails?.sprites?.front_default;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      disabled={loading || error || !pokemonDetails}
      accessibilityLabel={`Pokémon ${pokemonName}`}
      accessibilityRole="button"
      accessibilityHint="Toque para ver detalhes do Pokémon"
    >
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#3B82F6" />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro</Text>
        </View>
      )}

      {pokemonDetails && !loading && !error && (
        <>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            accessibilityLabel={`Imagem do ${pokemonName}`}
            resizeMode="contain"
          />
          <Text style={styles.name}>{pokemonName}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 4,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 160,
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
  },
});

