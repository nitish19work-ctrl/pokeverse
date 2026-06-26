import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IoClose, IoTrash, IoSearch, IoAdd, IoSwapVertical } from 'react-icons/io5';
import ParticleBackground from '../components/ui/ParticleBackground';
import SearchBar from '../components/ui/SearchBar';
import TypeBadge from '../components/ui/TypeBadge';
import Seo from '../components/ui/Seo';
import RippleButton from '../components/ui/RippleButton';
import { FadeIn } from '../components/ui/PageTransition';
import { fetchPokemon, getPokemonImage, fetchAllPokemonEntries } from '../api/pokeapi';
import { useTeamBuilder } from '../hooks/useTeamBuilder';
import { getTeamWeaknesses, getOffensiveCoverage } from '../data/typeChart';
import { formatPokemonName, getTotalStats } from '../utils/helpers';

function SortableSlot({ id, pokemon, index, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {pokemon ? (
        <div className="glass rounded-2xl p-4 h-full relative group card-hover">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="absolute top-2 left-2 p-1 rounded-full glass opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
            aria-label="Drag to reorder"
          >
            <IoSwapVertical className="text-gray-400 text-sm" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-2 right-2 p-1 rounded-full bg-poke-red/80 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <IoClose className="text-white text-sm" />
          </button>
          <Link to={`/pokemon/${pokemon.id}`} className="block h-full flex flex-col items-center justify-center pt-4">
            <img src={getPokemonImage(pokemon)} alt={pokemon.name} loading="lazy" className="w-20 h-20 object-contain" />
            <p className="text-sm font-bold text-white capitalize mt-2 text-center">{formatPokemonName(pokemon.name)}</p>
            <div className="flex gap-1 mt-1 flex-wrap justify-center">
              {pokemon.types.map(({ type }) => (
                <TypeBadge key={type.name} type={type.name} size="sm" />
              ))}
            </div>
          </Link>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="glass rounded-2xl h-full min-h-[180px] w-full flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-poke-yellow/30 transition-colors cursor-pointer"
        >
          <IoSearch className="text-3xl text-gray-600 mb-2" />
          <span className="text-xs text-gray-500">Slot {index + 1}</span>
        </button>
      )}
    </div>
  );
}

export default function TeamBuilder() {
  const {
    teams,
    activeTeamId,
    team,
    addToTeam,
    removeFromTeam,
    reorderTeam,
    clearTeam,
    teamCount,
    createTeam,
    setActiveTeam,
  } = useTeamBuilder();

  const [teamPokemon, setTeamPokemon] = useState(Array(6).fill(null));
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [allNames, setAllNames] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchAllPokemonEntries().then(setAllNames).catch(() => {});
  }, []);

  useEffect(() => {
    const loadTeam = async () => {
      const loaded = await Promise.all(
        team.map(async (slot) => {
          if (!slot) return null;
          try {
            return await fetchPokemon(slot.name);
          } catch {
            return null;
          }
        })
      );
      setTeamPokemon(loaded);
    };
    loadTeam();
  }, [team]);

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    const filtered = allNames.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 10);
    const results = await Promise.allSettled(filtered.map((p) => fetchPokemon(p.name)));
    setSearchResults(results.filter((r) => r.status === 'fulfilled').map((r) => r.value));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = parseInt(String(active.id).replace('slot-', ''), 10);
    const newIndex = parseInt(String(over.id).replace('slot-', ''), 10);
    reorderTeam(oldIndex, newIndex);
  };

  const teamTypesList = teamPokemon.filter(Boolean).map((p) => p.types.map((t) => t.type.name));
  const teamWeaknesses = getTeamWeaknesses(teamTypesList);
  const coverage = getOffensiveCoverage([...new Set(teamTypesList.flat())]);
  const slotIds = teamPokemon.map((_, i) => `slot-${i}`);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Seo title="Team Builder" description="Build and save Pokémon teams with drag-and-drop, weakness and coverage analysis." path="/team-builder" />
      <ParticleBackground count={30} color="rgba(34, 197, 94, 0.4)" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white mb-2">
            Team <span className="text-gradient">Builder</span>
          </h1>
          <p className="text-gray-400 mb-6">Drag to reorder · Save multiple teams · Analyze coverage ({teamCount}/6)</p>
        </FadeIn>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {teams.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTeam(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 ${
                activeTeamId === t.id ? 'bg-poke-yellow/20 text-poke-yellow' : 'glass text-gray-400'
              }`}
            >
              {t.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => createTeam(`Team ${teams.length + 1}`)}
            className="px-3 py-2 rounded-xl glass text-poke-yellow hover:bg-white/5"
          >
            <IoAdd className="text-xl" />
          </button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={slotIds} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
              {teamPokemon.map((pokemon, index) => (
                <SortableSlot
                  key={slotIds[index]}
                  id={slotIds[index]}
                  pokemon={pokemon}
                  index={index}
                  onRemove={(i) => (pokemon ? removeFromTeam(i) : setShowSearch(true))}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {teamCount > 0 && (
          <FadeIn>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display font-bold text-white mb-4">Team Weaknesses</h3>
                <div className="flex flex-wrap gap-1">
                  {teamWeaknesses.length ? teamWeaknesses.map((t) => <TypeBadge key={t} type={t} size="sm" />) : <span className="text-gray-500 text-sm">Add Pokémon to analyze</span>}
                </div>
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display font-bold text-white mb-4">Offensive Coverage</h3>
                <div className="flex flex-wrap gap-1">
                  {coverage.slice(0, 12).map((t) => <TypeBadge key={t} type={t} size="sm" />)}
                  {coverage.length > 12 && <span className="text-xs text-gray-400">+{coverage.length - 12} more</span>}
                </div>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 mb-8">
              <p className="text-xs text-gray-400 mb-2">Average BST</p>
              <p className="text-3xl font-black text-poke-yellow">
                {Math.round(teamPokemon.filter(Boolean).reduce((s, p) => s + getTotalStats(p.stats), 0) / teamCount)}
              </p>
            </div>
          </FadeIn>
        )}

        <div className="flex gap-4 flex-wrap">
          <RippleButton onClick={() => setShowSearch(true)}><IoSearch /> Add Pokémon</RippleButton>
          {teamCount > 0 && <RippleButton onClick={clearTeam} variant="danger"><IoTrash /> Clear Team</RippleButton>}
        </div>

        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowSearch(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-strong rounded-2xl p-6 w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-white">Search Pokémon</h3>
                  <button type="button" onClick={() => setShowSearch(false)} className="text-gray-400 hover:text-white"><IoClose className="text-xl" /></button>
                </div>
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Search any form or mega..."
                  suggestions={allNames}
                  suggestionLinkBase=""
                />
                <div className="mt-4 max-h-64 overflow-y-auto space-y-2">
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { addToTeam(p); setShowSearch(false); }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                    >
                      <img src={getPokemonImage(p)} alt={p.name} loading="lazy" className="w-10 h-10 object-contain" />
                      <span className="text-white capitalize font-semibold">{formatPokemonName(p.name)}</span>
                      <div className="flex gap-1 ml-auto">{p.types.map(({ type }) => <TypeBadge key={type.name} type={type.name} size="sm" />)}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
