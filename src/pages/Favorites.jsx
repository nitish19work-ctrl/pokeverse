import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoHeart, IoTrash } from 'react-icons/io5';
import ParticleBackground from '../components/ui/ParticleBackground';
import PokemonCard from '../components/pokemon/PokemonCard';
import { PokemonGridSkeleton } from '../components/ui/LoadingSkeleton';
import RippleButton from '../components/ui/RippleButton';
import { FadeIn } from '../components/ui/PageTransition';
import { fetchPokemonBatch } from '../api/pokeapi';
import { useFavorites } from '../hooks/useFavorites';

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) {
      setPokemon([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchPokemonBatch(favorites.map((f) => f.name))
      .then(setPokemon)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [favorites]);

  return (
    <div className="relative min-h-screen">
      <ParticleBackground count={30} color="rgba(239, 68, 68, 0.4)" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <div className="flex items-center gap-3 mb-2">
            <IoHeart className="text-poke-red text-3xl" />
            <h1 className="font-display text-4xl sm:text-5xl font-black text-white">
              My <span className="text-gradient">Favorites</span>
            </h1>
          </div>
          <p className="text-gray-400 mb-10">
            {favorites.length} Pokémon saved to your collection
          </p>
        </FadeIn>

        {loading ? (
          <PokemonGridSkeleton count={6} />
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <IoHeart className="text-6xl text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl text-white mb-2">No favorites yet</h2>
            <p className="text-gray-400 mb-6">
              Start exploring and tap the heart icon to save your favorite Pokémon
            </p>
            <RippleButton to="/pokedex">Explore Pokédex</RippleButton>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <AnimatePresence>
              {pokemon.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <PokemonCard pokemon={p} index={i} />
                  <button
                    onClick={() => removeFavorite(p.id)}
                    className="absolute top-2 left-2 p-1.5 rounded-full bg-poke-red/80 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    aria-label="Remove favorite"
                  >
                    <IoTrash className="text-white text-sm" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
