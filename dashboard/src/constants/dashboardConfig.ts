import type { GenreOption, PrimaryGenre } from '../types/dashboard';

export const DEFAULT_MIN_YEAR = 1997;
export const DEFAULT_MAX_YEAR = 2026;
export const DEFAULT_PAGE_SIZE = 5;

export const PRIMARY_GENRES: readonly PrimaryGenre[] = [
  'Action',
  'Indie',
  'Adventure',
  'RPG',
  'Strategy',
] as const;

export const GENRE_OPTIONS: GenreOption[] = [
  { value: 'Todos', label: 'Todos los géneros' },
  { value: 'Action', label: 'Acción' },
  { value: 'Adventure', label: 'Aventura' },
  { value: 'Indie', label: 'Indie' },
  { value: 'RPG', label: 'RPG' },
  { value: 'Strategy', label: 'Estrategia' },
];

export const GENRE_LABELS: Record<string, string> = {
  Action: 'Acción',
  Adventure: 'Aventura',
  Indie: 'Indie',
  RPG: 'RPG',
  Strategy: 'Estrategia',
  Simulation: 'Simulación',
  Casual: 'Casual',
  'Free To Play': 'Gratis',
  'Free to Play': 'Gratis',
  Sports: 'Deportes',
  Racing: 'Carreras',
  'Massively Multiplayer': 'MMO',
  'Early Access': 'Acceso anticipado',
};
