import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoFilter, IoClose } from 'react-icons/io5';
import ParticleBackground from '../components/ui/ParticleBackground';
import SearchBar from '../components/ui/SearchBar';
import PokemonCard from '../components/pokemon/PokemonCard';
import { PokemonGridSkeleton } from '../components/ui/LoadingSkeleton';
import { FadeIn } from '../components/ui/PageTransition';
import { fetchPokemonList, fetchPokemon, fetchAllPokemonNames } from '../api/pokeapi';
import {
  POKEMON_PER_PAGE,
  ALL_TYPES,
  GENERATIONS,
  REGIONS,
} from '../data/constants';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { debounce } from '../utils/helpers';

export default function Pokedex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [typeFilter, setTypeFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [genFilter, setGenFilter] = useState(searchParams.get('generation') || '');
  const [sortBy, setSortBy] = useState('number');
  const [showFilters, setShowFilters] = useState(false);
  const [allNames, setAllNames] = useState([]);
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    fetchAllPokemonNames().then(setAllNames).catch(() => {});
  }, []);

  const getGenRange = useCallback(() => {
    if (genFilter) {
      const gen = GENERATIONS.find((g) => g.id === parseInt(genFilter));
      if (gen) return gen.range;
    }
    if (regionFilter) {
      const region = REGIONS.find((r) => r.id === regionFilter);
      if (region) {
        const gen = GENERATIONS.find((g) => g.id === region.generation);
        if (gen) return gen.range;
      }
    }
    return null;
  }, [genFilter, regionFilter]);

  const loadPokemon = useCallback(async (currentOffset, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const range = getGenRange();
      let startOffset = currentOffset;

      if (range) {
        startOffset = range[0] - 1 + currentOffset;
      }

      const data = await fetchPokemonList(POKEMON_PER_PAGE, startOffset);
      const details = await Promise.allSettled(
        data.results.map((p) => fetchPokemon(p.name))
      );
      let results = details
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value);

      if (typeFilter) {
        results = results.filter((p) =>
          p.types.some((t) => t.type.name === typeFilter)
        );
      }

      if (sortBy === 'name') {
        results.sort((a, b) => a.name.localeCompare(b.name));
      }

      if (append) {
        setPokemon((prev) => [...prev, ...results]);
      } else {
        setPokemon(results);
      }

      const totalInRange = range ? range[1] - range[0] + 1 : 1025;
      setHasMore(currentOffset + POKEMON_PER_PAGE < totalInRange && data.results.length === POKEMON_PER_PAGE);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [getGenRange, typeFilter, sortBy]);

  const handleSearch = useCallback(
    debounce(async (query) => {
      setSearch(query);
      if (!query) {
        setSearchResults(null);
        setOffset(0);
        loadPokemon(0, false);
        return;
      }

      setLoading(true);
      const filtered = allNames.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );

      const toFetch = filtered.slice(0, 24);
      const details = await Promise.allSettled(
        toFetch.map((p) => fetchPokemon(p.name))
      );
      const results = details
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value);

      setSearchResults(results);
      setHasMore(false);
      setLoading(false);
    }, 300),
    [allNames, loadPokemon]
  );

  useEffect(() => {
    const initialSearch = searchParams.get('search');
    const initialGen = searchParams.get('generation');
    if (initialSearch) handleSearch(initialSearch);
    if (initialGen) setGenFilter(initialGen);
  }, []);

  useEffect(() => {
    if (!search) {
      setOffset(0);
      loadPokemon(0, false);
    }
  }, [typeFilter, regionFilter, genFilter, sortBy]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && !searchResults) {
      const newOffset = offset + POKEMON_PER_PAGE;
      setOffset(newOffset);
      loadPokemon(newOffset, true);
    }
  }, [offset, loadingMore, hasMore, searchResults, loadPokemon]);

  const loadMoreRef = useInfiniteScroll(loadMore, hasMore && !searchResults);

  const displayPokemon = searchResults || pokemon;

  const activeFilters = [typeFilter, regionFilter, genFilter].filter(Boolean).length;

  const clearFilters = () => {
    setTypeFilter('');
    setRegionFilter('');
    setGenFilter('');
    setSearch('');
    setSearchResults(null);
    setSearchParams({});
  };

  return (
    <div className="relative min-h-screen">
      <ParticleBackground count={30} color="rgba(59, 130, 246, 0.5)" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white mb-2">
            Poké<span className="text-gradient-yellow">dex</span>
          </h1>
          <p className="text-gray-400 mb-8">
            Discover all 1,025+ Pokémon across every generation
          </p>
        </FadeIn>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by name..."
            className="flex-1"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-5 py-3 glass rounded-2xl hover:bg-white/10 transition-colors lg:hidden"
          >
            <IoFilter />
            Filters {activeFilters > 0 && `(${activeFilters})`}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.aside
            className={`lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="glass rounded-2xl p-5 sticky top-24 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-white">Filters</h3>
                {activeFilters > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-poke-red hover:text-poke-red-light flex items-center gap-1"
                  >
                    <IoClose /> Clear
                  </button>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 glass rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-poke-yellow/50"
                >
                  <option value="number">Number</option>
                  <option value="name">A — Z</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 glass rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-poke-yellow/50 capitalize"
                >
                  <option value="">All Types</option>
                  {ALL_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Region</label>
                <select
                  value={regionFilter}
                  onChange={(e) => {
                    setRegionFilter(e.target.value);
                    setGenFilter('');
                  }}
                  className="w-full px-3 py-2 glass rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-poke-yellow/50 capitalize"
                >
                  <option value="">All Regions</option>
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Generation</label>
                <select
                  value={genFilter}
                  onChange={(e) => {
                    setGenFilter(e.target.value);
                    setRegionFilter('');
                  }}
                  className="w-full px-3 py-2 glass rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-poke-yellow/50"
                >
                  <option value="">All Generations</option>
                  {GENERATIONS.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.aside>

          {/* Pokemon Grid */}
          <div className="flex-1">
            {loading ? (
              <PokemonGridSkeleton count={12} />
            ) : displayPokemon.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No Pokémon found matching your criteria.</p>
                <button onClick={clearFilters} className="text-poke-yellow mt-4 hover:underline">
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {displayPokemon.map((p, i) => (
                    <PokemonCard key={p.id} pokemon={p} index={i % 12} />
                  ))}
                </div>

                {loadingMore && <PokemonGridSkeleton count={6} />}

                {!searchResults && (
                  <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
                    {!hasMore && pokemon.length > 0 && (
                      <p className="text-gray-500 text-sm">You've reached the end!</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
