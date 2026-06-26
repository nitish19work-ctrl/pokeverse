import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoTrash, IoSearch } from 'react-icons/io5';
import ParticleBackground from '../components/ui/ParticleBackground';
import SearchBar from '../components/ui/SearchBar';
import TypeBadge from '../components/ui/TypeBadge';
import RippleButton from '../components/ui/RippleButton';
import { FadeIn } from '../components/ui/PageTransition';
import { fetchPokemon, getPokemonImage, fetchAllPokemonNames } from '../api/pokeapi';
import { useTeamBuilder } from '../hooks/useTeamBuilder';
import { formatPokemonName, getTotalStats } from '../utils/helpers';

export default function TeamBuilder() {
  const { team, addToTeam, removeFromTeam, clearTeam, teamCount } = useTeamBuilder();
  const [teamPokemon, setTeamPokemon] = useState(Array(6).fill(null));
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [allNames, setAllNames] = useState([]);

  useEffect(() => {
    fetchAllPokemonNames().then(setAllNames).catch(() => {});
  }, []);

  useEffect(() => {
    const loadTeam = async () => {
      const loaded = await Promise.all(
        team.map(async (slot) => {
          if (!slot) return null;
          try {
            return await fetchPokemon(slot.name);
          } catch {
            return null;
          }
        })
      );
      setTeamPokemon(loaded);
    };
    loadTeam();
  }, [team]);

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    const filtered = allNames
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8);

    const results = await Promise.allSettled(
      filtered.map((p) => fetchPokemon(p.name))
    );
    setSearchResults(
      results.filter((r) => r.status === 'fulfilled').map((r) => r.value)
    );
  };

  const teamTypes = teamPokemon
    .filter(Boolean)
    .flatMap((p) => p.types.map((t) => t.type.name));
  const uniqueTypes = [...new Set(teamTypes)];

  return (
    <div className="relative min-h-screen">
      <ParticleBackground count={30} color="rgba(34, 197, 94, 0.4)" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white mb-2">
            Team <span className="text-gradient">Builder</span>
          </h1>
          <p className="text-gray-400 mb-10">
            Build your ultimate team of 6 Pokémon ({teamCount}/6)
          </p>
        </FadeIn>

        {/* Team Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {teamPokemon.map((pokemon, index) => (
            <motion.div
              key={index}
              layout
              className="aspect-square"
            >
              {pokemon ? (
                <div className="glass rounded-2xl p-4 h-full relative group card-hover">
                  <button
                    onClick={() => removeFromTeam(index)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-poke-red/80 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <IoClose className="text-white text-sm" />
                  </button>
                  <Link to={`/pokemon/${pokemon.id}`} className="block h-full flex flex-col items-center justify-center">
                    <img
                      src={getPokemonImage(pokemon)}
                      alt={pokemon.name}
                      className="w-20 h-20 object-contain"
                    />
                    <p className="text-sm font-bold text-white capitalize mt-2 text-center">
                      {formatPokemonName(pokemon.name)}
                    </p>
                    <div className="flex gap-1 mt-1">
                      {pokemon.types.map(({ type }) => (
                        <TypeBadge key={type.name} type={type.name} size="sm" />
                      ))}
                    </div>
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="glass rounded-2xl h-full w-full flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-poke-yellow/30 transition-colors cursor-pointer"
                >
                  <IoSearch className="text-3xl text-gray-600 mb-2" />
                  <span className="text-xs text-gray-500">Add Pokémon</span>
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Team Analysis */}
        {teamCount > 0 && (
          <FadeIn>
            <div className="glass rounded-2xl p-6 mb-8">
              <h3 className="font-display font-bold text-white mb-4">Team Analysis</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-gray-400 mb-2">Type Coverage</p>
                  <div className="flex flex-wrap gap-1">
                    {uniqueTypes.map((t) => (
                      <TypeBadge key={t} type={t} size="sm" />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-2">Average BST</p>
                  <p className="text-2xl font-black text-poke-yellow">
                    {Math.round(
                      teamPokemon.filter(Boolean).reduce((sum, p) => sum + getTotalStats(p.stats), 0) /
                        teamCount
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-2">Team Size</p>
                  <p className="text-2xl font-black text-white">{teamCount}/6</p>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        <div className="flex gap-4">
          <RippleButton onClick={() => setShowSearch(true)}>
            <IoSearch /> Add Pokémon
          </RippleButton>
          {teamCount > 0 && (
            <RippleButton onClick={clearTeam} variant="danger">
              <IoTrash /> Clear Team
            </RippleButton>
          )}
        </div>

        {/* Search Modal */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowSearch(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="glass-strong rounded-2xl p-6 w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-white">Search Pokémon</h3>
                  <button onClick={() => setShowSearch(false)} className="text-gray-400 hover:text-white">
                    <IoClose className="text-xl" />
                  </button>
                </div>
                <SearchBar onSearch={handleSearch} placeholder="Type a Pokémon name..." />
                <div className="mt-4 max-h-64 overflow-y-auto space-y-2">
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        addToTeam(p);
                        setShowSearch(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                    >
                      <img
                        src={getPokemonImage(p)}
                        alt={p.name}
                        className="w-10 h-10 object-contain"
                      />
                      <span className="text-white capitalize font-semibold">
                        {formatPokemonName(p.name)}
                      </span>
                      <div className="flex gap-1 ml-auto">
                        {p.types.map(({ type }) => (
                          <TypeBadge key={type.name} type={type.name} size="sm" />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
