import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'pokeverse-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback(
    (id) => favorites.some((f) => f.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback((pokemon) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === pokemon.id);
      if (exists) return prev.filter((f) => f.id !== pokemon.id);
      return [...prev, { id: pokemon.id, name: pokemon.name }];
    });
  }, []);

  const removeFavorite = useCallback((id) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return { favorites, isFavorite, toggleFavorite, removeFavorite };
}
