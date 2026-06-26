import { motion } from 'framer-motion';
import ParticleBackground from '../components/ui/ParticleBackground';
import RippleButton from '../components/ui/RippleButton';

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center">
      <ParticleBackground count={20} color="rgba(239, 68, 68, 0.4)" />

      <div className="relative text-center px-4">
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-8"
        >
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png"
            alt="Psyduck confused"
            className="w-48 h-48 mx-auto object-contain opacity-80"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-8xl font-black text-gradient mb-4"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 mb-2"
        >
          Oops! This Pokémon fled into the tall grass.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 mb-8"
        >
          The page you're looking for doesn't exist.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <RippleButton to="/">
            Return Home
          </RippleButton>
        </motion.div>
      </div>
    </div>
  );
}
