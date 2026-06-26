import { TYPE_COLORS } from '../../data/constants';
import { formatPokemonName } from '../../utils/helpers';

export default function TypeBadge({ type, size = 'md' }) {
  const colors = TYPE_COLORS[type] || { bg: '#A8A878', text: '#fff' };
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold capitalize tracking-wide ${sizeClasses[size]}`}
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {formatPokemonName(type)}
    </span>
  );
}
