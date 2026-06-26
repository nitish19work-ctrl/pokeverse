import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParticleBackground from '../components/ui/ParticleBackground';
import TypeBadge from '../components/ui/TypeBadge';
import { PokemonGridSkeleton } from '../components/ui/LoadingSkeleton';
import { FadeIn, ScaleIn } from '../components/ui/PageTransition';
import { ALL_TYPES, TYPE_COLORS } from '../data/constants';
import { fetchType, getPokemonIdFromUrl } from '../api/pokeapi';
import { formatPokemonName } from '../utils/helpers';

export default function Types() {
  const [selectedType, setSelectedType] = useState('fire');
  const [typeData, setTypeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchType(selectedType)
      .then(setTypeData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedType]);

  const pokemonList = typeData?.pokemon?.slice(0, 24) || [];
  const colors = TYPE_COLORS[selectedType] || { bg: '#A8A878' };

  return (
    <div className="relative min-h-screen">
      <ParticleBackground count={35} color="rgba(239, 68, 68, 0.4)" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white mb-2">
            Pokémon <span className="text-gradient">Types</span>
          </h1>
          <p className="text-gray-400 mb-10">
            Explore all 18 Pokémon types and discover which Pokémon belong to each
          </p>
        </FadeIn>

        {/* Type Selector */}
        <div className="flex flex-wrap gap-2 mb-10">
          {ALL_TYPES.map((type, i) => (
            <ScaleIn key={type} delay={i * 0.03}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedType(type)}
                className={`transition-all duration-300 ${selectedType === type ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
              >
                <TypeBadge type={type} size="md" />
              </motion.button>
            </ScaleIn>
          ))}
        </div>

        {/* Selected Type Info */}
        <FadeIn>
          <div
            className="glass rounded-3xl p-8 mb-10 relative overflow-hidden"
            style={{ borderColor: `${colors.bg}40` }}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: colors.bg }}
            />
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <TypeBadge type={selectedType} size="lg" />
                <h2 className="font-display text-2xl font-black text-white capitalize">
                  {selectedType} Type
                </h2>
              </div>
              {typeData && (
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-bold text-poke-red mb-2">Weak Against</h4>
                    <div className="flex flex-wrap gap-1">
                      {typeData.damage_relations?.double_damage_from?.map(({ name }) => (
                        <TypeBadge key={name} type={name} size="sm" />
                      )) || <span className="text-gray-500 text-sm">None</span>}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-green-400 mb-2">Strong Against</h4>
                    <div className="flex flex-wrap gap-1">
                      {typeData.damage_relations?.double_damage_to?.map(({ name }) => (
                        <TypeBadge key={name} type={name} size="sm" />
                      )) || <span className="text-gray-500 text-sm">None</span>}
                    </div>
                  </div>
                </div>
              )}
              <p className="text-gray-400 mt-4 text-sm">
                {typeData?.pokemon?.length || 0} Pokémon found
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Pokemon Grid */}
        {loading ? (
          <PokemonGridSkeleton count={12} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {pokemonList.map((entry, i) => {
              const pokeId = getPokemonIdFromUrl(entry.pokemon.url);
              const pokeName = entry.pokemon.name;
              return (
                <motion.div
                  key={pokeName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                >
                  <Link to={`/pokemon/${pokeId}`} className="block">
                    <div className="glass rounded-2xl p-4 text-center card-hover">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeId}.png`}
                        alt={pokeName}
                        loading="lazy"
                        className="w-24 h-24 mx-auto object-contain"
                        onError={(e) => {
                          e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`;
                        }}
                      />
                      <p className="text-sm font-bold text-white capitalize mt-2">
                        {formatPokemonName(pokeName)}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">#{String(pokeId).padStart(3, '0')}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
