import axios from 'axios';
import { PokemonListResponse, PokemonDetails } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const pokemonService = {
  getPokemonList: async (offset: number = 0, limit: number = 20): Promise<PokemonListResponse> => {
    try {
      const response = await api.get<PokemonListResponse>('/', {
        params: { offset, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar lista de Pokémons:', error);
      throw error;
    }
  },

  getPokemonDetails: async (url: string): Promise<PokemonDetails> => {
    try {
      // Se a URL já é completa, usa diretamente, senão usa a base URL
      const fullUrl = url.startsWith('http') ? url : `${BASE_URL}/${url}`;
      const response = await axios.get<PokemonDetails>(fullUrl);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do Pokémon:', error);
      throw error;
    }
  },

  getPokemonById: async (id: number): Promise<PokemonDetails> => {
    try {
      const response = await api.get<PokemonDetails>(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar Pokémon por ID:', error);
      throw error;
    }
  },
};

