import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useRef } from 'react';
import ParticleBackground from '../components/ui/ParticleBackground';
import TypeBadge from '../components/ui/TypeBadge';
import { PokemonGridSkeleton } from '../components/ui/LoadingSkeleton';
import { FadeIn } from '../components/ui/PageTransition';
import { fetchPokemonBatch, getPokemonImage } from '../api/pokeapi';
import { LEGENDARY_POKEMON } from '../data/constants';
import { formatPokemonName, getTotalStats } from '../utils/helpers';

export default function Legendary() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef(null);

  useEffect(() => {
    fetchPokemonBatch(LEGENDARY_POKEMON.map((p) => p.name))
      .then(setPokemon)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!pokemon.length || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('.legendary-card');
    gsap.from(cards, {
      y: 60,
      opacity: 0,
      stagger: 0.08,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: undefined,
    });
  }, [pokemon]);

  return (
    <div className="relative min-h-screen">
      <ParticleBackground count={45} color="rgba(255, 215, 0, 0.5)" />

      <div className="absolute inset-0 bg-gradient-to-b from-poke-yellow/5 via-transparent to-poke-red/5 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <div className="text-center mb-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 mx-auto mb-6 relative"
            >
              <div className="absolute inset-0 bg-poke-yellow/30 rounded-full blur-xl" />
              <img src="/pokeball.svg" alt="" className="relative w-full h-full" />
            </motion.div>
            <h1 className="font-display text-4xl sm:text-6xl font-black text-white mb-4">
              Legendary <span className="text-gradient">Pokémon</span>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              The rarest and most powerful Pokémon in existence. These mythical creatures
              have shaped the history of every region.
            </p>
          </div>
        </FadeIn>

        {loading ? (
          <PokemonGridSkeleton count={12} />
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pokemon.map((p) => (
              <Link key={p.id} to={`/pokemon/${p.id}`} className="legendary-card block group">
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="glass rounded-3xl overflow-hidden relative glow-yellow"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-poke-yellow/10 via-transparent to-poke-red/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs font-mono text-poke-yellow mb-1">
                          #{String(p.id).padStart(4, '0')}
                        </p>
                        <h3 className="font-display text-xl font-black text-white capitalize group-hover:text-poke-yellow transition-colors">
                          {formatPokemonName(p.name)}
                        </h3>
                      </div>
                      <div className="flex gap-1">
                        {p.types.map(({ type }) => (
                          <TypeBadge key={type.name} type={type.name} size="sm" />
                        ))}
                      </div>
                    </div>

                    <div className="relative h-48 flex items-center justify-center">
                      <div className="absolute inset-0 bg-poke-yellow/10 rounded-full blur-2xl group-hover:bg-poke-yellow/20 transition-colors" />
                      <img
                        src={getPokemonImage(p)}
                        alt={p.name}
                        loading="lazy"
                        className="relative h-44 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        BST: <span className="text-poke-yellow font-bold">{getTotalStats(p.stats)}</span>
                      </span>
                      <span className="text-xs text-poke-yellow font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details →
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
