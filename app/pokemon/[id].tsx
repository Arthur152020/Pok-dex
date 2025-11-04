import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { pokemonService } from '../../src/services/api';
import { PokemonDetails } from '../../src/types/pokemon';
import Loading from '../../src/components/Loading';
import Error from '../../src/components/Error';

export default function PokemonDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    loadPokemonDetails();
  }, [id]);

  const loadPokemonDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const details = await pokemonService.getPokemonById(parseInt(id));
      setPokemon(details);
    } catch (err) {
      setError('Erro ao carregar detalhes do Pokémon');
      console.error('Erro ao carregar detalhes:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !pokemon) {
    return <Error message={error || 'Pokémon não encontrado'} onRetry={loadPokemonDetails} />;
  }

  const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const imageUri = pokemon.sprites?.front_default || '';
  const heightInMeters = (pokemon.height / 10).toFixed(2);
  const weightInKg = (pokemon.weight / 10).toFixed(2);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      accessibilityLabel={`Detalhes do Pokémon ${pokemonName}`}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{pokemonName}</Text>
        <Text style={styles.id}>#{pokemon.id.toString().padStart(3, '0')}</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={[styles.image, { width: width > 600 ? 300 : 200 }]}
          accessibilityLabel={`Imagem do ${pokemonName}`}
          resizeMode="contain"
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Altura:</Text>
            <Text style={styles.infoValue}>{heightInMeters} m</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Peso:</Text>
            <Text style={styles.infoValue}>{weightInKg} kg</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipos</Text>
          <View style={styles.typesContainer}>
            {pokemon.types.map((type, index) => (
              <View key={index} style={styles.typeBadge}>
                <Text style={styles.typeText}>
                  {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {pokemon.abilities && pokemon.abilities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Habilidades</Text>
            {pokemon.abilities.map((ability, index) => (
              <View key={index} style={styles.abilityItem}>
                <Text style={styles.abilityText}>
                  {ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)}
                </Text>
                {ability.is_hidden && (
                  <Text style={styles.hiddenAbility}> (Habilidade Oculta)</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {pokemon.stats && pokemon.stats.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estatísticas</Text>
            {pokemon.stats.map((stat, index) => (
              <View key={index} style={styles.statRow}>
                <Text style={styles.statLabel}>
                  {stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1).replace('-', ' ')}:
                </Text>
                <View style={styles.statBarContainer}>
                  <View style={[styles.statBar, { width: `${(stat.base_stat / 255) * 100}%` }]} />
                </View>
                <Text style={styles.statValue}>{stat.base_stat}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  id: {
    fontSize: 24,
    fontWeight: '600',
    color: '#6B7280',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    height: 200,
    width: 200,
  },
  infoContainer: {
    marginTop: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  abilityItem: {
    marginBottom: 8,
  },
  abilityText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  hiddenAbility: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    width: 120,
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  statValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
});

