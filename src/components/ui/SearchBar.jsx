import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSearch, IoClose } from 'react-icons/io5';
import { formatPokemonName } from '../../utils/helpers';

export default function SearchBar({
  onSearch,
  placeholder = 'Search Pokémon...',
  className = '',
  defaultValue = '',
  suggestions = [],
  suggestionLinkBase = '/pokemon',
  showSuggestions = true,
  debounceMs = 300,
}) {
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const emitSearch = (value) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch?.(value.trim()), debounceMs);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const filteredSuggestions = useMemo(() => {
    if (!query.trim() || !suggestions.length) return [];
    const q = query.toLowerCase().trim();
    return suggestions
      .filter((item) => {
        const name = typeof item === 'string' ? item : item.name;
        return name.toLowerCase().includes(q);
      })
      .slice(0, 8);
  }, [query, suggestions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (timerRef.current) clearTimeout(timerRef.current);
    onSearch?.(query.trim());
    setOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    if (timerRef.current) clearTimeout(timerRef.current);
    onSearch?.('');
    setOpen(false);
  };

  const pickSuggestion = (item) => {
    const name = typeof item === 'string' ? item : item.name;
    setQuery(name);
    if (timerRef.current) clearTimeout(timerRef.current);
    onSearch?.(name);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className={`relative w-full min-w-0 ${className}`}>
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative w-full">
          <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none z-[1]" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              emitSearch(e.target.value);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="theme-input w-full pl-12 pr-12 py-3.5 glass rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-poke-yellow/50 transition-all"
            autoComplete="off"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-poke-yellow transition-colors z-[1]"
                aria-label="Clear search"
              >
                <IoClose className="text-xl" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>

      <AnimatePresence>
        {showSuggestions && open && filteredSuggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[200] glass-strong rounded-2xl overflow-hidden shadow-xl max-h-64 overflow-y-auto"
          >
            {filteredSuggestions.map((item) => {
              const name = typeof item === 'string' ? item : item.name;
              const id = typeof item === 'object' ? item.id : null;
              return (
                <li key={name}>
                  {suggestionLinkBase ? (
                    <Link
                      to={`${suggestionLinkBase}/${name}`}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 text-sm theme-text hover:bg-white/5 transition-colors capitalize border-b border-white/5 last:border-0"
                    >
                      {formatPokemonName(name)}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => pickSuggestion(item)}
                      className="w-full text-left px-4 py-3 text-sm theme-text hover:bg-white/5 transition-colors capitalize border-b border-white/5 last:border-0"
                    >
                      {formatPokemonName(name)}
                    </button>
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
