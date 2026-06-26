import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMenu, IoClose, IoMoon, IoSunny } from 'react-icons/io5';
import { NAV_LINKS } from '../../data/constants';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/pokedex') {
      return location.pathname === '/pokedex' || location.pathname.startsWith('/pokemon/');
    }
    if (path === '/search') return location.pathname === '/search';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled ? 'glass-strong shadow-lg shadow-black/20' : 'bg-[var(--theme-bg)]/80 backdrop-blur-md'
      } ${mobileOpen ? 'pb-0' : ''}`}
      style={{ minHeight: 'var(--navbar-height)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[var(--navbar-height)] flex items-center">
        <div className="flex items-center justify-between gap-4 w-full">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-9 h-9 sm:w-10 sm:h-10 relative"
            >
              <div className="absolute inset-0 bg-poke-yellow/30 rounded-full blur-md group-hover:bg-poke-yellow/50 transition-colors" />
              <img src="/pokeball.svg" alt="PokéVerse" className="relative w-full h-full" />
            </motion.div>
            <span className="font-display font-bold text-lg sm:text-xl text-gradient hidden sm:block">
              PokéVerse
            </span>
          </Link>

          <div className="hidden xl:flex items-center gap-0.5 overflow-x-auto">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-2.5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors whitespace-nowrap"
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="navbar-underline"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-poke-yellow to-poke-blue rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl glass hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <IoSunny className="text-poke-yellow text-lg sm:text-xl" />
              ) : (
                <IoMoon className="text-poke-blue text-lg sm:text-xl" />
              )}
            </motion.button>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-2 sm:p-2.5 rounded-xl glass hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <IoClose className="text-white text-xl sm:text-2xl" />
              ) : (
                <IoMenu className="text-white text-xl sm:text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden glass-strong border-t border-white/10 overflow-hidden absolute left-0 right-0 top-[var(--navbar-height)] z-[100] shadow-xl"
          >
            <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'bg-poke-yellow/10 text-poke-yellow'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
