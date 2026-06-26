import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoArrowBack,
  IoHeart,
  IoHeartOutline,
  IoSparkles,
  IoResize,
  IoScale,
  IoMaleFemale,
} from 'react-icons/io5';
import ParticleBackground from '../components/ui/ParticleBackground';
import TypeBadge from '../components/ui/TypeBadge';
import StatBar from '../components/pokemon/StatBar';
import EvolutionChain from '../components/pokemon/EvolutionChain';
import { DetailSkeleton } from '../components/ui/LoadingSkeleton';
import RippleButton from '../components/ui/RippleButton';
import { FadeIn, SlideIn } from '../components/ui/PageTransition';
import {
  fetchPokemon,
  fetchPokemonSpecies,
  getPokemonImage,
} from '../api/pokeapi';
import { getTypeEffectiveness } from '../data/typeChart';
import {
  formatPokemonName,
  formatHeight,
  formatWeight,
  formatGenderRate,
  getTotalStats,
  getGenerationById,
} from '../utils/helpers';
import { useFavorites } from '../hooks/useFavorites';
import { useTeamBuilder } from '../hooks/useTeamBuilder';

export default function PokemonDetails() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shiny, setShiny] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToTeam, isInTeam } = useTeamBuilder();

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPokemon(id), fetchPokemonSpecies(id)])
      .then(([p, s]) => {
        setPokemon(p);
        setSpecies(s);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <ParticleBackground count={20} />
        <DetailSkeleton />
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="text-center py-32">
        <h2 className="text-2xl text-white mb-4">Pokémon not found</h2>
        <RippleButton to="/pokedex">Back to Pokédex</RippleButton>
      </div>
    );
  }

  const types = pokemon.types.map((t) => t.type.name);
  const { weaknesses, strengths } = getTypeEffectiveness(types);
  const generation = getGenerationById(pokemon.id);
  const flavorText = species?.flavor_text_entries
    ?.find((e) => e.language.name === 'en')
    ?.flavor_text?.replace(/\f|\n/g, ' ');
  const favorite = isFavorite(pokemon.id);
  const inTeam = isInTeam(pokemon.id);

  const tabs = [
    { id: 'stats', label: 'Stats' },
    { id: 'moves', label: 'Moves' },
    { id: 'abilities', label: 'Abilities' },
    { id: 'evolution', label: 'Evolution' },
  ];

  return (
    <div className="relative min-h-screen pb-20">
      <ParticleBackground count={25} color="rgba(255, 215, 0, 0.4)" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/pokedex"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-poke-yellow transition-colors mb-8"
        >
          <IoArrowBack /> Back to Pokédex
        </Link>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Artwork */}
          <SlideIn direction="left">
            <div className="glass rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-poke-yellow/10 via-transparent to-poke-blue/10" />

              <div className="relative flex flex-col items-center">
                <div className="flex items-center gap-3 mb-4 w-full justify-between">
                  <span className="font-mono text-gray-400">
                    #{String(pokemon.id).padStart(4, '0')}
                  </span>
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShiny(!shiny)}
                      className={`p-2 rounded-xl glass transition-colors ${shiny ? 'text-poke-yellow bg-poke-yellow/10' : 'text-gray-400 hover:text-poke-yellow'}`}
                      aria-label="Toggle shiny"
                    >
                      <IoSparkles className="text-xl" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleFavorite(pokemon)}
                      className="p-2 rounded-xl glass transition-colors"
                      aria-label="Toggle favorite"
                    >
                      {favorite ? (
                        <IoHeart className="text-poke-red text-xl" />
                      ) : (
                        <IoHeartOutline className="text-gray-400 text-xl hover:text-poke-red" />
                      )}
                    </motion.button>
                  </div>
                </div>

                <motion.div
                  key={shiny ? 'shiny' : 'normal'}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-64 h-64 sm:w-80 sm:h-80"
                >
                  <div className="absolute inset-0 bg-poke-yellow/15 rounded-full blur-3xl" />
                  <img
                    src={getPokemonImage(pokemon, shiny)}
                    alt={pokemon.name}
                    className="relative w-full h-full object-contain drop-shadow-2xl animate-float"
                  />
                </motion.div>

                {shiny && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-poke-yellow text-sm font-semibold mt-2 flex items-center gap-1"
                  >
                    <IoSparkles /> Shiny Form
                  </motion.span>
                )}
              </div>
            </div>
          </SlideIn>

          {/* Info */}
          <SlideIn direction="right">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl font-black text-white capitalize mb-3">
                {formatPokemonName(pokemon.name)}
              </h1>

              <div className="flex gap-2 mb-4 flex-wrap">
                {pokemon.types.map(({ type }) => (
                  <TypeBadge key={type.name} type={type.name} size="lg" />
                ))}
              </div>

              {flavorText && (
                <p className="text-gray-400 leading-relaxed mb-6 italic">
                  "{flavorText}"
                </p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { icon: IoResize, label: 'Height', value: formatHeight(pokemon.height) },
                  { icon: IoScale, label: 'Weight', value: formatWeight(pokemon.weight) },
                  { icon: IoMaleFemale, label: 'Gender', value: formatGenderRate(species?.gender_rate) },
                  { label: 'Generation', value: generation?.name || 'Unknown' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="glass rounded-xl p-3 text-center">
                    {Icon && <Icon className="text-poke-yellow mx-auto mb-1" />}
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-semibold text-white capitalize">{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mb-8">
                <RippleButton
                  onClick={() => addToTeam(pokemon)}
                  variant={inTeam ? 'secondary' : 'primary'}
                  className="flex-1"
                  disabled={inTeam}
                >
                  {inTeam ? 'In Team' : 'Add to Team'}
                </RippleButton>
                <RippleButton to={`/compare?p1=${pokemon.id}`} variant="secondary">
                  Compare
                </RippleButton>
              </div>

              {/* Type Effectiveness */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="glass rounded-xl p-4">
                  <h4 className="text-sm font-bold text-poke-red mb-2">Weaknesses</h4>
                  <div className="flex flex-wrap gap-1">
                    {weaknesses.length > 0 ? (
                      weaknesses.map((t) => <TypeBadge key={t} type={t} size="sm" />)
                    ) : (
                      <span className="text-xs text-gray-500">None</span>
                    )}
                  </div>
                </div>
                <div className="glass rounded-xl p-4">
                  <h4 className="text-sm font-bold text-green-400 mb-2">Strengths</h4>
                  <div className="flex flex-wrap gap-1">
                    {strengths.length > 0 ? (
                      strengths.map((t) => <TypeBadge key={t} type={t} size="sm" />)
                    ) : (
                      <span className="text-xs text-gray-500">None</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'bg-poke-yellow/20 text-poke-yellow'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="glass rounded-2xl p-6">
                {activeTab === 'stats' && (
                  <FadeIn>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-bold text-white">Base Stats</h3>
                      <span className="text-sm text-gray-400">
                        Total: <span className="text-poke-yellow font-bold">{getTotalStats(pokemon.stats)}</span>
                      </span>
                    </div>
                    <div className="space-y-3">
                      {pokemon.stats.map((s, i) => (
                        <StatBar
                          key={s.stat.name}
                          stat={s.stat.name}
                          value={s.base_stat}
                          delay={i * 0.1}
                        />
                      ))}
                    </div>
                  </FadeIn>
                )}

                {activeTab === 'moves' && (
                  <FadeIn>
                    <h3 className="font-display font-bold text-white mb-4">
                      Moves ({pokemon.moves.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-y-auto">
                      {pokemon.moves.slice(0, 30).map(({ move }) => (
                        <span
                          key={move.name}
                          className="px-3 py-1.5 glass rounded-lg text-xs text-gray-300 capitalize"
                        >
                          {formatPokemonName(move.name)}
                        </span>
                      ))}
                    </div>
                  </FadeIn>
                )}

                {activeTab === 'abilities' && (
                  <FadeIn>
                    <h3 className="font-display font-bold text-white mb-4">Abilities</h3>
                    <div className="space-y-3">
                      {pokemon.abilities.map(({ ability, is_hidden }) => (
                        <div key={ability.name} className="flex items-center gap-3 glass rounded-xl p-4">
                          <div className="w-10 h-10 rounded-xl bg-poke-yellow/20 flex items-center justify-center">
                            <IoSparkles className="text-poke-yellow" />
                          </div>
                          <div>
                            <p className="font-semibold text-white capitalize">
                              {formatPokemonName(ability.name)}
                            </p>
                            {is_hidden && (
                              <span className="text-xs text-poke-yellow">Hidden Ability</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </FadeIn>
                )}

                {activeTab === 'evolution' && (
                  <FadeIn>
                    <h3 className="font-display font-bold text-white mb-4">Evolution Chain</h3>
                    <EvolutionChain evolutionChainUrl={species?.evolution_chain?.url} />
                  </FadeIn>
                )}
              </div>
            </div>
          </SlideIn>
        </div>
      </div>
    </div>
  );
}
