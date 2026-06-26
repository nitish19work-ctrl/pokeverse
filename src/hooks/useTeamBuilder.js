import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'pokeverse-teams-v2';
const EMPTY_SLOT = null;

function migrateLegacy(data) {
  if (Array.isArray(data)) {
    return {
      teams: [{ id: 'default', name: 'Team 1', slots: data }],
      activeTeamId: 'default',
    };
  }
  return data;
}

function createDefaultState() {
  return {
    teams: [{ id: 'default', name: 'Team 1', slots: Array(6).fill(EMPTY_SLOT) }],
    activeTeamId: 'default',
  };
}

export function useTeamBuilder() {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const legacy = localStorage.getItem('pokeverse-team');
        if (legacy) return migrateLegacy(JSON.parse(legacy));
        return createDefaultState();
      }
      return migrateLegacy(JSON.parse(stored));
    } catch {
      return createDefaultState();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const activeTeam = state.teams.find((t) => t.id === state.activeTeamId) || state.teams[0];
  const team = activeTeam?.slots || Array(6).fill(EMPTY_SLOT);

  const updateActiveTeam = useCallback((updater) => {
    setState((prev) => ({
      ...prev,
      teams: prev.teams.map((t) =>
        t.id === prev.activeTeamId ? { ...t, slots: updater(t.slots) } : t
      ),
    }));
  }, []);

  const addToTeam = useCallback((pokemon) => {
    updateActiveTeam((slots) => {
      if (slots.some((s) => s?.id === pokemon.id)) return slots;
      const idx = slots.findIndex((s) => s === null);
      if (idx === -1) return slots;
      const updated = [...slots];
      updated[idx] = { id: pokemon.id, name: pokemon.name };
      return updated;
    });
  }, [updateActiveTeam]);

  const removeFromTeam = useCallback((index) => {
    updateActiveTeam((slots) => {
      const updated = [...slots];
      updated[index] = null;
      return updated;
    });
  }, [updateActiveTeam]);

  const reorderTeam = useCallback((fromIndex, toIndex) => {
    updateActiveTeam((slots) => {
      const updated = [...slots];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }, [updateActiveTeam]);

  const clearTeam = useCallback(() => {
    updateActiveTeam(() => Array(6).fill(EMPTY_SLOT));
  }, [updateActiveTeam]);

  const isInTeam = useCallback(
    (id) => team.some((s) => s?.id === id),
    [team]
  );

  const createTeam = useCallback((name) => {
    const id = `team-${Date.now()}`;
    setState((prev) => ({
      teams: [...prev.teams, { id, name, slots: Array(6).fill(EMPTY_SLOT) }],
      activeTeamId: id,
    }));
    return id;
  }, []);

  const deleteTeam = useCallback((teamId) => {
    if (teamId === 'default') return;
    setState((prev) => ({
      teams: prev.teams.filter((t) => t.id !== teamId),
      activeTeamId: prev.activeTeamId === teamId ? 'default' : prev.activeTeamId,
    }));
  }, []);

  const setActiveTeam = useCallback((teamId) => {
    setState((prev) => ({ ...prev, activeTeamId: teamId }));
  }, []);

  const renameTeam = useCallback((teamId, name) => {
    setState((prev) => ({
      ...prev,
      teams: prev.teams.map((t) => (t.id === teamId ? { ...t, name } : t)),
    }));
  }, []);

  const teamCount = team.filter(Boolean).length;

  return {
    teams: state.teams,
    activeTeamId: state.activeTeamId,
    activeTeam,
    team,
    addToTeam,
    removeFromTeam,
    reorderTeam,
    clearTeam,
    isInTeam,
    teamCount,
    createTeam,
    deleteTeam,
    setActiveTeam,
    renameTeam,
  };
}
