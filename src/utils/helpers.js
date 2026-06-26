import { GENERATIONS } from '../data/constants';

export function formatPokemonName(name) {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatStatName(stat) {
  return stat
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getGenerationById(id) {
  return GENERATIONS.find((g) => id >= g.range[0] && id <= g.range[1]);
}

export function getGenerationByRegion(regionId) {
  return GENERATIONS.find((g) => g.region === regionId);
}

export function getRegionPokemonRange(regionId) {
  const gen = getGenerationByRegion(regionId);
  if (!gen) return [1, 151];
  return gen.range;
}

export function formatHeight(decimeters) {
  const meters = decimeters / 10;
  const feet = Math.floor(meters * 3.28084);
  const inches = Math.round((meters * 3.28084 - feet) * 12);
  return `${meters.toFixed(1)} m (${feet}'${inches}")`;
}

export function formatWeight(hectograms) {
  const kg = hectograms / 10;
  const lbs = (kg * 2.20462).toFixed(1);
  return `${kg.toFixed(1)} kg (${lbs} lbs)`;
}

export function formatGenderRate(rate) {
  if (rate === -1) return 'Genderless';
  const femalePercent = (rate / 8) * 100;
  const malePercent = 100 - femalePercent;
  if (femalePercent === 0) return '100% Male';
  if (malePercent === 0) return '100% Female';
  return `${malePercent.toFixed(1)}% Male / ${femalePercent.toFixed(1)}% Female`;
}

export function getTotalStats(stats) {
  return stats.reduce((sum, s) => sum + s.base_stat, 0);
}

export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
