import axios from 'axios';
import { POKEAPI_BASE } from '../data/constants';
import { classifyPokemonForm } from '../utils/pokemonForms';

const api = axios.create({
  baseURL: POKEAPI_BASE,
  timeout: 20000,
});

const cache = new Map();
const CACHE_TTL = 600000;

function getCached(key) {
  const item = cache.get(key);
  if (item && Date.now() - item.timestamp < CACHE_TTL) return item.data;
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

async function requestWithRetry(requestFn, retries = 2) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

export async function fetchPokemonList(limit = 24, offset = 0) {
  const key = `list-${limit}-${offset}`;
  const cached = getCached(key);
  if (cached) return cached;

  const { data } = await requestWithRetry(() =>
    api.get(`/pokemon?limit=${limit}&offset=${offset}`)
  );
  setCache(key, data);
  return data;
}

export async function fetchAllPokemonNames() {
  return fetchAllPokemonEntries();
}

export async function fetchAllPokemonEntries() {
  const key = 'all-entries';
  const cached = getCached(key);
  if (cached) return cached;

  const { data } = await requestWithRetry(() => api.get('/pokemon?limit=2000'));
  const entries = data.results.map((entry, index) => {
    const id = getPokemonIdFromUrl(entry.url);
    const form = classifyPokemonForm(entry.name);
    return { ...entry, id, form };
  });
  setCache(key, entries);
  return entries;
}

export async function fetchPokemon(identifier) {
  const key = `pokemon-${identifier}`;
  const cached = getCached(key);
  if (cached) return cached;

  const { data } = await requestWithRetry(() => api.get(`/pokemon/${identifier}`));
  setCache(key, data);
  return data;
}

export async function fetchPokemonSpecies(identifier) {
  const key = `species-${identifier}`;
  const cached = getCached(key);
  if (cached) return cached;

  const { data } = await requestWithRetry(() =>
    api.get(`/pokemon-species/${identifier}`)
  );
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

  const { data } = await requestWithRetry(() => api.get(`/type/${typeName}`));
  setCache(key, data);
  return data;
}

export async function fetchAbility(name) {
  const key = `ability-${name}`;
  const cached = getCached(key);
  if (cached) return cached;

  const { data } = await requestWithRetry(() => api.get(`/ability/${name}`));
  setCache(key, data);
  return data;
}

export async function fetchMove(name) {
  const key = `move-${name}`;
  const cached = getCached(key);
  if (cached) return cached;

  const { data } = await requestWithRetry(() => api.get(`/move/${name}`));
  setCache(key, data);
  return data;
}

export async function fetchAllAbilities() {
  const key = 'all-abilities';
  const cached = getCached(key);
  if (cached) return cached;

  const { data } = await requestWithRetry(() => api.get('/ability?limit=500'));
  setCache(key, data.results);
  return data.results;
}

export async function fetchAllMoves() {
  const key = 'all-moves';
  const cached = getCached(key);
  if (cached) return cached;

  const { data } = await requestWithRetry(() => api.get('/move?limit=1000'));
  setCache(key, data.results);
  return data.results;
}

export async function fetchPokemonVarieties(species) {
  if (!species?.varieties) return [];
  const results = await Promise.allSettled(
    species.varieties.map((v) => fetchPokemon(v.pokemon.name))
  );
  return results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
}

export async function globalSearch(query, entries = []) {
  const q = query.toLowerCase().trim();
  if (!q) return { pokemon: [], abilities: [], moves: [], types: [] };

  const pokemonMatches = entries
    .filter((e) => e.name.includes(q))
    .slice(0, 20);

  const [abilities, moves] = await Promise.all([
    fetchAllAbilities().catch(() => []),
    fetchAllMoves().catch(() => []),
  ]);

  const abilityMatches = abilities
    .filter((a) => a.name.includes(q))
    .slice(0, 8);

  const moveMatches = moves
    .filter((m) => m.name.includes(q.replace(/\s/g, '-')))
    .slice(0, 8);

  const typeMatches = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
  ].filter((t) => t.includes(q));

  return {
    pokemon: pokemonMatches,
    abilities: abilityMatches,
    moves: moveMatches,
    types: typeMatches,
  };
}

export async function fetchPokemonBatch(identifiers) {
  const results = await Promise.allSettled(
    identifiers.map((id) => fetchPokemon(typeof id === 'object' ? id.name : id))
  );
  return results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
}

export function getPokemonImage(pokemon, shiny = false) {
  if (shiny) {
    return (
      pokemon.sprites.other?.['official-artwork']?.front_shiny ||
      pokemon.sprites.front_shiny ||
      pokemon.sprites.other?.home?.front_shiny ||
      pokemon.sprites.other?.['official-artwork']?.front_default
    );
  }
  return (
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.other?.home?.front_default ||
    pokemon.sprites.front_default
  );
}

export function getAnimatedSprite(pokemon, shiny = false) {
  const key = shiny ? 'front_shiny' : 'front_default';
  return (
    pokemon.sprites.versions?.['generation-v']?.['black-white']?.animated?.[key] ||
    pokemon.sprites.other?.showdown?.[key] ||
    getPokemonImage(pokemon, shiny)
  );
}

export function getPokemonCry(pokemon) {
  return pokemon.cries?.latest || pokemon.cries?.legacy || null;
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

export function getImageUrl(id, variant = 'official-artwork') {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/${variant}/${id}.png`;
}
