import { classifyPokemonForm, getFormBadgeColor } from '../../utils/pokemonForms';
import { formatPokemonName } from '../../utils/helpers';

export default function FormBadge({ name, size = 'sm' }) {
  const form = classifyPokemonForm(name);
  if (form.variant === 'default') return null;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex rounded-full font-semibold ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${getFormBadgeColor(form.variant)}25`,
        color: getFormBadgeColor(form.variant),
        border: `1px solid ${getFormBadgeColor(form.variant)}50`,
      }}
    >
      {form.label}
    </span>
  );
}

export function FormLabel({ name }) {
  const form = classifyPokemonForm(name);
  if (form.variant === 'default') return formatPokemonName(name);
  return formatPokemonName(name);
}
