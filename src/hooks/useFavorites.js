import { useState, useEffect, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'pokeverse-favorites-v2';

function migrateLegacy(data) {
  if (Array.isArray(data)) {
    return {
      folders: [{ id: 'default', name: 'Favorites', pokemon: data }],
      activeFolderId: 'default',
    };
  }
  return data;
}

function createDefaultState() {
  return {
    folders: [{ id: 'default', name: 'Favorites', pokemon: [] }],
    activeFolderId: 'default',
  };
}

export function useFavorites() {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const legacy = localStorage.getItem('pokeverse-favorites');
        if (legacy) return migrateLegacy(JSON.parse(legacy));
        return createDefaultState();
      }
      return migrateLegacy(JSON.parse(stored));
    } catch {
      return createDefaultState();
    }
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const activeFolder = useMemo(
    () => state.folders.find((f) => f.id === state.activeFolderId) || state.folders[0],
    [state]
  );

  const favorites = activeFolder?.pokemon || [];

  const allFavorites = useMemo(
    () => state.folders.flatMap((f) => f.pokemon.map((p) => ({ ...p, folderId: f.id, folderName: f.name }))),
    [state.folders]
  );

  const isFavorite = useCallback(
    (id) => allFavorites.some((f) => f.id === id),
    [allFavorites]
  );

  const toggleFavorite = useCallback((pokemon, folderId = state.activeFolderId) => {
    setState((prev) => {
      const exists = prev.folders.some((f) => f.pokemon.some((p) => p.id === pokemon.id));
      if (exists) {
        return {
          ...prev,
          folders: prev.folders.map((f) => ({
            ...f,
            pokemon: f.pokemon.filter((p) => p.id !== pokemon.id),
          })),
        };
      }
      return {
        ...prev,
        folders: prev.folders.map((f) =>
          f.id === folderId
            ? { ...f, pokemon: [...f.pokemon, { id: pokemon.id, name: pokemon.name }] }
            : f
        ),
      };
    });
  }, [state.activeFolderId]);

  const removeFavorite = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      folders: prev.folders.map((f) => ({
        ...f,
        pokemon: f.pokemon.filter((p) => p.id !== id),
      })),
    }));
  }, []);

  const createFolder = useCallback((name) => {
    const id = `folder-${Date.now()}`;
    setState((prev) => ({
      ...prev,
      folders: [...prev.folders, { id, name, pokemon: [] }],
      activeFolderId: id,
    }));
    return id;
  }, []);

  const deleteFolder = useCallback((folderId) => {
    if (folderId === 'default') return;
    setState((prev) => ({
      folders: prev.folders.filter((f) => f.id !== folderId),
      activeFolderId: prev.activeFolderId === folderId ? 'default' : prev.activeFolderId,
    }));
  }, []);

  const setActiveFolder = useCallback((folderId) => {
    setState((prev) => ({ ...prev, activeFolderId: folderId }));
  }, []);

  const exportFavorites = useCallback(() => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pokeverse-favorites.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const filteredFavorites = useMemo(() => {
    if (!searchQuery.trim()) return favorites;
    const q = searchQuery.toLowerCase();
    return favorites.filter((p) => p.name.toLowerCase().includes(q));
  }, [favorites, searchQuery]);

  return {
    folders: state.folders,
    activeFolderId: state.activeFolderId,
    activeFolder,
    favorites,
    filteredFavorites,
    allFavorites,
    searchQuery,
    setSearchQuery,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    createFolder,
    deleteFolder,
    setActiveFolder,
    exportFavorites,
  };
}
