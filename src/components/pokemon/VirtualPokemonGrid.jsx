import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import PokemonCard from '../pokemon/PokemonCard';

export default function VirtualPokemonGrid({ pokemon, columns = 4 }) {
  const parentRef = useRef(null);
  const rowCount = Math.ceil(pokemon.length / columns);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 220,
    overscan: 3,
  });

  const colClass =
    columns === 2
      ? 'grid-cols-2'
      : columns === 3
        ? 'grid-cols-3'
        : columns === 6
          ? 'grid-cols-6'
          : 'grid-cols-4';

  return (
    <div ref={parentRef} className="h-[70vh] overflow-y-auto pr-2">
      <div
        style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const startIdx = virtualRow.index * columns;
          const rowItems = pokemon.slice(startIdx, startIdx + columns);
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className={`grid ${colClass} gap-4 pb-4`}
            >
              {rowItems.map((p, i) => (
                <PokemonCard key={p.id} pokemon={p} index={startIdx + i} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
