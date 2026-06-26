import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { IoArrowForward, IoFlash, IoShield, IoGlobe } from 'react-icons/io5';
import ParticleBackground from '../components/ui/ParticleBackground';
import SearchBar from '../components/ui/SearchBar';
import RippleButton from '../components/ui/RippleButton';
import PokemonCard from '../components/pokemon/PokemonCard';
import { FadeIn, SlideIn, ScaleIn } from '../components/ui/PageTransition';
import { fetchPokemon, fetchPokemonBatch, getPokemonImage, fetchAllPokemonEntries } from '../api/pokeapi';
import {
  TRENDING_POKEMON,
  FEATURED_POKEMON,
  GENERATIONS,
  REGIONS,
  LEGENDARY_POKEMON,
  HERO_POKEMON,
} from '../data/constants';
import { formatPokemonName } from '../utils/helpers';

export default function Home() {
  const heroRef = useRef(null);
  const pokemonRef = useRef(null);
  const navigate = useNavigate();
  const [heroPokemon, setHeroPokemon] = useState(null);
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [legendary, setLegendary] = useState([]);
  const [allNames, setAllNames] = useState([]);

  useEffect(() => {
    fetchAllPokemonEntries().then(setAllNames).catch(() => {});

    fetchPokemon(HERO_POKEMON.name).then(setHeroPokemon).catch(() => {});

    Promise.all([
      fetchPokemonBatch(TRENDING_POKEMON.map((p) => p.name)),
      fetchPokemonBatch(FEATURED_POKEMON.map((p) => p.name)),
      fetchPokemonBatch(LEGENDARY_POKEMON.slice(0, 6).map((p) => p.name)),
    ]).then(([t, f, l]) => {
      setTrending(t);
      setFeatured(f);
      setLegendary(l);
    });
  }, []);

  useEffect(() => {
    if (!heroPokemon) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-title', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.2,
        clearProps: 'transform,opacity',
      });

      gsap.from('.hero-subtitle', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.5,
        clearProps: 'transform,opacity',
      });

      gsap.from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.8,
        clearProps: 'transform,opacity',
      });

      gsap.from('.hero-search', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1,
        clearProps: 'transform,opacity',
      });

      if (pokemonRef.current) {
        gsap.from(pokemonRef.current, {
          x: 100,
          opacity: 0,
          scale: 0.8,
          duration: 1.5,
          ease: 'power3.out',
          delay: 0.3,
        });

        gsap.to(pokemonRef.current, {
          y: -20,
          duration: 3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }

      gsap.from('.hero-glow', {
        scale: 0,
        opacity: 0,
        duration: 2,
        ease: 'power2.out',
        delay: 0.5,
      });
    }, heroRef);

    return () => ctx.revert();
  }, [heroPokemon]);

  const handleSearch = (query) => {
    if (query) navigate(`/pokedex?search=${encodeURIComponent(query)}`);
  };

  const stats = [
    { icon: IoFlash, label: 'Pokémon', value: '1,025+', color: 'text-poke-yellow' },
    { icon: IoShield, label: 'Types', value: '18', color: 'text-poke-red' },
    { icon: IoGlobe, label: 'Regions', value: '9', color: 'text-poke-blue' },
  ];

  return (
    <div ref={heroRef} className="overflow-x-hidden">
      <ParticleBackground count={50} />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-x-hidden">
        <div className="hero-glow absolute top-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-poke-yellow/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="hero-glow absolute bottom-1/4 left-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-poke-blue/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="min-w-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
              >
                <span className="w-2 h-2 bg-poke-yellow rounded-full animate-pulse" />
                <span className="text-sm text-gray-300">Premium Pokémon Experience</span>
              </motion.div>

              <h1 className="hero-title font-display text-4xl sm:text-5xl lg:text-7xl font-black leading-tight mb-6">
                <span className="text-white">Catch 'Em</span>
                <br />
                <span className="text-gradient">All & Beyond</span>
              </h1>

              <p className="hero-subtitle text-lg text-gray-400 max-w-lg mb-8 leading-relaxed">
                Explore the ultimate Pokédex, build legendary teams, and discover
                every Pokémon across all nine generations. Your adventure starts here.
              </p>

              <div className="hero-cta flex flex-wrap gap-4 mb-8">
                <RippleButton to="/pokedex">
                  Explore Pokédex <IoArrowForward />
                </RippleButton>
                <RippleButton to="/legendary" variant="secondary">
                  Legendary Pokémon
                </RippleButton>
              </div>

              <div className="hero-search w-full max-w-md min-w-0">
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Search any Pokémon..."
                  suggestions={allNames}
                  suggestionLinkBase="/pokemon"
                />
              </div>
            </div>

            <div className="relative flex justify-center min-w-0 overflow-visible">
              {heroPokemon && (
                <div ref={pokemonRef} className="relative max-w-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-poke-yellow/30 via-poke-red/20 to-poke-blue/30 rounded-full blur-3xl scale-110" />
                  <img
                    src={getPokemonImage(heroPokemon)}
                    alt={heroPokemon.name}
                    className="relative w-56 sm:w-72 lg:w-96 h-auto max-w-full drop-shadow-2xl"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-4 sm:-inset-8 border border-poke-yellow/10 rounded-full pointer-events-none"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-8 sm:-inset-16 border border-poke-blue/10 rounded-full pointer-events-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map(({ icon: Icon, label, value, color }, i) => (
              <FadeIn key={label} delay={i * 0.1}>
                <div className="glass rounded-2xl p-6 text-center card-hover">
                  <Icon className={`${color} text-3xl mx-auto mb-3`} />
                  <p className="font-display text-3xl font-black text-white mb-1">{value}</p>
                  <p className="text-gray-400 text-sm">{label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl font-black text-white mb-2">
                  Trending <span className="text-gradient-yellow">Pokémon</span>
                </h2>
                <p className="text-gray-400">Most popular Pokémon right now</p>
              </div>
              <Link to="/pokedex" className="text-poke-yellow hover:text-poke-yellow-light text-sm font-semibold hidden sm:flex items-center gap-1">
                View All <IoArrowForward />
              </Link>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {trending.map((p, i) => (
              <PokemonCard key={p.id} pokemon={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Legendary Showcase */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-poke-red/5 via-transparent to-poke-yellow/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SlideIn direction="left">
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white mb-2">
              Legendary <span className="text-gradient">Showcase</span>
            </h2>
            <p className="text-gray-400 mb-10">The most powerful Pokémon in existence</p>
          </SlideIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {legendary.map((p, i) => (
              <ScaleIn key={p.id} delay={i * 0.1}>
                <Link to={`/pokemon/${p.id}`} className="block group">
                  <div className="glass rounded-2xl p-4 text-center card-hover glow-yellow relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-poke-yellow/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img
                      src={getPokemonImage(p)}
                      alt={p.name}
                      loading="lazy"
                      className="w-20 h-20 mx-auto object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                    <p className="text-sm font-bold text-white capitalize mt-2 group-hover:text-poke-yellow transition-colors">
                      {formatPokemonName(p.name)}
                    </p>
                  </div>
                </Link>
              </ScaleIn>
            ))}
          </div>
          <div className="text-center mt-8">
            <RippleButton to="/legendary" variant="secondary">
              View All Legendaries
            </RippleButton>
          </div>
        </div>
      </section>

      {/* Featured Cards */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white mb-2">
              Featured <span className="text-gradient-yellow">Pokémon</span>
            </h2>
            <p className="text-gray-400 mb-10">Hand-picked favorites from every trainer</p>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {featured.map((p, i) => (
              <PokemonCard key={p.id} pokemon={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Generation Cards */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white mb-2">
              Explore by <span className="text-gradient">Generation</span>
            </h2>
            <p className="text-gray-400 mb-10">Journey through Pokémon history</p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GENERATIONS.map((gen, i) => (
              <SlideIn key={gen.id} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.05}>
                <Link
                  to={`/pokedex?generation=${gen.id}`}
                  className="block group"
                >
                  <div className="glass rounded-2xl p-6 card-hover relative overflow-hidden">
                    <div
                      className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
                      style={{ backgroundColor: gen.color }}
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400 font-mono mb-1">Gen {gen.id}</p>
                        <h3 className="font-display font-bold text-xl text-white group-hover:text-poke-yellow transition-colors">
                          {gen.name}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1 capitalize">{gen.region} Region</p>
                      </div>
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-black text-2xl"
                        style={{ backgroundColor: `${gen.color}20`, color: gen.color }}
                      >
                        {gen.id}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      #{gen.range[0]} — #{gen.range[1]}
                    </p>
                  </div>
                </Link>
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Regions */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-poke-blue/5 to-poke-red/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white mb-2">
              Featured <span className="text-gradient">Regions</span>
            </h2>
            <p className="text-gray-400 mb-10">Discover the world of Pokémon</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REGIONS.slice(0, 6).map((region, i) => (
              <ScaleIn key={region.id} delay={i * 0.1}>
                <Link to={`/regions`} className="block group">
                  <div className={`glass rounded-2xl p-6 card-hover bg-gradient-to-br ${region.gradient} relative overflow-hidden`}>
                    <div
                      className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30"
                      style={{ backgroundColor: region.color }}
                    />
                    <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-poke-yellow transition-colors">
                      {region.name}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{region.description}</p>
                    <p className="text-xs text-gray-500 mt-3">{region.pokemonCount} Pokémon</p>
                  </div>
                </Link>
              </ScaleIn>
            ))}
          </div>
          <div className="text-center mt-8">
            <RippleButton to="/regions" variant="secondary">
              Explore All Regions
            </RippleButton>
          </div>
        </div>
      </section>
    </div>
  );
}
