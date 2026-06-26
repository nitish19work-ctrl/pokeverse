export const TYPE_CHART = {
  normal: { weak: ['fighting'], strong: [], resist: ['ghost'], immune: ['ghost'] },
  fire: { weak: ['water', 'ground', 'rock'], strong: ['grass', 'ice', 'bug', 'steel'], resist: [], immune: [] },
  water: { weak: ['electric', 'grass'], strong: ['fire', 'ground', 'rock'], resist: [], immune: [] },
  electric: { weak: ['ground'], strong: ['water', 'flying'], resist: [], immune: [] },
  grass: { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], strong: ['water', 'ground', 'rock'], resist: [], immune: [] },
  ice: { weak: ['fire', 'fighting', 'rock', 'steel'], strong: ['grass', 'ground', 'flying', 'dragon'], resist: [], immune: [] },
  fighting: { weak: ['flying', 'psychic', 'fairy'], strong: ['normal', 'ice', 'rock', 'dark', 'steel'], resist: ['ghost'], immune: ['ghost'] },
  poison: { weak: ['ground', 'psychic'], strong: ['grass', 'fairy'], resist: ['steel'], immune: ['steel'] },
  ground: { weak: ['water', 'grass', 'ice'], strong: ['fire', 'electric', 'poison', 'rock', 'steel'], resist: ['flying'], immune: ['flying'] },
  flying: { weak: ['electric', 'ice', 'rock'], strong: ['grass', 'fighting', 'bug'], resist: [], immune: [] },
  psychic: { weak: ['bug', 'ghost', 'dark'], strong: ['fighting', 'poison'], resist: ['dark'], immune: ['dark'] },
  bug: { weak: ['fire', 'flying', 'rock'], strong: ['grass', 'psychic', 'dark'], resist: [], immune: [] },
  rock: { weak: ['water', 'grass', 'fighting', 'ground', 'steel'], strong: ['fire', 'ice', 'flying', 'bug'], resist: [], immune: [] },
  ghost: { weak: ['ghost', 'dark'], strong: ['psychic', 'ghost'], resist: ['normal'], immune: ['normal'] },
  dragon: { weak: ['ice', 'dragon', 'fairy'], strong: ['dragon'], resist: ['fairy'], immune: ['fairy'] },
  dark: { weak: ['fighting', 'bug', 'fairy'], strong: ['psychic', 'ghost'], resist: [], immune: [] },
  steel: { weak: ['fire', 'fighting', 'ground'], strong: ['ice', 'rock', 'fairy'], resist: [], immune: [] },
  fairy: { weak: ['poison', 'steel'], strong: ['fighting', 'dragon', 'dark'], resist: [], immune: [] },
};

const ATTACK_CHART = {
  normal: { super: ['rock', 'ghost', 'steel'], weak: [], immune: ['ghost'] },
  fire: { super: ['fire', 'water', 'rock', 'dragon'], weak: ['grass', 'ice', 'bug', 'steel'], immune: [] },
  water: { super: ['water', 'grass', 'dragon'], weak: ['fire', 'ground', 'rock'], immune: [] },
  electric: { super: ['electric', 'grass', 'dragon'], weak: ['water', 'flying'], immune: ['ground'] },
  grass: { super: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'], weak: ['water', 'ground', 'rock'], immune: [] },
  ice: { super: ['fire', 'water', 'ice', 'steel'], weak: ['grass', 'ground', 'flying', 'dragon'], immune: [] },
  fighting: { super: ['poison', 'flying', 'psychic', 'bug', 'fairy'], weak: ['normal', 'ice', 'rock', 'dark', 'steel'], immune: ['ghost'] },
  poison: { super: ['poison', 'ground', 'rock', 'ghost', 'steel'], weak: ['grass', 'fairy'], immune: ['steel'] },
  ground: { super: ['grass', 'bug'], weak: ['fire', 'electric', 'poison', 'rock', 'steel'], immune: ['flying'] },
  flying: { super: ['electric', 'rock', 'steel'], weak: ['grass', 'fighting', 'bug'], immune: [] },
  psychic: { super: ['psychic', 'steel'], weak: ['fighting', 'poison'], immune: ['dark'] },
  bug: { super: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'], weak: ['grass', 'psychic', 'dark'], immune: [] },
  rock: { super: ['fighting', 'ground', 'steel'], weak: ['fire', 'ice', 'flying', 'bug'], immune: [] },
  ghost: { super: ['dark'], weak: ['psychic', 'ghost'], immune: ['normal'] },
  dragon: { super: ['steel'], weak: ['dragon'], immune: ['fairy'] },
  dark: { super: ['fighting', 'dark', 'fairy'], weak: ['psychic', 'ghost'], immune: [] },
  steel: { super: ['fire', 'water', 'electric', 'steel'], weak: ['ice', 'rock', 'fairy'], immune: [] },
  fairy: { super: ['fire', 'poison', 'steel'], weak: ['fighting', 'dragon', 'dark'], immune: [] },
};

export function getTypeEffectiveness(types) {
  const weaknesses = new Set();
  const strengths = new Set();

  types.forEach((type) => {
    const chart = TYPE_CHART[type];
    if (chart) {
      chart.weak.forEach((w) => weaknesses.add(w));
      chart.strong.forEach((s) => strengths.add(s));
    }
  });

  strengths.forEach((s) => weaknesses.delete(s));
  types.forEach((t) => {
    weaknesses.delete(t);
    strengths.delete(t);
  });

  return {
    weaknesses: [...weaknesses],
    strengths: [...strengths],
  };
}

export function getDefensiveProfile(types) {
  const weaknesses = new Set();
  const resistances = new Set();
  const immunities = new Set();

  for (const attackType of Object.keys(ATTACK_CHART)) {
    let multiplier = 1;
    types.forEach((defType) => {
      const chart = ATTACK_CHART[attackType];
      if (chart.immune.includes(defType)) multiplier = 0;
      else if (chart.weak.includes(defType)) multiplier *= 0.5;
      else if (chart.super.includes(defType)) multiplier *= 2;
    });
    if (multiplier === 0) immunities.add(attackType);
    else if (multiplier >= 2) weaknesses.add(attackType);
    else if (multiplier <= 0.5) resistances.add(attackType);
  }

  types.forEach((t) => resistances.delete(t));
  return {
    weaknesses: [...weaknesses],
    resistances: [...resistances],
    immunities: [...immunities],
  };
}

export function getOffensiveCoverage(types) {
  const superEffective = new Set();
  types.forEach((type) => {
    const chart = ATTACK_CHART[type];
    if (chart) chart.weak.forEach((t) => superEffective.add(t));
  });
  return [...superEffective];
}

export function getTeamWeaknesses(teamTypesList) {
  const combined = new Set();
  teamTypesList.forEach((types) => {
    getDefensiveProfile(types).weaknesses.forEach((w) => combined.add(w));
  });
  return [...combined];
}
