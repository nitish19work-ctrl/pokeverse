import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoSearch } from 'react-icons/io5';
import ParticleBackground from '../components/ui/ParticleBackground';
import SearchBar from '../components/ui/SearchBar';
import TypeBadge from '../components/ui/TypeBadge';
import FormBadge from '../components/ui/FormBadge';
import Seo from '../components/ui/Seo';
import { FadeIn } from '../components/ui/PageTransition';
import { fetchAllPokemonEntries, globalSearch, getPokemonIdFromUrl } from '../api/pokeapi';
import { formatPokemonName } from '../utils/helpers';
import { ALL_TYPES } from '../data/constants';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetchAllPokemonEntries().then(setEntries).catch(() => {});
  }, []);

  const runSearch = useCallback(
    async (q) => {
      const trimmed = q.trim();
      setQuery(trimmed);
      if (!trimmed) {
        setResults(null);
        return;
      }
      setLoading(true);
      try {
        const data = await globalSearch(trimmed, entries);
        setResults(data);
      } catch {
        setResults({ pokemon: [], abilities: [], moves: [], types: [] });
      } finally {
        setLoading(false);
      }
    },
    [entries]
  );

  const hasResults =
    results &&
    (results.pokemon.length ||
      results.abilities.length ||
      results.moves.length ||
      results.types.length);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Seo
        title="Search"
        description="Search Pokémon, Mega Evolutions, regional forms, abilities, moves, and types."
        path="/search"
      />
      <ParticleBackground count={25} color="rgba(255, 215, 0, 0.4)" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <div className="flex items-center gap-3 mb-2">
            <IoSearch className="text-poke-yellow text-3xl" />
            <h1 className="font-display text-4xl sm:text-5xl font-black text-white">
              Global <span className="text-gradient">Search</span>
            </h1>
          </div>
          <p className="text-gray-400 mb-8">
            Search Pokémon, Mega Evolutions, regional & alternate forms, abilities, moves, and types
          </p>
        </FadeIn>

        <SearchBar
          onSearch={runSearch}
          placeholder="Try charizard-mega-x, alolan, overgrow, thunderbolt..."
          className="mb-10"
          suggestions={entries}
          suggestionLinkBase="/pokemon"
        />

        {loading && (
          <div className="text-center py-12 text-gray-400">Searching...</div>
        )}

        {!loading && results && !hasResults && (
          <div className="text-center py-12 text-gray-400">No results for "{query}"</div>
        )}

        {results && hasResults && (
          <div className="space-y-10">
            {results.pokemon.length > 0 && (
              <section>
                <h2 className="font-display font-bold text-white mb-4">
                  Pokémon ({results.pokemon.length})
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {results.pokemon.map((entry) => (
                    <Link
                      key={entry.name}
                      to={`/pokemon/${entry.name}`}
                      className="glass rounded-xl p-4 flex items-center gap-4 card-hover"
                    >
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonIdFromUrl(entry.url)}.png`}
                        alt={entry.name}
                        loading="lazy"
                        className="w-14 h-14 object-contain"
                      />
                      <div>
                        <p className="font-semibold text-white capitalize">
                          {formatPokemonName(entry.name)}
                        </p>
                        <FormBadge name={entry.name} />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.types.length > 0 && (
              <section>
                <h2 className="font-display font-bold text-white mb-4">Types</h2>
                <div className="flex flex-wrap gap-2">
                  {results.types.map((t) => (
                    <Link key={t} to={`/types`}>
                      <TypeBadge type={t} size="lg" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.abilities.length > 0 && (
              <section>
                <h2 className="font-display font-bold text-white mb-4">Abilities</h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {results.abilities.map((a) => (
                    <Link
                      key={a.name}
                      to={`/search?ability=${a.name}`}
                      className="glass rounded-xl px-4 py-3 text-white capitalize hover:bg-white/5 transition-colors"
                    >
                      {formatPokemonName(a.name)}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.moves.length > 0 && (
              <section>
                <h2 className="font-display font-bold text-white mb-4">Moves</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {results.moves.map((m) => (
                    <span
                      key={m.name}
                      className="glass rounded-xl px-4 py-3 text-gray-300 capitalize text-sm"
                    >
                      {formatPokemonName(m.name)}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {!results && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {['pikachu', 'charizard-mega-x', 'rattata-alola', 'gengar-gmax', 'rayquaza-mega', 'greninja-ash'].map(
              (name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    handleSearch(name);
                  }}
                  className="glass rounded-xl px-4 py-3 text-sm text-gray-400 hover:text-poke-yellow hover:bg-white/5 transition-colors capitalize text-left"
                >
                  {formatPokemonName(name)}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
