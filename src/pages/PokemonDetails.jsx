import { useState, useEffect, useRef } from 'react';
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
  IoVolumeHigh,
  IoImage,
  IoPlay,
} from 'react-icons/io5';
import ParticleBackground from '../components/ui/ParticleBackground';
import TypeBadge from '../components/ui/TypeBadge';
import FormBadge from '../components/ui/FormBadge';
import StatBar from '../components/pokemon/StatBar';
import EvolutionChain from '../components/pokemon/EvolutionChain';
import Seo from '../components/ui/Seo';
import { DetailSkeleton } from '../components/ui/LoadingSkeleton';
import RippleButton from '../components/ui/RippleButton';
import { FadeIn, SlideIn } from '../components/ui/PageTransition';
import {
  fetchPokemon,
  fetchPokemonSpecies,
  fetchPokemonVarieties,
  getPokemonImage,
  getAnimatedSprite,
  getPokemonCry,
} from '../api/pokeapi';
import { getTypeEffectiveness, getDefensiveProfile } from '../data/typeChart';
import { classifyPokemonForm, FORM_CATEGORIES } from '../utils/pokemonForms';
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
  const [varieties, setVarieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spriteMode, setSpriteMode] = useState('artwork');
  const [activeTab, setActiveTab] = useState('stats');
  const audioRef = useRef(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToTeam, isInTeam } = useTeamBuilder();

  useEffect(() => {
    setLoading(true);
    setSpriteMode('artwork');
    Promise.all([fetchPokemon(id), fetchPokemonSpecies(id)])
      .then(async ([p, s]) => {
        setPokemon(p);
        setSpecies(s);
        const vars = await fetchPokemonVarieties(s);
        setVarieties(vars);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const playCry = () => {
    const cry = getPokemonCry(pokemon);
    if (!cry) return;
    if (audioRef.current) {
      audioRef.current.src = cry;
      audioRef.current.play().catch(() => {});
    }
  };

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
  const { resistances, immunities } = getDefensiveProfile(types);
  const generation = getGenerationById(pokemon.id);
  const formInfo = classifyPokemonForm(pokemon.name);
  const flavorEntries = species?.flavor_text_entries?.filter((e) => e.language.name === 'en') || [];
  const flavorText = flavorEntries[flavorEntries.length - 1]?.flavor_text?.replace(/\f|\n/g, ' ');
  const favorite = isFavorite(pokemon.id);
  const inTeam = isInTeam(pokemon.id);
  const megaForms = varieties.filter((v) => classifyPokemonForm(v.name).category === FORM_CATEGORIES.MEGA);
  const regionalForms = varieties.filter((v) => classifyPokemonForm(v.name).category === FORM_CATEGORIES.REGIONAL);

  const spriteSrc =
    spriteMode === 'animated'
      ? getAnimatedSprite(pokemon, false)
      : spriteMode === 'shiny'
        ? getPokemonImage(pokemon, true)
        : getPokemonImage(pokemon, false);

  const tabs = [
    { id: 'stats', label: 'Stats' },
    { id: 'moves', label: 'Moves' },
    { id: 'abilities', label: 'Abilities' },
    { id: 'evolution', label: 'Evolution' },
    { id: 'entries', label: 'Dex Entries' },
    { id: 'forms', label: 'Forms' },
  ];

  return (
    <div className="relative min-h-screen pb-20 overflow-x-hidden">
      <Seo
        title={formatPokemonName(pokemon.name)}
        description={flavorText || `${formatPokemonName(pokemon.name)} — stats, abilities, evolution chain, and forms.`}
        path={`/pokemon/${pokemon.name}`}
      />
      <ParticleBackground count={25} color="rgba(255, 215, 0, 0.4)" />
      <audio ref={audioRef} preload="none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/pokedex"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-poke-yellow transition-colors mb-8"
        >
          <IoArrowBack /> Back to Pokédex
        </Link>

        <div className="grid lg:grid-cols-2 gap-10">
          <SlideIn direction="left">
            <div className="glass rounded-3xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-poke-yellow/10 via-transparent to-poke-blue/10" />

              <div className="relative flex flex-col items-center">
                <div className="flex items-center gap-3 mb-4 w-full justify-between flex-wrap">
                  <span className="font-mono text-gray-400">
                    #{String(pokemon.id).padStart(4, '0')}
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { mode: 'artwork', icon: IoImage, label: 'Artwork' },
                      { mode: 'animated', icon: IoPlay, label: 'Animated' },
                      { mode: 'shiny', icon: IoSparkles, label: 'Shiny' },
                    ].map(({ mode, icon: Icon, label }) => (
                      <motion.button
                        key={mode}
                        type="button"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSpriteMode(mode)}
                        className={`p-2 rounded-xl glass text-xs flex items-center gap-1 transition-colors ${
                          spriteMode === mode ? 'text-poke-yellow bg-poke-yellow/10' : 'text-gray-400 hover:text-white'
                        }`}
                        aria-label={label}
                      >
                        <Icon className="text-lg" />
                        <span className="hidden sm:inline">{label}</span>
                      </motion.button>
                    ))}
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={playCry}
                      className="p-2 rounded-xl glass text-gray-400 hover:text-poke-yellow transition-colors"
                      aria-label="Play cry"
                    >
                      <IoVolumeHigh className="text-xl" />
                    </motion.button>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleFavorite(pokemon)}
                      className="p-2 rounded-xl glass transition-colors"
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
                  key={`${pokemon.name}-${spriteMode}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative w-56 h-56 sm:w-72 sm:h-72"
                >
                  <div className="absolute inset-0 bg-poke-yellow/15 rounded-full blur-3xl" />
                  <img
                    src={spriteSrc}
                    alt={pokemon.name}
                    loading="lazy"
                    className="relative w-full h-full object-contain drop-shadow-2xl animate-float"
                  />
                </motion.div>

                <FormBadge name={pokemon.name} size="md" />
              </div>
            </div>
          </SlideIn>

          <SlideIn direction="right">
            <div>
              <h1 className="font-display text-3xl sm:text-5xl font-black text-white capitalize mb-3">
                {formatPokemonName(pokemon.name)}
              </h1>

              <div className="flex gap-2 mb-4 flex-wrap">
                {pokemon.types.map(({ type }) => (
                  <TypeBadge key={type.name} type={type.name} size="lg" />
                ))}
              </div>

              {flavorText && (
                <p className="text-gray-400 leading-relaxed mb-6 italic">"{flavorText}"</p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { icon: IoResize, label: 'Height', value: formatHeight(pokemon.height) },
                  { icon: IoScale, label: 'Weight', value: formatWeight(pokemon.weight) },
                  { icon: IoMaleFemale, label: 'Gender', value: formatGenderRate(species?.gender_rate) },
                  { label: 'Generation', value: generation?.name?.replace('Generation ', 'Gen ') || 'Unknown' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="glass rounded-xl p-3 text-center">
                    {Icon && <Icon className="text-poke-yellow mx-auto mb-1" />}
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-semibold text-white capitalize">{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Capture Rate', value: species?.capture_rate ?? '—' },
                  { label: 'Base Happiness', value: species?.base_happiness ?? '—' },
                  { label: 'Habitat', value: species?.habitat?.name || 'Unknown' },
                  { label: 'Egg Groups', value: species?.egg_groups?.map((e) => e.name).join(', ') || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="glass rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-semibold text-white capitalize">{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mb-8 flex-wrap">
                <RippleButton
                  onClick={() => addToTeam(pokemon)}
                  variant={inTeam ? 'secondary' : 'primary'}
                  className="flex-1 min-w-[140px]"
                  disabled={inTeam}
                >
                  {inTeam ? 'In Team' : 'Add to Team'}
                </RippleButton>
                <RippleButton to={`/compare?p1=${pokemon.id}`} variant="secondary">
                  Compare
                </RippleButton>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 mb-8">
                <div className="glass rounded-xl p-4">
                  <h4 className="text-sm font-bold text-poke-red mb-2">Weaknesses</h4>
                  <div className="flex flex-wrap gap-1">
                    {weaknesses.length ? weaknesses.map((t) => <TypeBadge key={t} type={t} size="sm" />) : <span className="text-xs text-gray-500">None</span>}
                  </div>
                </div>
                <div className="glass rounded-xl p-4">
                  <h4 className="text-sm font-bold text-blue-400 mb-2">Resistances</h4>
                  <div className="flex flex-wrap gap-1">
                    {resistances.length ? resistances.map((t) => <TypeBadge key={t} type={t} size="sm" />) : <span className="text-xs text-gray-500">None</span>}
                  </div>
                </div>
                <div className="glass rounded-xl p-4">
                  <h4 className="text-sm font-bold text-purple-400 mb-2">Immunities</h4>
                  <div className="flex flex-wrap gap-1">
                    {immunities.length ? immunities.map((t) => <TypeBadge key={t} type={t} size="sm" />) : <span className="text-xs text-gray-500">None</span>}
                  </div>
                </div>
              </div>

              <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
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
                        <StatBar key={s.stat.name} stat={s.stat.name} value={s.base_stat} delay={i * 0.1} />
                      ))}
                    </div>
                  </FadeIn>
                )}

                {activeTab === 'moves' && (
                  <FadeIn>
                    <h3 className="font-display font-bold text-white mb-4">Moves ({pokemon.moves.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-y-auto">
                      {pokemon.moves.slice(0, 50).map(({ move }) => (
                        <span key={move.name} className="px-3 py-1.5 glass rounded-lg text-xs text-gray-300 capitalize">
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
                          <div className="w-10 h-10 rounded-xl bg-poke-yellow/20 flex items-center justify-center shrink-0">
                            <IoSparkles className="text-poke-yellow" />
                          </div>
                          <div>
                            <p className="font-semibold text-white capitalize">{formatPokemonName(ability.name)}</p>
                            {is_hidden && <span className="text-xs text-poke-yellow">Hidden Ability</span>}
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
                    {megaForms.length > 0 && (
                      <div className="mt-8">
                        <h4 className="font-display font-bold text-poke-red mb-4">Mega Evolution</h4>
                        <div className="flex flex-wrap gap-4">
                          {megaForms.map((m) => (
                            <Link key={m.id} to={`/pokemon/${m.name}`} className="glass rounded-xl p-3 text-center card-hover">
                              <img src={getPokemonImage(m)} alt={m.name} loading="lazy" className="w-20 h-20 object-contain mx-auto" />
                              <p className="text-xs text-white capitalize mt-2">{formatPokemonName(m.name)}</p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </FadeIn>
                )}

                {activeTab === 'entries' && (
                  <FadeIn>
                    <h3 className="font-display font-bold text-white mb-4">Pokédex Entries</h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {flavorEntries.slice(-8).reverse().map((entry, i) => (
                        <div key={i} className="glass rounded-xl p-4">
                          <p className="text-xs text-poke-yellow mb-1 capitalize">
                            {entry.version?.name?.replace('-', ' ') || 'Unknown Game'}
                          </p>
                          <p className="text-sm text-gray-300 italic">{entry.flavor_text.replace(/\f|\n/g, ' ')}</p>
                        </div>
                      ))}
                    </div>
                  </FadeIn>
                )}

                {activeTab === 'forms' && (
                  <FadeIn>
                    <h3 className="font-display font-bold text-white mb-4">All Forms ({varieties.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {varieties.map((v) => (
                        <Link
                          key={v.id}
                          to={`/pokemon/${v.name}`}
                          className={`glass rounded-xl p-3 text-center card-hover ${v.id === pokemon.id ? 'ring-2 ring-poke-yellow' : ''}`}
                        >
                          <img src={getPokemonImage(v)} alt={v.name} loading="lazy" className="w-16 h-16 object-contain mx-auto" />
                          <p className="text-xs text-white capitalize mt-2">{formatPokemonName(v.name)}</p>
                          <div className="mt-1 flex justify-center"><FormBadge name={v.name} /></div>
                        </Link>
                      ))}
                    </div>
                    {regionalForms.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-bold text-gray-400 mb-2">Regional Forms</h4>
                        <div className="flex flex-wrap gap-2">
                          {regionalForms.map((r) => (
                            <Link key={r.id} to={`/pokemon/${r.name}`}>
                              <FormBadge name={r.name} size="md" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
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
