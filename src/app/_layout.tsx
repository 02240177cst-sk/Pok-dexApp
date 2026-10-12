
import { Stack } from 'expo-router';
import { TeamProvider } from '../context/TeamContext';

export default function RootLayout() {
  return (
    <TeamProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: 'Pokédex', headerShown: false }}
        />
        <Stack.Screen
          name="explore"
          options={{ title: 'Explore' }}
        />
        <Stack.Screen
          name="details"
          options={{ title: 'Pokémon Details' }}
        />
        <Stack.Screen
          name="team"
          options={{ title: 'My Team' }}
        />
        <Stack.Screen
          name="quiz"
          options={{ title: "Who's That Pokémon?" }}
        />
      </Stack>
    </TeamProvider>
  );
}
