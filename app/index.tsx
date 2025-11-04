import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { PokemonListItem, PokemonDetails } from '../src/types/pokemon';
import { pokemonService } from '../src/services/api';
import PokemonCard from '../src/components/PokemonCard';
import Loading from '../src/components/Loading';
import Error from '../src/components/Error';

export default function Index() {
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const router = useRouter();
  const { width } = useWindowDimensions();

  useEffect(() => {
    loadPokemons();
  }, []);

  const loadPokemons = async (url?: string) => {
    try {
      setError(null);
      const response = await pokemonService.getPokemonList();
      setPokemons(response.results);
      setNextUrl(response.next);
    } catch (err) {
      setError('Erro ao carregar lista de Pokémons');
      console.error('Erro ao carregar Pokémons:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMore = async () => {
    if (!nextUrl || loadingMore) return;

    try {
      setLoadingMore(true);
      // Extrair offset da URL
      const url = new URL(nextUrl);
      const offset = parseInt(url.searchParams.get('offset') || '0');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      
      const response = await pokemonService.getPokemonList(offset, limit);
      setPokemons((prev) => [...prev, ...response.results]);
      setNextUrl(response.next);
    } catch (err) {
      console.error('Erro ao carregar mais Pokémons:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPokemons([]);
    setNextUrl(null);
    loadPokemons();
  };

  const handlePokemonPress = (pokemon: PokemonDetails) => {
    if (pokemon && pokemon.id) {
      router.push(`/pokemon/${pokemon.id}`);
    }
  };

  const numColumns = width > 600 ? 3 : 2;

  const renderPokemon = ({ item }: { item: PokemonListItem }) => {
    if (numColumns > 1) {
      return (
        <View style={{ flex: 1 }}>
          <PokemonCard pokemon={item} onPress={handlePokemonPress} />
        </View>
      );
    }
    return <PokemonCard pokemon={item} onPress={handlePokemonPress} />;
  };

  const keyExtractor = (item: PokemonListItem) => item.name;

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={() => loadPokemons()} />;
  }

  return (
    <View style={styles.container} accessibilityLabel="Lista de Pokémons">
      <FlatList
        data={pokemons}
        renderItem={renderPokemon}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footer}>
              <Loading />
            </View>
          ) : null
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  listContent: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  footer: {
    paddingVertical: 20,
  },
});
