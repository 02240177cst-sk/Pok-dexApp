
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useTeam } from '../context/TeamContext';

export default function TeamScreen() {
  const { team, removePokemon } = useTeam();

  function confirmRemove(id: number, name: string) {
    Alert.alert(
      'Remove Pokémon',
      `Do you want to remove ${name} from your team?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removePokemon(id),
        },
      ]
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>My Pokémon Team</Text>

      <Text style={styles.subtitle}>
        {team.length} / 6 Pokémon selected
      </Text>

      <View style={styles.slots}>
        {[0, 1, 2, 3, 4, 5].map((slot) => {
          const pokemon = team[slot];

          return (
            <View style={styles.slot} key={slot}>
              {pokemon ? (
                <>
                  <Image
                    source={{ uri: pokemon.image }}
                    style={styles.image}
                  />

                  <Text style={styles.name} numberOfLines={1}>
                    {pokemon.name}
                  </Text>

                  <Text style={styles.number}>
                    #{String(pokemon.id).padStart(3, '0')}
                  </Text>

                  <Text style={styles.types}>
                    {pokemon.types.join(', ')}
                  </Text>

                  <Pressable
                    style={styles.removeButton}
                    onPress={() =>
                      confirmRemove(pokemon.id, pokemon.name)
                    }
                  >
                    <Text style={styles.removeText}>Remove</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <View style={styles.emptyImage}>
                    <Text style={styles.plus}>+</Text>
                  </View>
                  <Text style={styles.emptyText}>Empty slot</Text>
                </>
              )}
            </View>
          );
        })}
      </View>

      <Text style={styles.footer}>
        Choose Pokémon from the Pokédex and add them to your team.
        Your team can contain a maximum of six Pokémon.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  slots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  slot: {
    width: '48%',
    minHeight: 215,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  image: {
    width: 100,
    height: 100,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginTop: 4,
  },
  number: {
    color: '#777',
    marginTop: 3,
  },
  types: {
    color: '#555',
    textTransform: 'capitalize',
    marginTop: 5,
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#e3350d',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    marginTop: 10,
  },
  removeText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  emptyImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#cccccc',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    fontSize: 38,
    color: '#999999',
  },
  emptyText: {
    color: '#999999',
    marginTop: 12,
  },
  footer: {
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12,
  },
});
