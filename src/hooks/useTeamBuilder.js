import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'pokeverse-team';

const EMPTY_SLOT = null;

export function useTeamBuilder() {
  const [team, setTeam] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : Array(6).fill(EMPTY_SLOT);
    } catch {
      return Array(6).fill(EMPTY_SLOT);
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
  }, [team]);

  const addToTeam = useCallback((pokemon) => {
    setTeam((prev) => {
      if (prev.some((slot) => slot?.id === pokemon.id)) return prev;
      const emptyIndex = prev.findIndex((slot) => slot === null);
      if (emptyIndex === -1) return prev;
      const updated = [...prev];
      updated[emptyIndex] = { id: pokemon.id, name: pokemon.name };
      return updated;
    });
  }, []);

  const removeFromTeam = useCallback((index) => {
    setTeam((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
  }, []);

  const clearTeam = useCallback(() => {
    setTeam(Array(6).fill(EMPTY_SLOT));
  }, []);

  const isInTeam = useCallback(
    (id) => team.some((slot) => slot?.id === id),
    [team]
  );

  const teamCount = team.filter(Boolean).length;

  return { team, addToTeam, removeFromTeam, clearTeam, isInTeam, teamCount };
}
