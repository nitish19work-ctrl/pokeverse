import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoSwapHorizontal } from 'react-icons/io5';
import ParticleBackground from '../components/ui/ParticleBackground';
import SearchBar from '../components/ui/SearchBar';
import TypeBadge from '../components/ui/TypeBadge';
import { DetailSkeleton } from '../components/ui/LoadingSkeleton';
import { FadeIn } from '../components/ui/PageTransition';
import { fetchPokemon, getPokemonImage, fetchAllPokemonNames } from '../api/pokeapi';
import { formatPokemonName, formatHeight, formatWeight, getTotalStats } from '../utils/helpers';
import { STAT_NAMES } from '../data/constants';

function ComparisonBar({ label, value1, value2, maxValue = 255 }) {
  const winner = value1 > value2 ? 1 : value2 > value1 ? 2 : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className={`font-bold ${winner === 1 ? 'text-poke-yellow' : 'text-gray-400'}`}>
          {value1}
        </span>
        <span className="text-gray-500 font-medium">{label}</span>
        <span className={`font-bold ${winner === 2 ? 'text-poke-yellow' : 'text-gray-400'}`}>
          {value2}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex-1 h-3 bg-poke-dark-4 rounded-full overflow-hidden flex justify-end">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(value1 / maxValue) * 100}%` }}
            transition={{ duration: 0.8 }}
            className={`h-full rounded-full ${winner === 1 ? 'bg-poke-yellow' : 'bg-gray-600'}`}
          />
        </div>
        <div className="flex-1 h-3 bg-poke-dark-4 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(value2 / maxValue) * 100}%` }}
            transition={{ duration: 0.8 }}
            className={`h-full rounded-full ${winner === 2 ? 'bg-poke-blue' : 'bg-gray-600'}`}
          />
        </div>
      </div>
    </div>
  );
}

export default function Compare() {
  const [searchParams] = useSearchParams();
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allNames, setAllNames] = useState([]);

  useEffect(() => {
    fetchAllPokemonNames().then(setAllNames).catch(() => {});
  }, []);

  useEffect(() => {
    const p1 = searchParams.get('p1');
    if (p1) {
      fetchPokemon(p1).then(setPokemon1).catch(() => {});
    }
  }, [searchParams]);

  const handleSelect = async (query, slot) => {
    if (!query) return;
    const match = allNames.find((p) => p.name.toLowerCase() === query.toLowerCase());
    if (!match) {
      const partial = allNames.find((p) => p.name.toLowerCase().includes(query.toLowerCase()));
      if (!partial) return;
      setLoading(true);
      const data = await fetchPokemon(partial.name);
      if (slot === 1) setPokemon1(data);
      else setPokemon2(data);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await fetchPokemon(match.name);
    if (slot === 1) setPokemon1(data);
    else setPokemon2(data);
    setLoading(false);
  };

  const swapPokemon = () => {
    const temp = pokemon1;
    setPokemon1(pokemon2);
    setPokemon2(temp);
  };

  if (loading) return <DetailSkeleton />;

  return (
    <div className="relative min-h-screen">
      <ParticleBackground count={25} color="rgba(168, 85, 247, 0.4)" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white mb-2">
            Battle <span className="text-gradient">Comparison</span>
          </h1>
          <p className="text-gray-400 mb-10">
            Compare stats, abilities, and types side by side
          </p>
        </FadeIn>

        {/* Pokemon Selectors */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {[1, 2].map((slot) => {
            const pokemon = slot === 1 ? pokemon1 : pokemon2;
            return (
              <div key={slot} className="glass rounded-2xl p-6">
                {pokemon ? (
                  <div className="text-center">
                    <img
                      src={getPokemonImage(pokemon)}
                      alt={pokemon.name}
                      className="w-32 h-32 mx-auto object-contain mb-3"
                    />
                    <h3 className="font-display font-bold text-xl text-white capitalize mb-2">
                      {formatPokemonName(pokemon.name)}
                    </h3>
                    <div className="flex gap-1 justify-center mb-3">
                      {pokemon.types.map(({ type }) => (
                        <TypeBadge key={type.name} type={type.name} size="sm" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-400">
                      BST: <span className="text-poke-yellow font-bold">{getTotalStats(pokemon.stats)}</span>
                    </p>
                    <button
                      onClick={() => {
                        if (slot === 1) setPokemon1(null);
                        else setPokemon2(null);
                      }}
                      className="text-xs text-poke-red mt-3 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-400 mb-3">Select Pokémon {slot}</p>
                    <SearchBar
                      onSearch={(q) => handleSelect(q, slot)}
                      placeholder={`Search Pokémon ${slot}...`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {pokemon1 && pokemon2 && (
          <>
            <div className="flex justify-center mb-8">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={swapPokemon}
                className="p-3 rounded-full glass hover:bg-white/10 transition-colors"
              >
                <IoSwapHorizontal className="text-poke-yellow text-2xl" />
              </motion.button>
            </div>

            {/* Stat Comparison */}
            <FadeIn>
              <div className="glass rounded-2xl p-6 mb-8">
                <h3 className="font-display font-bold text-white mb-6 text-center">Stat Comparison</h3>
                <div className="space-y-4">
                  {pokemon1.stats.map((s, i) => {
                    const stat2 = pokemon2.stats.find((s2) => s2.stat.name === s.stat.name);
                    return (
                      <ComparisonBar
                        key={s.stat.name}
                        label={STAT_NAMES[s.stat.name] || s.stat.name}
                        value1={s.base_stat}
                        value2={stat2?.base_stat || 0}
                      />
                    );
                  })}
                  <ComparisonBar
                    label="Total"
                    value1={getTotalStats(pokemon1.stats)}
                    value2={getTotalStats(pokemon2.stats)}
                    maxValue={800}
                  />
                </div>
              </div>
            </FadeIn>

            {/* Details Comparison */}
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { label: 'Height', v1: formatHeight(pokemon1.height), v2: formatHeight(pokemon2.height) },
                { label: 'Weight', v1: formatWeight(pokemon1.weight), v2: formatWeight(pokemon2.weight) },
              ].map(({ label, v1, v2 }) => (
                <div key={label} className="glass rounded-xl p-4">
                  <h4 className="text-sm text-gray-400 mb-3 text-center">{label}</h4>
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">{v1}</span>
                    <span className="text-white font-semibold">{v2}</span>
                  </div>
                </div>
              ))}

              <div className="glass rounded-xl p-4 sm:col-span-2">
                <h4 className="text-sm text-gray-400 mb-3 text-center">Abilities</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    {pokemon1.abilities.map(({ ability }) => (
                      <p key={ability.name} className="text-sm text-white capitalize text-center">
                        {formatPokemonName(ability.name)}
                      </p>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {pokemon2.abilities.map(({ ability }) => (
                      <p key={ability.name} className="text-sm text-white capitalize text-center">
                        {formatPokemonName(ability.name)}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {(!pokemon1 || !pokemon2) && (
          <div className="text-center py-12">
            <p className="text-gray-500">Select two Pokémon to compare their stats</p>
          </div>
        )}
      </div>
    </div>
  );
}
