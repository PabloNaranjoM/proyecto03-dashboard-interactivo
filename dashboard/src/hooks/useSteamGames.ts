import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_GAMES_LIMIT, obtenerJuegos } from '../services/gamesService';
import type { SteamGame } from '../types/dashboard';

export interface UseSteamGamesResult {
  games: SteamGame[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useSteamGames(
  limit: number | null = DEFAULT_GAMES_LIMIT,
): UseSteamGamesResult {
  const [games, setGames] = useState<SteamGame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState<number>(0);

  const reload = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    let active = true;

    async function cargarDatos() {
      setLoading(true);
      setError(null);

      try {
        const registros = await obtenerJuegos(limit);
        if (active) {
          setGames(registros);
        }
      } catch (err) {
        if (active) {
          const message =
            err instanceof Error
              ? err.message
              : 'No se pudieron recuperar los datos desde Firebase Realtime Database.';
          setError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    cargarDatos();

    return () => {
      active = false;
    };
  }, [limit, reloadToken]);

  return { games, loading, error, reload };
}
