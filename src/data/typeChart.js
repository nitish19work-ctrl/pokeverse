export const TYPE_CHART = {
  normal: { weak: ['fighting'], strong: [] },
  fire: { weak: ['water', 'ground', 'rock'], strong: ['grass', 'ice', 'bug', 'steel'] },
  water: { weak: ['electric', 'grass'], strong: ['fire', 'ground', 'rock'] },
  electric: { weak: ['ground'], strong: ['water', 'flying'] },
  grass: { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], strong: ['water', 'ground', 'rock'] },
  ice: { weak: ['fire', 'fighting', 'rock', 'steel'], strong: ['grass', 'ground', 'flying', 'dragon'] },
  fighting: { weak: ['flying', 'psychic', 'fairy'], strong: ['normal', 'ice', 'rock', 'dark', 'steel'] },
  poison: { weak: ['ground', 'psychic'], strong: ['grass', 'fairy'] },
  ground: { weak: ['water', 'grass', 'ice'], strong: ['fire', 'electric', 'poison', 'rock', 'steel'] },
  flying: { weak: ['electric', 'ice', 'rock'], strong: ['grass', 'fighting', 'bug'] },
  psychic: { weak: ['bug', 'ghost', 'dark'], strong: ['fighting', 'poison'] },
  bug: { weak: ['fire', 'flying', 'rock'], strong: ['grass', 'psychic', 'dark'] },
  rock: { weak: ['water', 'grass', 'fighting', 'ground', 'steel'], strong: ['fire', 'ice', 'flying', 'bug'] },
  ghost: { weak: ['ghost', 'dark'], strong: ['psychic', 'ghost'] },
  dragon: { weak: ['ice', 'dragon', 'fairy'], strong: ['dragon'] },
  dark: { weak: ['fighting', 'bug', 'fairy'], strong: ['psychic', 'ghost'] },
  steel: { weak: ['fire', 'fighting', 'ground'], strong: ['ice', 'rock', 'fairy'] },
  fairy: { weak: ['poison', 'steel'], strong: ['fighting', 'dragon', 'dark'] },
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
