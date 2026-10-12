
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useTeam } from '../context/TeamContext';
import { fetchPokemonDetails } from '../services/pokeApi';

export default function DetailsScreen() {
  const { id, name } = useLocalSearchParams<{
    id?: string;
    name?: string;
  }>();

  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { team, addPokemon } = useTeam();

  useEffect(() => {
    let active = true;

    async function loadDetails() {
      try {
        setLoading(true);
        setError('');

        const data = await fetchPokemonDetails(id || name || '1');

        if (active) setPokemon(data);
      } catch {
        if (active) setError('Could not load Pokémon details.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDetails();

    return () => {
      active = false;
    };
  }, [id, name]);

  function handleAddToTeam() {
    if (!pokemon) return;

    const result = addPokemon({
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,
      types: pokemon.types,
    });

    if (result === 'added') {
      Alert.alert(
        'Success!',
        `${pokemon.name} has been added to your team.`
      );
    } else if (result === 'already') {
      Alert.alert(
        'Already Added',
        'This Pokémon is already in your team.'
      );
    } else {
      Alert.alert(
        'Team Full',
        'Your team can only contain six Pokémon. Remove one before adding another.'
      );
    }
  }

  if (loading) {
    return <ActivityIndicator size="large" style={styles.center} />;
  }

  if (error || !pokemon) {
    return (
      <Text style={styles.center}>
        {error || 'Pokémon not found.'}
      </Text>
    );
  }

  const isInTeam = team.some((item) => item.id === pokemon.id);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>
        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
      </Text>

      <Text style={styles.number}>
        #{String(pokemon.id).padStart(3, '0')}
      </Text>

      <Image source={{ uri: pokemon.image }} style={styles.image} />

      <Text style={styles.heading}>Types</Text>
      <Text style={styles.text}>{pokemon.types.join(', ')}</Text>

      <Text style={styles.heading}>Abilities</Text>
      <Text style={styles.text}>{pokemon.abilities.join(', ')}</Text>

      <Text style={styles.heading}>Physical information</Text>
      <Text style={styles.text}>Height: {pokemon.height} m</Text>
      <Text style={styles.text}>Weight: {pokemon.weight} kg</Text>

      <Text style={styles.heading}>Base stats</Text>

      {pokemon.stats.map(
        (stat: { name: string; value: number }) => (
          <View style={styles.statRow} key={stat.name}>
            <Text style={styles.statName}>
              {stat.name.replace('-', ' ')}
            </Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        )
      )}

      <Pressable
        style={[
          styles.teamButton,
          isInTeam && styles.addedButton,
        ]}
        onPress={handleAddToTeam}
      >
        <Text style={styles.teamButtonText}>
          {isInTeam ? '✓ Already in My Team' : '+ Add to My Team'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  content: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 30,
  },
  center: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  number: {
    fontSize: 16,
    color: '#777',
    marginTop: 4,
  },
  image: {
    width: 220,
    height: 220,
  },
  heading: {
    alignSelf: 'stretch',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  text: {
    alignSelf: 'stretch',
    fontSize: 16,
    textTransform: 'capitalize',
    marginBottom: 6,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  statName: {
    textTransform: 'capitalize',
    color: '#333',
  },
  statValue: {
    fontWeight: 'bold',
  },
  teamButton: {
    backgroundColor: '#e3350d',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 26,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  addedButton: {
    backgroundColor: '#27864a',
  },
  teamButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
