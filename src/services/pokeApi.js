
const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemonPage(offset = 0, limit = 20) {
  const response = await fetch(
    `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Pokémon list.');
  }

  const data = await response.json();

  const results = data.results.map((pokemon, index) => {
    const id = offset + index + 1;

    return {
      id,
      name: pokemon.name,
      url: pokemon.url,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    };
  });

  return {
    results,
    next: data.next,
  };
}

export async function fetchPokemonDetails(nameOrId) {
  const response = await fetch(
    `${BASE_URL}/pokemon/${String(nameOrId).trim().toLowerCase()}`
  );

  if (!response.ok) {
    throw new Error('Pokémon not found.');
  }

  const data = await response.json();

  return {
    id: data.id,
    name: data.name,
    image:
      data.sprites.other?.['official-artwork']?.front_default ||
      data.sprites.front_default,
    types: data.types.map((item) => item.type.name),
    abilities: data.abilities.map((item) => item.ability.name),
    height: data.height / 10,
    weight: data.weight / 10,
    stats: data.stats.map((item) => ({
      name: item.stat.name,
      value: item.base_stat,
    })),
    sprites: data.sprites,
  };
}

export async function searchPokemon(query) {
  const searchTerm = String(query).trim().toLowerCase();

  if (!searchTerm) {
    return null;
  }

  try {
    return await fetchPokemonDetails(searchTerm);
  } catch {
    return null;
  }
}
