import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import TypeBadge from '../ui/TypeBadge';
import FormBadge from '../ui/FormBadge';
import { getPokemonImage } from '../../api/pokeapi';
import { formatPokemonName } from '../../utils/helpers';
import { useFavorites } from '../../hooks/useFavorites';

export default function PokemonCard({ pokemon, index = 0 }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const image = getPokemonImage(pokemon);
  const favorite = isFavorite(pokemon.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.03 }}
      className="group relative"
    >
      <div className="glass rounded-2xl p-4 card-hover relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-poke-yellow/5 via-transparent to-poke-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <button
          type="button"
          onClick={() => toggleFavorite(pokemon)}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full glass hover:bg-white/10 transition-colors"
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {favorite ? (
            <IoHeart className="text-poke-red text-lg" />
          ) : (
            <IoHeartOutline className="text-gray-400 text-lg group-hover:text-poke-red transition-colors" />
          )}
        </button>

        <Link to={`/pokemon/${pokemon.id}`} className="block relative z-[1]">
          <p className="text-xs text-gray-400 font-mono mb-1">
            #{String(pokemon.id).padStart(3, '0')}
          </p>

          <div className="relative w-28 h-28 mx-auto mb-3">
            <div className="absolute inset-0 bg-poke-yellow/10 rounded-full blur-xl group-hover:bg-poke-yellow/20 transition-colors" />
            <img
              src={image}
              alt={pokemon.name}
              loading="lazy"
              className="relative w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
            />
          </div>

            <h3 className="text-center font-display font-bold text-white capitalize text-lg mb-1 group-hover:text-poke-yellow transition-colors">
              {formatPokemonName(pokemon.name)}
            </h3>
            <div className="flex justify-center mb-2">
              <FormBadge name={pokemon.name} />
            </div>

          <div className="flex gap-1.5 justify-center flex-wrap">
            {pokemon.types?.map(({ type }) => (
              <TypeBadge key={type.name} type={type.name} size="sm" />
            ))}
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
