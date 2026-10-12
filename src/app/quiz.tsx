
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { fetchPokemonDetails } from '../services/pokeApi';

type Choice = {
  id: number;
  name: string;
};

export default function QuizScreen() {
  const [pokemon, setPokemon] = useState<any>(null);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadQuestion() {
    setLoading(true);
    setError('');
    setPokemon(null);
    setChoices([]);
    setSelected(null);

    try {
      // Choose a random Pokémon from the first 151.
      const answerId = Math.floor(Math.random() * 151) + 1;
      const answer = await fetchPokemonDetails(answerId);

      // Create three different wrong answers.
      const wrongIds = new Set<number>();
      while (wrongIds.size < 3) {
        const id = Math.floor(Math.random() * 151) + 1;
        if (id !== answerId) wrongIds.add(id);
      }

      const wrongPokemon = await Promise.all(
        Array.from(wrongIds).map((id) => fetchPokemonDetails(id))
      );

      const options: Choice[] = [
        { id: answer.id, name: answer.name },
        ...wrongPokemon.map((item) => ({
          id: item.id,
          name: item.name,
        })),
      ];

      // Shuffle the four choices.
      options.sort(() => Math.random() - 0.5);

      setPokemon(answer);
      setChoices(options);
    } catch {
      setError('Could not load the quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuestion();
  }, []);

  function selectAnswer(name: string) {
    if (selected !== null || !pokemon) return;

    setSelected(name);

    if (name === pokemon.name) {
      setScore((current) => current + 1);
    }
  }

  function nextQuestion() {
    setRound((current) => current + 1);
    loadQuestion();
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e3350d" />
        <Text style={styles.loadingText}>Finding a Pokémon...</Text>
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || 'No question available.'}</Text>
        <Pressable style={styles.nextButton} onPress={loadQuestion}>
          <Text style={styles.nextText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  const correct = selected === pokemon.name;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Who's That Pokémon?</Text>

      <View style={styles.scoreRow}>
        <Text style={styles.score}>Round: {round}</Text>
        <Text style={styles.score}>Score: {score}</Text>
      </View>

      <Text style={styles.instruction}>
        Look at the silhouette and guess the Pokémon!
      </Text>

      <View style={styles.pokemonBox}>
        <Image
          source={{ uri: pokemon.image }}
          style={[
            styles.pokemonImage,
            selected === null && styles.silhouette,
          ]}
        />
        {selected === null && (
          <Text style={styles.mystery}>WHO'S THAT POKÉMON?</Text>
        )}
      </View>

      <Text style={styles.chooseText}>Choose your answer:</Text>

      {choices.map((choice) => {
        let buttonColor = '#ffffff';
        let textColor = '#222222';

        if (selected !== null && choice.name === pokemon.name) {
          buttonColor = '#27864a';
          textColor = '#ffffff';
        } else if (selected === choice.name) {
          buttonColor = '#d93025';
          textColor = '#ffffff';
        }

        return (
          <Pressable
            key={choice.id}
            style={[styles.choice, { backgroundColor: buttonColor }]}
            onPress={() => selectAnswer(choice.name)}
            disabled={selected !== null}
          >
            <Text style={[styles.choiceText, { color: textColor }]}>
              {choice.name.charAt(0).toUpperCase() + choice.name.slice(1)}
            </Text>
          </Pressable>
        );
      })}

      {selected !== null && (
        <View style={styles.resultBox}>
          <Text style={styles.result}>
            {correct ? '🎉 Correct! Well done!' : '❌ Not quite!'}
          </Text>

          <Text style={styles.answer}>
            The answer is {pokemon.name.toUpperCase()}.
          </Text>

          <Pressable style={styles.nextButton} onPress={nextQuestion}>
            <Text style={styles.nextText}>Next Question →</Text>
          </Pressable>

          <Pressable
            style={styles.restartButton}
            onPress={() => {
              setScore(0);
              setRound(1);
              loadQuestion();
            }}
          >
            <Text style={styles.restartText}>Restart Quiz</Text>
          </Pressable>
        </View>
      )}
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
    paddingBottom: 35,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#555555',
    fontSize: 16,
  },
  error: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 18,
    marginBottom: 12,
  },
  score: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#e3350d',
  },
  instruction: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 10,
  },
  pokemonBox: {
    width: 260,
    height: 240,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  pokemonImage: {
    width: 210,
    height: 210,
  },
  silhouette: {
    tintColor: '#222222',
  },
  mystery: {
    position: 'absolute',
    bottom: 10,
    fontWeight: 'bold',
    fontSize: 12,
    color: '#777777',
  },
  chooseText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'stretch',
    marginTop: 12,
    marginBottom: 10,
  },
  choice: {
    width: '100%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dddddd',
    alignItems: 'center',
  },
  choiceText: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  resultBox: {
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  result: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  answer: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    textTransform: 'capitalize',
  },
  nextButton: {
    backgroundColor: '#e3350d',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  nextText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  restartButton: {
    padding: 12,
    marginTop: 8,
  },
  restartText: {
    color: '#e3350d',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
