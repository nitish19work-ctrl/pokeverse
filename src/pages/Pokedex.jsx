import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoFilter, IoClose } from 'react-icons/io5';
import ParticleBackground from '../components/ui/ParticleBackground';
import SearchBar from '../components/ui/SearchBar';
import PokemonCard from '../components/pokemon/PokemonCard';
import { PokemonGridSkeleton } from '../components/ui/LoadingSkeleton';
import { FadeIn } from '../components/ui/PageTransition';
import VirtualPokemonGrid from '../components/pokemon/VirtualPokemonGrid';
import Seo from '../components/ui/Seo';
import {
  fetchPokemonList,
  fetchPokemon,
  fetchAllPokemonEntries,
  fetchType,
  getPokemonIdFromUrl,
} from '../api/pokeapi';
import {
  POKEMON_PER_PAGE,
  ALL_TYPES,
  GENERATIONS,
  REGIONS,
  FORM_FILTERS,
  TOTAL_POKEMON,
} from '../data/constants';
import { filterByFormCategory, FORM_CATEGORIES } from '../utils/pokemonForms';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

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
  const [error, setError] = useState(null);
  const [formFilter, setFormFilter] = useState(searchParams.get('form') || FORM_CATEGORIES.ALL);

  const typeListRef = useRef([]);
  const filteredEntriesRef = useRef([]);

  useEffect(() => {
    fetchAllPokemonEntries()
      .then((names) => {
        setAllNames(names);
      })
      .catch(() => {
        setError('Failed to load Pokémon list. Please refresh.');
        setLoading(false);
      });
  }, []);

  const getGenRange = useCallback(() => {
    if (genFilter) {
      const gen = GENERATIONS.find((g) => g.id === parseInt(genFilter, 10));
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

  const fetchDetails = async (entries) => {
    const details = await Promise.allSettled(
      entries.map((entry) => fetchPokemon(entry.name || entry))
    );
    return details.filter((r) => r.status === 'fulfilled').map((r) => r.value);
  };

  const sortPokemon = useCallback(
    (list) => {
      if (sortBy === 'name') {
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      }
      return list;
    },
    [sortBy]
  );

  const getFilteredEntries = useCallback(() => {
    let entries = filterByFormCategory(allNames, formFilter);
    const range = getGenRange();
    if (range) {
      entries = entries.filter((e) => {
        const id = e.id || getPokemonIdFromUrl(e.url);
        return id >= range[0] && id <= range[1];
      });
    }
    if (sortBy === 'name') {
      entries = [...entries].sort((a, b) => a.name.localeCompare(b.name));
    }
    filteredEntriesRef.current = entries;
    return entries;
  }, [allNames, formFilter, getGenRange, sortBy]);

  const loadPokemon = useCallback(
    async (currentOffset, append = false) => {
      const needsIndex = typeFilter || formFilter !== FORM_CATEGORIES.ALL || getGenRange();
      if (needsIndex && allNames.length === 0) {
        if (!append) setLoading(true);
        return;
      }

      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        let results = [];

        if (typeFilter) {
          if (typeListRef.current.length === 0 || typeListRef.current._type !== typeFilter) {
            const typeData = await fetchType(typeFilter);
            typeListRef.current = typeData.pokemon.map((p) => p.pokemon);
            typeListRef.current._type = typeFilter;
          }
          let typeEntries = typeListRef.current;
          typeEntries = filterByFormCategory(
            typeEntries.map((p) => ({ name: p.name, url: p.url, id: getPokemonIdFromUrl(p.url) })),
            formFilter
          );
          const slice = typeEntries.slice(currentOffset, currentOffset + POKEMON_PER_PAGE);
          results = await fetchDetails(slice);
          setHasMore(currentOffset + POKEMON_PER_PAGE < typeEntries.length);
        } else if (formFilter !== FORM_CATEGORIES.ALL || getGenRange()) {
          const entries = getFilteredEntries();
          const slice = entries.slice(currentOffset, currentOffset + POKEMON_PER_PAGE);
          results = await fetchDetails(slice);
          setHasMore(currentOffset + POKEMON_PER_PAGE < entries.length);
        } else {
          const data = await fetchPokemonList(POKEMON_PER_PAGE, currentOffset);
          results = await fetchDetails(data.results);
          setHasMore(data.results.length === POKEMON_PER_PAGE && currentOffset + POKEMON_PER_PAGE < TOTAL_POKEMON);
        }

        results = sortPokemon(results);

        if (append) {
          setPokemon((prev) => [...prev, ...results]);
        } else {
          setPokemon(results);
        }
      } catch {
        setError('Failed to load Pokémon. Please try again.');
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [getGenRange, typeFilter, formFilter, sortPokemon, getFilteredEntries, allNames]
  );

  const runSearchQuery = useCallback(
    async (trimmed) => {
      if (!trimmed) {
        setSearchResults(null);
        return;
      }

      if (allNames.length === 0) return;

      setLoading(true);
      setError(null);

      try {
        let filtered = filterByFormCategory(allNames, formFilter).filter((p) =>
          p.name.toLowerCase().includes(trimmed.toLowerCase())
        );

        const range = getGenRange();
        if (range) {
          filtered = filtered.filter((p) => {
            const id = getPokemonIdFromUrl(p.url);
            return id >= range[0] && id <= range[1];
          });
        }

        if (typeFilter) {
          if (typeListRef.current.length === 0 || typeListRef.current._type !== typeFilter) {
            const typeData = await fetchType(typeFilter);
            typeListRef.current = typeData.pokemon.map((p) => p.pokemon);
            typeListRef.current._type = typeFilter;
          }
          const typeNames = new Set(typeListRef.current.map((p) => p.name));
          filtered = filtered.filter((p) => typeNames.has(p.name));
        }

        const toFetch = filtered.slice(0, 48);
        const results = await fetchDetails(toFetch);
        setSearchResults(sortPokemon(results));
        setHasMore(false);
      } catch {
        setError('Search failed. Please try again.');
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    },
    [allNames, getGenRange, typeFilter, formFilter, sortPokemon]
  );

  const handleSearch = useCallback(
    (query) => {
      const trimmed = query.trim();
      setSearch(trimmed);
      if (trimmed) {
        setSearchParams({ search: trimmed });
      } else {
        setSearchParams({});
      }
    },
    [setSearchParams]
  );

  useEffect(() => {
    const initialGen = searchParams.get('generation');
    const initialForm = searchParams.get('form');
    const initialSearch = searchParams.get('search');
    if (initialGen) setGenFilter(initialGen);
    if (initialForm) setFormFilter(initialForm);
    if (initialSearch) setSearch(initialSearch);
  }, []);

  useEffect(() => {
    const needsIndex = Boolean(
      search || typeFilter || formFilter !== FORM_CATEGORIES.ALL || getGenRange()
    );
    if (needsIndex && allNames.length === 0) return;

    if (search) {
      runSearchQuery(search);
      return;
    }

    typeListRef.current = [];
    setSearchResults(null);
    setOffset(0);
    loadPokemon(0, false);
  }, [
    allNames,
    typeFilter,
    regionFilter,
    genFilter,
    formFilter,
    sortBy,
    search,
    loadPokemon,
    runSearchQuery,
    getGenRange,
  ]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && searchResults === null && !search) {
      const newOffset = offset + POKEMON_PER_PAGE;
      setOffset(newOffset);
      loadPokemon(newOffset, true);
    }
  }, [offset, loadingMore, hasMore, searchResults, search, loadPokemon]);

  const loadMoreRef = useInfiniteScroll(loadMore, hasMore && searchResults === null && !search);

  const displayPokemon = searchResults !== null ? searchResults : pokemon;

  const activeFilters = [typeFilter, regionFilter, genFilter].filter(Boolean).length;

  const clearFilters = () => {
    setTypeFilter('');
    setRegionFilter('');
    setGenFilter('');
    setFormFilter(FORM_CATEGORIES.ALL);
    setSearch('');
    setSearchResults(null);
    setOffset(0);
    typeListRef.current = [];
    setSearchParams({});
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Seo
        title="Pokédex"
        description="Browse every Pokémon including Mega Evolutions, regional forms, and alternate forms across all generations."
        path="/pokedex"
      />
      <ParticleBackground count={30} color="rgba(59, 130, 246, 0.5)" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white mb-2">
            Poké<span className="text-gradient-yellow">dex</span>
          </h1>
          <p className="text-gray-400 mb-4">
            Discover {TOTAL_POKEMON}+ Pokémon including Mega, Regional & Alternate forms
          </p>
        </FadeIn>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {FORM_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setFormFilter(f.id);
                setSearch('');
                setSearchResults(null);
                setSearchParams({});
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors shrink-0 ${
                formFilter === f.id
                  ? 'bg-poke-yellow/20 text-poke-yellow border border-poke-yellow/30'
                  : 'glass text-gray-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by name, mega, or form..."
            className="w-full sm:flex-1 min-w-0"
            defaultValue={search}
            suggestions={allNames}
            suggestionLinkBase={`/pokemon`}
          />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-5 py-3 glass rounded-2xl hover:bg-white/10 transition-colors lg:hidden shrink-0"
          >
            <IoFilter />
            Filters {activeFilters > 0 && `(${activeFilters})`}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.aside
            className={`lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="glass rounded-2xl p-5 lg:sticky space-y-5" style={{ top: 'calc(var(--navbar-height) + 1rem)' }}>
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-white">Filters</h3>
                {(activeFilters > 0 || search) && (
                  <button
                    type="button"
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
                  className="w-full px-3 py-2 glass rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-poke-yellow/50 bg-poke-dark-3"
                >
                  <option value="number">Number</option>
                  <option value="name">A — Z</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setSearch('');
                    setSearchResults(null);
                    setTypeFilter(e.target.value);
                  }}
                  className="w-full px-3 py-2 glass rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-poke-yellow/50 capitalize bg-poke-dark-3"
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
                    setSearch('');
                    setSearchResults(null);
                    setRegionFilter(e.target.value);
                    setGenFilter('');
                  }}
                  className="w-full px-3 py-2 glass rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-poke-yellow/50 capitalize bg-poke-dark-3"
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
                    setSearch('');
                    setSearchResults(null);
                    setGenFilter(e.target.value);
                    setRegionFilter('');
                  }}
                  className="w-full px-3 py-2 glass rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-poke-yellow/50 bg-poke-dark-3"
                >
                  <option value="">All Generations</option>
                  {GENERATIONS.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.aside>

          <div className="flex-1 min-w-0">
            {error && (
              <div className="glass rounded-xl p-4 mb-4 text-poke-red text-sm text-center">
                {error}
              </div>
            )}

            {loading ? (
              <PokemonGridSkeleton count={12} />
            ) : displayPokemon.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No Pokémon found matching your criteria.</p>
                <button type="button" onClick={clearFilters} className="text-poke-yellow mt-4 hover:underline">
                  Clear all filters
                </button>
              </div>
            ) : displayPokemon.length >= 48 && searchResults !== null ? (
              <VirtualPokemonGrid pokemon={displayPokemon} columns={4} />
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {displayPokemon.map((p, i) => (
                    <PokemonCard key={p.id} pokemon={p} index={i % 12} />
                  ))}
                </div>

                {loadingMore && <PokemonGridSkeleton count={6} />}

                {searchResults === null && !search && (
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
