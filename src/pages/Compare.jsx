import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import ParticleBackground from '../components/ui/ParticleBackground';
import SearchBar from '../components/ui/SearchBar';
import TypeBadge from '../components/ui/TypeBadge';
import Seo from '../components/ui/Seo';
import { DetailSkeleton } from '../components/ui/LoadingSkeleton';
import { FadeIn } from '../components/ui/PageTransition';
import { fetchPokemon, getPokemonImage, fetchAllPokemonEntries } from '../api/pokeapi';
import { formatPokemonName, formatHeight, formatWeight, getTotalStats } from '../utils/helpers';
import { STAT_NAMES } from '../data/constants';

const SLOT_COLORS = ['#ffd700', '#3b82f6', '#ef4444', '#a855f7'];
const MAX_COMPARE = 4;

function ComparisonBar({ label, values, maxValue = 255 }) {
  const max = Math.max(...values, 1);
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center gap-2">
        <span className="text-xs text-gray-500 font-medium w-16 shrink-0">{label}</span>
        <div className="flex-1 flex gap-1">
          {values.map((v, i) => (
            <span key={i} className="text-xs font-bold flex-1 text-center" style={{ color: SLOT_COLORS[i] }}>
              {v}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        {values.map((v, i) => (
          <div key={i} className="flex-1 h-2.5 bg-poke-dark-4 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(v / maxValue) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              className="h-full rounded-full"
              style={{ backgroundColor: SLOT_COLORS[i] }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Compare() {
  const [searchParams] = useSearchParams();
  const [slots, setSlots] = useState(Array(MAX_COMPARE).fill(null));
  const [loading, setLoading] = useState(false);
  const [allNames, setAllNames] = useState([]);

  useEffect(() => {
    fetchAllPokemonEntries().then(setAllNames).catch(() => {});
  }, []);

  useEffect(() => {
    const p1 = searchParams.get('p1');
    if (p1) {
      fetchPokemon(p1).then((data) => {
        setSlots((prev) => {
          const updated = [...prev];
          updated[0] = data;
          return updated;
        });
      }).catch(() => {});
    }
  }, [searchParams]);

  const handleSelect = async (query, slotIndex) => {
    if (!query) return;
    setLoading(true);
    try {
      let target = query.toLowerCase();
      const match = allNames.find((p) => p.name.toLowerCase().includes(target));
      if (match) target = match.name;
      const data = await fetchPokemon(target);
      setSlots((prev) => {
        const updated = [...prev];
        updated[slotIndex] = data;
        return updated;
      });
    } catch {
      // not found
    } finally {
      setLoading(false);
    }
  };

  const removeSlot = (index) => {
    setSlots((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
  };

  const filled = slots.filter(Boolean);
  const statNames = filled[0]?.stats.map((s) => s.stat.name) || [];

  if (loading && filled.length === 0) return <DetailSkeleton />;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Seo title="Compare Pokémon" description="Compare up to 4 Pokémon side by side with animated stat charts." path="/compare" />
      <ParticleBackground count={25} color="rgba(168, 85, 247, 0.4)" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white mb-2">
            Battle <span className="text-gradient">Comparison</span>
          </h1>
          <p className="text-gray-400 mb-10">Compare up to 4 Pokémon — stats, types, speed, and abilities</p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {slots.map((pokemon, index) => (
            <div key={index} className="glass rounded-2xl p-4 relative" style={{ borderTop: `3px solid ${SLOT_COLORS[index]}` }}>
              {pokemon ? (
                <div className="text-center">
                  <button type="button" onClick={() => removeSlot(index)} className="absolute top-2 right-2 text-gray-400 hover:text-poke-red">
                    <IoClose />
                  </button>
                  <img src={getPokemonImage(pokemon)} alt={pokemon.name} loading="lazy" className="w-24 h-24 mx-auto object-contain mb-2" />
                  <h3 className="font-display font-bold text-white capitalize text-sm mb-2">{formatPokemonName(pokemon.name)}</h3>
                  <div className="flex gap-1 justify-center flex-wrap mb-2">
                    {pokemon.types.map(({ type }) => <TypeBadge key={type.name} type={type.name} size="sm" />)}
                  </div>
                  <p className="text-xs text-gray-400">
                    BST: <span className="text-poke-yellow font-bold">{getTotalStats(pokemon.stats)}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Speed: <span className="text-white font-bold">{pokemon.stats.find((s) => s.stat.name === 'speed')?.base_stat}</span>
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Pokémon {index + 1}</p>
                  <SearchBar
                    onSearch={(q) => handleSelect(q, index)}
                    placeholder="Search..."
                    suggestions={allNames}
                    suggestionLinkBase=""
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {filled.length >= 2 && (
          <>
            <FadeIn>
              <div className="glass rounded-2xl p-6 mb-8">
                <h3 className="font-display font-bold text-white mb-6 text-center">Stat Comparison Chart</h3>
                <div className="space-y-4">
                  {statNames.map((statName) => (
                    <ComparisonBar
                      key={statName}
                      label={STAT_NAMES[statName] || statName}
                      values={slots.map((p) => p?.stats.find((s) => s.stat.name === statName)?.base_stat || 0)}
                    />
                  ))}
                  <ComparisonBar
                    label="Total"
                    values={slots.map((p) => (p ? getTotalStats(p.stats) : 0))}
                    maxValue={800}
                  />
                </div>
              </div>
            </FadeIn>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { label: 'Height', get: (p) => formatHeight(p.height) },
                { label: 'Weight', get: (p) => formatWeight(p.weight) },
              ].map(({ label, get }) => (
                <div key={label} className="glass rounded-xl p-4">
                  <h4 className="text-sm text-gray-400 mb-3 text-center">{label}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {slots.map((p, i) => p && (
                      <p key={i} className="text-xs text-white font-semibold text-center">{get(p)}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="glass rounded-xl p-4">
              <h4 className="text-sm text-gray-400 mb-3 text-center">Abilities</h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {slots.map((p, i) => p && (
                  <div key={i} className="space-y-1">
                    {p.abilities.map(({ ability }) => (
                      <p key={ability.name} className="text-xs text-white capitalize text-center">{formatPokemonName(ability.name)}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {filled.length < 2 && (
          <div className="text-center py-12 text-gray-500">Add at least 2 Pokémon to compare</div>
        )}
      </div>
    </div>
  );
}
