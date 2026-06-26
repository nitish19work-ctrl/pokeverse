import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoArrowForward } from 'react-icons/io5';
import ParticleBackground from '../components/ui/ParticleBackground';
import { FadeIn, ScaleIn } from '../components/ui/PageTransition';
import { REGIONS, GENERATIONS } from '../data/constants';

export default function Regions() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground count={40} color="rgba(59, 130, 246, 0.5)" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white mb-2">
            Pokémon <span className="text-gradient">Regions</span>
          </h1>
          <p className="text-gray-400 mb-12 max-w-2xl">
            Journey through nine unique regions, each with its own culture, Pokémon, and legends waiting to be discovered.
          </p>
        </FadeIn>

        <div className="space-y-8">
          {REGIONS.map((region, i) => {
            const gen = GENERATIONS.find((g) => g.id === region.generation);
            return (
              <ScaleIn key={region.id} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`glass rounded-3xl overflow-hidden bg-gradient-to-r ${region.gradient}`}
                >
                  <div className="grid md:grid-cols-3 gap-0">
                    <div
                      className="md:col-span-1 p-8 flex flex-col justify-center relative overflow-hidden"
                      style={{ backgroundColor: `${region.color}10` }}
                    >
                      <div
                        className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-30"
                        style={{ backgroundColor: region.color }}
                      />
                      <span className="text-xs font-mono text-gray-400 mb-2">
                        Generation {region.generation}
                      </span>
                      <h2
                        className="font-display text-3xl font-black mb-2"
                        style={{ color: region.color }}
                      >
                        {region.name}
                      </h2>
                      <p className="text-sm text-gray-400">
                        {region.pokemonCount} Pokémon · #{gen?.range[0]}–{gen?.range[1]}
                      </p>
                    </div>

                    <div className="md:col-span-2 p-8">
                      <p className="text-gray-300 leading-relaxed mb-6">
                        {region.description}
                      </p>
                      <Link
                        to={`/pokedex?generation=${region.generation}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all"
                        style={{ color: region.color }}
                      >
                        Explore {region.name} Pokémon <IoArrowForward />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </ScaleIn>
            );
          })}
        </div>
      </div>
    </div>
  );
}
