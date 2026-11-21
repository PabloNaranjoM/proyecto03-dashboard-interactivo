import type { ReactNode } from 'react';

/**
 * Esquema exacto de cada videojuego en datos/games.json (generado en Sprint 1).
 */
export interface SteamGame {
  appId: number;
  name: string | null;
  owners: string | null;
  releaseDate: string | null;
  price: number | null;
  ccu: number | null;
  positive: number | null;
  negative: number | null;
  metacriticScore: number | null;
  averagePlaytime: number | null;
  medianPlaytime: number | null;
  achievements: number | null;
  recommendations: number | null;
  windows: boolean | null;
  mac: boolean | null;
  linux: boolean | null;
  genres: string[];
  categories: string[];
  developers: string[];
  publishers: string[];
}

export type GenreFilter = 'Todos' | 'Action' | 'Adventure' | 'Indie' | 'RPG' | 'Strategy';
export type PrimaryGenre = Exclude<GenreFilter, 'Todos'>;

export interface YearRange {
  start: number;
  end: number;
}

export type NavSectionId = 'dashboard' | 'trends' | 'library';
export type SystemModalId = 'settings' | 'guide' | null;
export type KpiVariant = 'positive' | 'neutral' | 'live';

export interface GenreOption {
  value: GenreFilter;
  label: string;
}

export interface KpiItemData {
  id: string;
  label: string;
  value: string;
  badgeText: string;
  variant: KpiVariant;
  trendBars: number[];
  helperText?: string;
}

export interface YearlyReleasePoint {
  year: number;
  releases: number;
}

export interface PricePlaytimePoint {
  id: string;
  name: string;
  price: number;
  averagePlaytime: number;
  genre: PrimaryGenre;
  year: number;
}

export interface GenreOwnerItem {
  key: PrimaryGenre;
  label: string;
  ownersK: number;
}

/* ---------------- Contratos de Props (Fase 3) ---------------- */

export interface SidebarProps {
  activeSection: NavSectionId;
  indexedCount: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (section: NavSectionId) => void;
  onOpenModal: (modal: Exclude<SystemModalId, null>) => void;
}

export interface HeaderProps {
  subtitle: string;
  title: string;
  totalGames: number;
  onExport: () => void;
  onToggleMenu: () => void;
}

export interface FilterBarProps {
  genresList: GenreOption[];
  selectedGenre: GenreFilter;
  yearRange: YearRange;
  minYear: number;
  maxYear: number;
  onGenreChange: (genre: GenreFilter) => void;
  onYearChange: (range: YearRange) => void;
  onReset: () => void;
}

export interface KpiCardProps {
  label: string;
  value: string;
  badgeText: string;
  variant: KpiVariant;
  trendBars: number[];
  helperText?: string;
}

export interface KpiGridProps {
  items: KpiItemData[];
}

export interface ChartCardProps {
  category: string;
  title: string;
  unitBadge: string;
  footnote?: string;
  children: ReactNode;
}

export interface ReleasesLineChartProps {
  data: YearlyReleasePoint[];
}

export interface PricePlaytimeScatterChartProps {
  data: PricePlaytimePoint[];
}

export interface GenreOwnersBarChartProps {
  data: GenreOwnerItem[];
  selectedGenre: GenreFilter;
  onSelectGenre: (genre: GenreFilter) => void;
}

export interface ChartsSectionProps {
  kpiItems: KpiItemData[];
  lineData: YearlyReleasePoint[];
  scatterData: PricePlaytimePoint[];
  genreData: GenreOwnerItem[];
  yearRange: YearRange;
  selectedGenre: GenreFilter;
  onSelectGenre: (genre: GenreFilter) => void;
}

export interface GamesTableProps {
  games: SteamGame[];
  totalVisibleText: string;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
