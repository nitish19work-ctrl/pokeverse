export const FORM_CATEGORIES = {
  NATIONAL: 'national',
  MEGA: 'mega',
  REGIONAL: 'regional',
  ALTERNATE: 'alternate',
  ALL: 'all',
};

const REGIONAL_PATTERNS = [
  { pattern: '-alola', label: 'Alolan', region: 'Alola' },
  { pattern: '-galar', label: 'Galarian', region: 'Galar' },
  { pattern: '-hisui', label: 'Hisuian', region: 'Hisui' },
  { pattern: '-paldea', label: 'Paldean', region: 'Paldea' },
];

const MEGA_PATTERNS = ['-mega-x', '-mega-y', '-mega'];

const ALTERNATE_PATTERNS = [
  '-gmax',
  '-primal',
  '-origin',
  '-attack',
  '-defense',
  '-speed',
  '-sunny',
  '-rainy',
  '-snowy',
  '-plant',
  '-sandy',
  '-trash',
  '-wash',
  '-heat',
  '-fan',
  '-frost',
  '-mow',
  '-sky',
  '-battle-bond',
  '-crowned',
  '-dusk',
  '-midnight',
  '-noice',
  '-dawn',
  '-ultra',
  '-complete',
  '-10-complete',
  '-totem',
  '-busted',
  '-school',
  '-hangry',
  '-crowned',
  '-rapid-strike',
  '-single-strike',
  '-ice',
  '-shadow',
  '-unbound',
  '-therian',
  '-incarnate',
  '-aria',
  '-pirouette',
  '-red-striped',
  '-blue-striped',
  '-white-striped',
  '-standard',
  '-zen',
  '-roaming',
  '-east',
  '-west',
  '-ba',
  '-pa',
  '-libre',
  '-belle',
  '-phd',
  '-pop-star',
  '-rock-star',
  '-cosplay',
  '-starter',
  '-world-cap',
  '-original-cap',
];

export function classifyPokemonForm(name) {
  const n = name.toLowerCase();

  if (MEGA_PATTERNS.some((p) => n.includes(p))) {
    return { category: FORM_CATEGORIES.MEGA, label: 'Mega Evolution', variant: 'mega' };
  }

  for (const { pattern, label, region } of REGIONAL_PATTERNS) {
    if (n.includes(pattern)) {
      return { category: FORM_CATEGORIES.REGIONAL, label, variant: region.toLowerCase(), region };
    }
  }

  if (n.includes('-gmax')) {
    return { category: FORM_CATEGORIES.ALTERNATE, label: 'Gigantamax', variant: 'gigantamax' };
  }
  if (n.includes('-primal')) {
    return { category: FORM_CATEGORIES.ALTERNATE, label: 'Primal', variant: 'primal' };
  }
  if (n.includes('-origin')) {
    return { category: FORM_CATEGORIES.ALTERNATE, label: 'Origin Form', variant: 'origin' };
  }
  if (n.includes('greninja-ash') || n.includes('battle-bond')) {
    return { category: FORM_CATEGORIES.ALTERNATE, label: 'Ash Greninja', variant: 'ash' };
  }
  if (n.startsWith('rotom-')) {
    return { category: FORM_CATEGORIES.ALTERNATE, label: 'Rotom Form', variant: 'rotom' };
  }
  if (n.startsWith('deoxys-')) {
    return { category: FORM_CATEGORIES.ALTERNATE, label: 'Deoxys Form', variant: 'deoxys' };
  }
  if (n.startsWith('castform-')) {
    return { category: FORM_CATEGORIES.ALTERNATE, label: 'Castform Form', variant: 'castform' };
  }
  if (n.startsWith('shaymin-')) {
    return { category: FORM_CATEGORIES.ALTERNATE, label: 'Shaymin Form', variant: 'shaymin' };
  }
  if (n.startsWith('wormadam-')) {
    return { category: FORM_CATEGORIES.ALTERNATE, label: 'Wormadam Form', variant: 'wormadam' };
  }
  if (n.startsWith('burmy-')) {
    return { category: FORM_CATEGORIES.ALTERNATE, label: 'Burmy Form', variant: 'burmy' };
  }
  if (n.includes('-ultra')) {
    return { category: FORM_CATEGORIES.ALTERNATE, label: 'Ultra Form', variant: 'ultra' };
  }

  if (ALTERNATE_PATTERNS.some((p) => n.includes(p))) {
    return { category: FORM_CATEGORIES.ALTERNATE, label: 'Alternate Form', variant: 'alternate' };
  }

  return { category: FORM_CATEGORIES.NATIONAL, label: 'Standard', variant: 'default' };
}

export function isNationalDexEntry(name, id) {
  const form = classifyPokemonForm(name);
  return form.category === FORM_CATEGORIES.NATIONAL && id <= 1025;
}

export function filterByFormCategory(entries, category) {
  if (!category || category === FORM_CATEGORIES.ALL) return entries;
  if (category === FORM_CATEGORIES.NATIONAL) {
    return entries.filter((e) => isNationalDexEntry(e.name, getEntryId(e)));
  }
  return entries.filter((e) => {
    const form = classifyPokemonForm(e.name);
    if (category === FORM_CATEGORIES.MEGA) return form.category === FORM_CATEGORIES.MEGA;
    if (category === FORM_CATEGORIES.REGIONAL) return form.category === FORM_CATEGORIES.REGIONAL;
    if (category === FORM_CATEGORIES.ALTERNATE) return form.category === FORM_CATEGORIES.ALTERNATE;
    return true;
  });
}

function getEntryId(entry) {
  if (entry.id) return entry.id;
  const parts = entry.url?.split('/') || [];
  return parseInt(parts[parts.length - 2], 10) || 0;
}

export function getFormBadgeColor(variant) {
  const colors = {
    mega: '#ec4899',
    alola: '#f97316',
    galar: '#6366f1',
    hisui: '#a855f7',
    paldea: '#14b8a6',
    gigantamax: '#ef4444',
    primal: '#dc2626',
    origin: '#8b5cf6',
    default: '#ffd700',
  };
  return colors[variant] || '#3b82f6';
}
