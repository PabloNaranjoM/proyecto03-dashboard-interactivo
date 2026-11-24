import { get, limitToFirst, query, ref } from 'firebase/database';
import { database } from '../firebase/firebase';
import type { SteamGame } from '../types/dashboard';

/**
 * Límite máximo de videojuegos a recuperar desde Firebase Realtime Database.
 * Cambiar a `null` para consultar el nodo `/games` completo (125.855 registros).
 */
export const DEFAULT_GAMES_LIMIT: number | null = 5000;

function toNullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function toNullableNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function toNullableBoolean(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string');
}

function normalizeSteamGame(raw: Record<string, unknown>, fallbackId: number): SteamGame {
  return {
    appId: toNullableNumber(raw.appId) ?? fallbackId,
    name: toNullableString(raw.name),
    owners: toNullableString(raw.owners),
    releaseDate: toNullableString(raw.releaseDate),
    price: toNullableNumber(raw.price),
    ccu: toNullableNumber(raw.ccu),
    positive: toNullableNumber(raw.positive),
    negative: toNullableNumber(raw.negative),
    metacriticScore: toNullableNumber(raw.metacriticScore),
    averagePlaytime: toNullableNumber(raw.averagePlaytime),
    medianPlaytime: toNullableNumber(raw.medianPlaytime),
    achievements: toNullableNumber(raw.achievements),
    recommendations: toNullableNumber(raw.recommendations),
    windows: toNullableBoolean(raw.windows),
    mac: toNullableBoolean(raw.mac),
    linux: toNullableBoolean(raw.linux),
    genres: toStringArray(raw.genres),
    categories: toStringArray(raw.categories),
    developers: toStringArray(raw.developers),
    publishers: toStringArray(raw.publishers),
  };
}

export async function obtenerJuegos(
  limit: number | null = DEFAULT_GAMES_LIMIT,
): Promise<SteamGame[]> {
  const gamesRef = ref(database, 'games');
  const gamesQuery =
    limit !== null ? query(gamesRef, limitToFirst(limit)) : gamesRef;

  const snapshot = await get(gamesQuery);

  if (!snapshot.exists()) {
    return [];
  }

  const rawValue: unknown = snapshot.val();
  const rawList = Array.isArray(rawValue)
    ? rawValue
    : Object.values(rawValue as Record<string, unknown>);

  const games: SteamGame[] = [];

  for (let index = 0; index < rawList.length; index += 1) {
    const item = rawList[index];
    if (item !== null && typeof item === 'object') {
      games.push(normalizeSteamGame(item as Record<string, unknown>, index));
    }
  }

  return games;
}
