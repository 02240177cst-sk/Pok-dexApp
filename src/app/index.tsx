
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchPokemonPage } from '../services/pokeApi';

type Pokemon = {
  id: number;
  name: string;
  image: string;
};

export default function HomeScreen() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(177);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  async function loadPokemon() {
    if (loading || !hasMore) return;

    setLoading(true);
    setError('');

    try {
      const page = await fetchPokemonPage(offset, 20);

      setPokemon((previous) => {
        const combined = [...previous, ...page.results];
        return Array.from(
          new Map(combined.map((item) => [item.id, item])).values()
        );
      });

      setOffset((previous) => previous + page.results.length);
      setHasMore(Boolean(page.next));
    } catch {
      setError('Unable to load Pokémon. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPokemon();
  }, []);

  const filteredPokemon = pokemon.filter((item) => {
    const term = search.trim().toLowerCase();

    return (
      item.name.toLowerCase().includes(term) ||
      String(item.id).includes(term)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}> Sonam's Pokédex</Text>
        <Text style={styles.subtitle}>
          Discover your favourite Pokémon!
        </Text>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search Pokémon by name or number..."
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />

      <View style={styles.buttons}>
        <Pressable
          style={styles.button}
          onPress={() => router.push('/team')}
        >
          <Text style={styles.buttonText}>My Team</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => router.push('/quiz')}
        >
          <Text style={styles.buttonText}>Pokémon Quiz</Text>
        </Pressable>
      </View>

      {error !== '' && (
        <Pressable onPress={loadPokemon} style={styles.errorBox}>
          <Text style={styles.errorText}>{error} Tap to retry.</Text>
        </Pressable>
      )}

      <FlatList
        data={filteredPokemon}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/details',
                params: {
                  id: String(item.id),
                  name: item.name,
                },
              })
            }
          >
            <Text style={styles.number}>
              #{String(item.id).padStart(3, '0')}
            </Text>

            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="contain"
            />

            <Text style={styles.name}>
              {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            </Text>
          </Pressable>
        )}
        onEndReached={() => {
          if (!search.trim()) loadPokemon();
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          loading ? null : (
            <Text style={styles.empty}>
              {search ? 'No Pokémon found.' : 'No Pokémon loaded yet.'}
            </Text>
          )
        }
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color="#e63946"
              style={styles.loader}
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    backgroundColor: '#008577',
    padding: 20,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#fff',
    fontSize: 15,
    marginTop: 4,
  },
  search: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#222',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#273746',
    padding: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    width: '48%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
  },
  number: {
    alignSelf: 'flex-start',
    color: '#777',
    fontWeight: 'bold',
  },
  image: {
    width: 125,
    height: 125,
  },
  name: {
    color: '#222',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 5,
  },
  loader: {
    margin: 20,
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: '#555',
  },
  errorBox: {
    padding: 12,
  },
  errorText: {
    color: '#c0392b',
    textAlign: 'center',
  },
});
