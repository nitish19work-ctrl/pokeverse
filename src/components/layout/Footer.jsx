import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaTwitter, FaYoutube } from 'react-icons/fa';
import { IoHeart } from 'react-icons/io5';
import { NAV_LINKS } from '../../data/constants';

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10">
      <div className="absolute inset-0 bg-gradient-to-t from-poke-dark-2 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src="/pokeball.svg" alt="PokéVerse" className="w-10 h-10" />
              <span className="font-display font-bold text-2xl text-gradient">PokéVerse</span>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-md">
              The ultimate Pokémon experience. Explore the Pokédex, build your dream team,
              compare stats, and discover legendary Pokémon from every region.
            </p>
            <div className="flex gap-4 mt-6">
              {[
                { icon: FaGithub, href: 'https://github.com', label: 'GitHub' },
                { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
                { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="p-3 rounded-xl glass hover:bg-white/10 transition-colors"
                  aria-label={label}
                >
                  <Icon className="text-gray-400 hover:text-poke-yellow text-xl transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-4">Explore</h4>
            <ul className="space-y-2">
              {NAV_LINKS.slice(0, 5).map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-poke-yellow transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-4">Tools</h4>
            <ul className="space-y-2">
              {NAV_LINKS.slice(5).map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-poke-yellow transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Made with <IoHeart className="text-poke-red" /> using PokéAPI
          </p>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} PokéVerse. Not affiliated with Nintendo or The Pokémon Company.
          </p>
        </div>
      </div>
    </footer>
  );
}
