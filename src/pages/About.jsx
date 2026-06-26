import { motion } from 'framer-motion';
import {
  IoCodeSlash,
  IoRocket,
  IoHeart,
  IoGlobe,
  IoFlash,
} from 'react-icons/io5';
import { FaReact } from 'react-icons/fa';
import { SiVite, SiTailwindcss, SiFramer } from 'react-icons/si';
import ParticleBackground from '../components/ui/ParticleBackground';
import RippleButton from '../components/ui/RippleButton';
import { FadeIn, SlideIn, ScaleIn } from '../components/ui/PageTransition';

const techStack = [
  { icon: FaReact, name: 'React 19', color: '#61DAFB' },
  { icon: SiVite, name: 'Vite', color: '#646CFF' },
  { icon: SiTailwindcss, name: 'Tailwind CSS', color: '#06B6D4' },
  { icon: SiFramer, name: 'Framer Motion', color: '#FF0080' },
];

const features = [
  { icon: IoGlobe, title: 'Complete Pokédex', desc: 'Browse all 1,025+ Pokémon with search, filters, and infinite scroll.' },
  { icon: IoFlash, title: 'Battle Comparison', desc: 'Compare stats side-by-side with animated charts and visual breakdowns.' },
  { icon: IoRocket, title: 'Team Builder', desc: 'Create your dream team of 6 Pokémon with type coverage analysis.' },
  { icon: IoHeart, title: 'Favorites', desc: 'Save your favorite Pokémon locally and access them anytime.' },
  { icon: IoCodeSlash, title: 'Premium Design', desc: 'Glassmorphism, GSAP animations, particle backgrounds, and micro-interactions.' },
];

export default function About() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground count={35} color="rgba(255, 215, 0, 0.4)" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <div className="text-center mb-16">
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-24 h-24 mx-auto mb-6"
            >
              <img src="/pokeball.svg" alt="PokéVerse" className="w-full h-full" />
            </motion.div>
            <h1 className="font-display text-4xl sm:text-6xl font-black text-white mb-4">
              About <span className="text-gradient">PokéVerse</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              PokéVerse is a premium Pokémon web experience built with modern frontend
              technologies. Designed to showcase what's possible when passion meets code.
            </p>
          </div>
        </FadeIn>

        {/* Tech Stack */}
        <SlideIn direction="up">
          <h2 className="font-display text-2xl font-bold text-white mb-6 text-center">
            Built With
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
            {techStack.map(({ icon: Icon, name, color }, i) => (
              <ScaleIn key={name} delay={i * 0.1}>
                <div className="glass rounded-2xl p-6 text-center card-hover">
                  <Icon className="text-3xl mx-auto mb-3" style={{ color }} />
                  <p className="text-sm font-semibold text-white">{name}</p>
                </div>
              </ScaleIn>
            ))}
          </div>
        </SlideIn>

        {/* Features */}
        <div className="space-y-4 mb-16">
          <h2 className="font-display text-2xl font-bold text-white mb-6 text-center">
            Features
          </h2>
          {features.map(({ icon: Icon, title, desc }, i) => (
            <SlideIn key={title} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.05}>
              <div className="glass rounded-2xl p-6 flex items-start gap-4 card-hover">
                <div className="p-3 rounded-xl bg-poke-yellow/10 shrink-0">
                  <Icon className="text-poke-yellow text-xl" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white mb-1">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            </SlideIn>
          ))}
        </div>

        {/* API Credit */}
        <FadeIn>
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-gray-400 mb-4">
              All Pokémon data is provided by the wonderful{' '}
              <a
                href="https://pokeapi.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-poke-yellow hover:underline"
              >
                PokéAPI
              </a>
            </p>
            <p className="text-gray-500 text-sm mb-6">
              PokéVerse is a fan project and is not affiliated with Nintendo, Game Freak, or The Pokémon Company.
            </p>
            <RippleButton to="/pokedex">
              Start Exploring
            </RippleButton>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
