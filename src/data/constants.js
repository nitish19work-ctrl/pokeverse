export const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

export const TOTAL_POKEMON = 1025;

export const POKEMON_PER_PAGE = 24;

export const TYPE_COLORS = {
  normal: { bg: '#A8A878', text: '#fff' },
  fire: { bg: '#F08030', text: '#fff' },
  water: { bg: '#6890F0', text: '#fff' },
  electric: { bg: '#F8D030', text: '#1a1a2e' },
  grass: { bg: '#78C850', text: '#fff' },
  ice: { bg: '#98D8D8', text: '#1a1a2e' },
  fighting: { bg: '#C03028', text: '#fff' },
  poison: { bg: '#A040A0', text: '#fff' },
  ground: { bg: '#E0C068', text: '#1a1a2e' },
  flying: { bg: '#A890F0', text: '#fff' },
  psychic: { bg: '#F85888', text: '#fff' },
  bug: { bg: '#A8B820', text: '#fff' },
  rock: { bg: '#B8A038', text: '#fff' },
  ghost: { bg: '#705898', text: '#fff' },
  dragon: { bg: '#7038F8', text: '#fff' },
  dark: { bg: '#705848', text: '#fff' },
  steel: { bg: '#B8B8D0', text: '#1a1a2e' },
  fairy: { bg: '#EE99AC', text: '#1a1a2e' },
};

export const STAT_NAMES = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

export const STAT_COLORS = {
  hp: '#ef4444',
  attack: '#f97316',
  defense: '#eab308',
  'special-attack': '#8b5cf6',
  'special-defense': '#06b6d4',
  speed: '#22c55e',
};

export const GENERATIONS = [
  { id: 1, name: 'Generation I', range: [1, 151], region: 'kanto', color: '#ef4444' },
  { id: 2, name: 'Generation II', range: [152, 251], region: 'johto', color: '#3b82f6' },
  { id: 3, name: 'Generation III', range: [252, 386], region: 'hoenn', color: '#22c55e' },
  { id: 4, name: 'Generation IV', range: [387, 493], region: 'sinnoh', color: '#a855f7' },
  { id: 5, name: 'Generation V', range: [494, 649], region: 'unova', color: '#f97316' },
  { id: 6, name: 'Generation VI', range: [650, 721], region: 'kalos', color: '#ec4899' },
  { id: 7, name: 'Generation VII', range: [722, 809], region: 'alola', color: '#fbbf24' },
  { id: 8, name: 'Generation VIII', range: [810, 905], region: 'galar', color: '#6366f1' },
  { id: 9, name: 'Generation IX', range: [906, 1025], region: 'paldea', color: '#14b8a6' },
];

export const REGIONS = [
  { id: 'kanto', name: 'Kanto', generation: 1, description: 'The original region where it all began. Home to 151 Pokémon and iconic landmarks like Mt. Moon and the Indigo Plateau.', pokemonCount: 151, color: '#ef4444', gradient: 'from-red-500/20 to-orange-500/20' },
  { id: 'johto', name: 'Johto', generation: 2, description: 'A region steeped in tradition and legend. Known for the Bell Tower, Whirl Islands, and the first baby Pokémon.', pokemonCount: 100, color: '#3b82f6', gradient: 'from-blue-500/20 to-indigo-500/20' },
  { id: 'hoenn', name: 'Hoenn', generation: 3, description: 'A tropical paradise with diverse ecosystems from volcanic mountains to deep oceans and vast deserts.', pokemonCount: 135, color: '#22c55e', gradient: 'from-green-500/20 to-emerald-500/20' },
  { id: 'sinnoh', name: 'Sinnoh', generation: 4, description: 'A northern region shaped by mythology. Mount Coronet divides the land and legends of creation trio abound.', pokemonCount: 107, color: '#a855f7', gradient: 'from-purple-500/20 to-violet-500/20' },
  { id: 'unova', name: 'Unova', generation: 5, description: 'Inspired by New York City, Unova features urban landscapes alongside natural wonders and dragon legends.', pokemonCount: 156, color: '#f97316', gradient: 'from-orange-500/20 to-amber-500/20' },
  { id: 'kalos', name: 'Kalos', generation: 6, description: 'A beautiful region inspired by France, featuring Mega Evolution and the ultimate weapon of ancient times.', pokemonCount: 72, color: '#ec4899', gradient: 'from-pink-500/20 to-rose-500/20' },
  { id: 'alola', name: 'Alola', generation: 7, description: 'A tropical archipelago with unique Alolan forms and the powerful Tapu guardians protecting each island.', pokemonCount: 88, color: '#fbbf24', gradient: 'from-yellow-500/20 to-amber-500/20' },
  { id: 'galar', name: 'Galar', generation: 8, description: 'Inspired by the United Kingdom, featuring Dynamax battles and the wild area spanning the region.', pokemonCount: 96, color: '#6366f1', gradient: 'from-indigo-500/20 to-blue-500/20' },
  { id: 'paldea', name: 'Paldea', generation: 9, description: 'An open-world region inspired by Spain and Portugal, featuring Terastallization and three story paths.', pokemonCount: 120, color: '#14b8a6', gradient: 'from-teal-500/20 to-cyan-500/20' },
];

export const ALL_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

export const LEGENDARY_POKEMON = [
  { id: 144, name: 'articuno' }, { id: 145, name: 'zapdos' }, { id: 146, name: 'moltres' },
  { id: 150, name: 'mewtwo' }, { id: 151, name: 'mew' },
  { id: 243, name: 'raikou' }, { id: 244, name: 'entei' }, { id: 245, name: 'suicune' },
  { id: 249, name: 'lugia' }, { id: 250, name: 'ho-oh' }, { id: 251, name: 'celebi' },
  { id: 377, name: 'regirock' }, { id: 378, name: 'regice' }, { id: 379, name: 'registeel' },
  { id: 380, name: 'latias' }, { id: 381, name: 'latios' }, { id: 382, name: 'kyogre' },
  { id: 383, name: 'groudon' }, { id: 384, name: 'rayquaza' }, { id: 385, name: 'jirachi' },
  { id: 386, name: 'deoxys' },
  { id: 480, name: 'uxie' }, { id: 481, name: 'mesprit' }, { id: 482, name: 'azelf' },
  { id: 483, name: 'dialga' }, { id: 484, name: 'palkia' }, { id: 485, name: 'heatran' },
  { id: 486, name: 'regigigas' }, { id: 487, name: 'giratina' }, { id: 488, name: 'cresselia' },
  { id: 489, name: 'phione' }, { id: 490, name: 'manaphy' }, { id: 491, name: 'darkrai' },
  { id: 492, name: 'shaymin' }, { id: 493, name: 'arceus' },
  { id: 494, name: 'victini' }, { id: 643, name: 'reshiram' }, { id: 644, name: 'zekrom' },
  { id: 646, name: 'kyurem' }, { id: 716, name: 'xerneas' }, { id: 717, name: 'yveltal' },
  { id: 718, name: 'zygarde' }, { id: 720, name: 'hoopa' }, { id: 721, name: 'volcanion' },
  { id: 791, name: 'solgaleo' }, { id: 792, name: 'lunala' }, { id: 800, name: 'necrozma' },
  { id: 888, name: 'zacian' }, { id: 889, name: 'zamazenta' }, { id: 890, name: 'eternatus' },
  { id: 898, name: 'calyrex' }, { id: 1001, name: 'wo-chien' }, { id: 1002, name: 'chien-pao' },
  { id: 1003, name: 'ting-lu' }, { id: 1004, name: 'chi-yu' }, { id: 1007, name: 'koraidon' },
  { id: 1008, name: 'miraidon' },
];

export const TRENDING_POKEMON = [
  { id: 25, name: 'pikachu' }, { id: 6, name: 'charizard' }, { id: 150, name: 'mewtwo' },
  { id: 445, name: 'garchomp' }, { id: 94, name: 'gengar' }, { id: 658, name: 'greninja' },
  { id: 149, name: 'dragonite' }, { id: 448, name: 'lucario' },
];

export const FEATURED_POKEMON = [
  { id: 1, name: 'bulbasaur' }, { id: 4, name: 'charmander' }, { id: 7, name: 'squirtle' },
  { id: 133, name: 'eevee' }, { id: 39, name: 'jigglypuff' }, { id: 143, name: 'snorlax' },
];

export const HERO_POKEMON = { id: 25, name: 'pikachu' };

export const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/pokedex', label: 'Pokédex' },
  { path: '/regions', label: 'Regions' },
  { path: '/types', label: 'Types' },
  { path: '/legendary', label: 'Legendary' },
  { path: '/favorites', label: 'Favorites' },
  { path: '/team-builder', label: 'Team Builder' },
  { path: '/compare', label: 'Compare' },
  { path: '/about', label: 'About' },
];
