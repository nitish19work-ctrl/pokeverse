import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchEvolutionChain, getPokemonImage, fetchPokemon } from '../../api/pokeapi';
import { formatPokemonName } from '../../utils/helpers';

function EvolutionNode({ chain, level = 0 }) {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    fetchPokemon(chain.species.name).then(setPokemon).catch(() => {});
  }, [chain.species.name]);

  if (!pokemon) {
    return (
      <div className="skeleton w-24 h-24 rounded-full" />
    );
  }

  return (
    <div className="flex flex-col items-center">
      <Link to={`/pokemon/${pokemon.id}`} className="group">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-poke-yellow/20 rounded-full blur-xl group-hover:bg-poke-yellow/30 transition-colors" />
          <img
            src={getPokemonImage(pokemon)}
            alt={pokemon.name}
            className="relative w-24 h-24 object-contain drop-shadow-lg"
            loading="lazy"
          />
        </motion.div>
        <p className="text-center text-sm font-semibold text-white capitalize mt-2 group-hover:text-poke-yellow transition-colors">
          {formatPokemonName(pokemon.name)}
        </p>
      </Link>

      {chain.evolves_to?.length > 0 && (
        <div className="flex flex-col items-center mt-4">
          {chain.evolution_details?.[0] && (
            <span className="text-xs text-gray-400 mb-2">
              {chain.evolution_details[0].min_level
                ? `Lv. ${chain.evolution_details[0].min_level}`
                : chain.evolution_details[0].trigger?.name === 'use-item'
                  ? 'Use Item'
                  : chain.evolution_details[0].trigger?.name === 'trade'
                    ? 'Trade'
                    : 'Evolve'}
            </span>
          )}
          <div className="text-poke-yellow text-2xl mb-2">↓</div>
          <div className="flex gap-8 flex-wrap justify-center">
            {chain.evolves_to.map((evo, i) => (
              <EvolutionNode key={i} chain={evo} level={level + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EvolutionChain({ evolutionChainUrl }) {
  const [chain, setChain] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!evolutionChainUrl) return;
    fetchEvolutionChain(evolutionChainUrl)
      .then((data) => setChain(data.chain))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [evolutionChainUrl]);

  if (loading) {
    return (
      <div className="flex justify-center gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton w-24 h-24 rounded-full" />
        ))}
      </div>
    );
  }

  if (!chain) return null;

  return (
    <div className="flex justify-center overflow-x-auto py-4">
      <EvolutionNode chain={chain} />
    </div>
  );
}
