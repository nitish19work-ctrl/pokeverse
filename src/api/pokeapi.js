import axios from 'axios';
import { POKEAPI_BASE } from '../data/constants';

const api = axios.create({
  baseURL: POKEAPI_BASE,
  timeout: 15000,
});

const cache = new Map();

function getCached(key) {
  const item = cache.get(key);
  if (item && Date.now() - item.timestamp < 300000) return item.data;
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function fetchPokemonList(limit = 24, offset = 0) {
  const key = `list-${limit}-${offset}`;
  const cached = getCached(key);
  if (cached) return cached;

  const { data } = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
  setCache(key, data);
  return data;
}

export async function fetchAllPokemonNames() {
  const key = 'all-names';
  const cached = getCached(key);
  if (cached) return cached;

  const { data } = await api.get('/pokemon?limit=1025');
  setCache(key, data.results);
  return data.results;
}

export async function fetchPokemon(identifier) {
  const key = `pokemon-${identifier}`;
  const cached = getCached(key);
  if (cached) return cached;

  const { data } = await api.get(`/pokemon/${identifier}`);
  setCache(key, data);
  return data;
}

export async function fetchPokemonSpecies(identifier) {
  const key = `species-${identifier}`;
  const cached = getCached(key);
  if (cached) return cached;

  const { data } = await api.get(`/pokemon-species/${identifier}`);
  setCache(key, data);
  return data;
}

export async function fetchEvolutionChain(url) {
  const key = `evo-${url}`;
  const cached = getCached(key);
  if (cached) return cached;

  const { data } = await axios.get(url);
  setCache(key, data);
  return data;
}

export async function fetchType(typeName) {
  const key = `type-${typeName}`;
  const cached = getCached(key);
  if (cached) return cached;

  const { data } = await api.get(`/type/${typeName}`);
  setCache(key, data);
  return data;
}

export async function fetchPokemonBatch(identifiers) {
  const results = await Promise.allSettled(
    identifiers.map((id) => fetchPokemon(typeof id === 'object' ? id.name : id))
  );
  return results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value);
}

export function getPokemonImage(pokemon, shiny = false) {
  if (shiny) {
    return (
      pokemon.sprites.other?.['official-artwork']?.front_shiny ||
      pokemon.sprites.front_shiny ||
      pokemon.sprites.other?.home?.front_shiny
    );
  }
  return (
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.other?.home?.front_default ||
    pokemon.sprites.front_default
  );
}

export function getPokemonIdFromUrl(url) {
  const parts = url.split('/');
  return parseInt(parts[parts.length - 2], 10);
}

export function formatPokemonName(name) {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function extractIdFromUrl(url) {
  return getPokemonIdFromUrl(url);
}
