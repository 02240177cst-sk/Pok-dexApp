
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

export type TeamPokemon = {
  id: number;
  name: string;
  image: string;
  types: string[];
};

type TeamContextType = {
  team: TeamPokemon[];
  addPokemon: (pokemon: TeamPokemon) => string;
  removePokemon: (id: number) => void;
};

const TeamContext = createContext<TeamContextType | undefined>(undefined);
const STORAGE_KEY = 'my-pokemon-team';

export function TeamProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [team, setTeam] = useState<TeamPokemon[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load the saved team when the app starts.
  useEffect(() => {
    async function loadTeam() {
      try {
        const savedTeam = await AsyncStorage.getItem(STORAGE_KEY);

        if (savedTeam) {
          setTeam(JSON.parse(savedTeam));
        }
      } catch (error) {
        console.error('Could not load team:', error);
      } finally {
        setLoaded(true);
      }
    }

    loadTeam();
  }, []);

  // Save the team whenever it changes.
  useEffect(() => {
    if (!loaded) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(team)).catch(
      (error) => console.error('Could not save team:', error)
    );
  }, [team, loaded]);

  function addPokemon(pokemon: TeamPokemon): string {
    if (team.some((item) => item.id === pokemon.id)) {
      return 'already';
    }

    if (team.length >= 6) {
      return 'full';
    }

    setTeam([...team, pokemon]);
    return 'added';
  }

  function removePokemon(id: number) {
    setTeam((currentTeam) =>
      currentTeam.filter((pokemon) => pokemon.id !== id)
    );
  }

  return (
    <TeamContext.Provider value={{ team, addPokemon, removePokemon }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);

  if (!context) {
    throw new Error('useTeam must be used inside TeamProvider');
  }

  return context;
}
