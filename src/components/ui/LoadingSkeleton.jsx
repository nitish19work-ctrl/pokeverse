export function PokemonCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-4 animate-pulse">
      <div className="skeleton h-32 w-32 mx-auto rounded-full mb-4" />
      <div className="skeleton h-4 w-16 mx-auto rounded mb-2" />
      <div className="skeleton h-5 w-28 mx-auto rounded mb-3" />
      <div className="flex gap-2 justify-center">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function PokemonGridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PokemonCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="skeleton h-80 rounded-3xl" />
        <div className="space-y-4">
          <div className="skeleton h-8 w-48 rounded" />
          <div className="skeleton h-6 w-32 rounded" />
          <div className="flex gap-2">
            <div className="skeleton h-8 w-20 rounded-full" />
            <div className="skeleton h-8 w-20 rounded-full" />
          </div>
          <div className="space-y-3 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-4 rounded" style={{ width: `${100 - i * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatBarSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="skeleton h-4 w-16 rounded" />
          <div className="skeleton h-3 flex-1 rounded-full" />
          <div className="skeleton h-4 w-8 rounded" />
        </div>
      ))}
    </div>
  );
}
