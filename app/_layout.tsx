import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3B82F6',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Pokédex',
          headerTitle: 'Pokédex',
        }}
      />
      <Stack.Screen
        name="pokemon/[id]"
        options={{
          title: 'Detalhes',
          headerTitle: 'Detalhes do Pokémon',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
