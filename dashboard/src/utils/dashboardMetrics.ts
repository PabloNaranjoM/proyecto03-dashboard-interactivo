import {
  GENRE_LABELS,
  GENRE_SHARE_WEIGHT,
  MAX_YEAR,
  MIN_YEAR,
} from '../data/mockSteamData';
import type {
  GenreFilter,
  GenreOwnerItem,
  KpiItemData,
  PricePlaytimePoint,
  SteamGame,
  YearRange,
  YearlyReleasePoint,
} from '../types/dashboard';

const MONTHS_ES = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
] as const;

export function getReleaseYear(releaseDate: string | null): number | null {
  if (!releaseDate || releaseDate.length < 4) {
    return null;
  }
  const year = Number(releaseDate.slice(0, 4));
  return Number.isNaN(year) ? null : year;
}

export function formatReleaseDateEs(releaseDate: string | null): string {
  if (!releaseDate) {
    return 'Sin fecha';
  }
  const parts = releaseDate.split('-');
  if (parts.length !== 3) {
    return releaseDate;
  }
  const year = Number(parts[0]);
  const monthIndex = Number(parts[1]) - 1;
  const day = Number(parts[2]);
  const monthLabel = MONTHS_ES[monthIndex];

  if (Number.isNaN(year) || Number.isNaN(day) || !monthLabel) {
    return releaseDate;
  }
  return `${day} ${monthLabel} ${year}`;
}

export function formatOwnersRange(owners: string | null): string {
  if (!owners) {
    return 'Sin datos';
  }
  return owners
    .split('-')
    .map((part) => {
      const numeric = Number(part.trim().replaceAll(',', ''));
      return Number.isNaN(numeric) ? part.trim() : numeric.toLocaleString('es-ES');
    })
    .join(' - ');
}

export function formatPriceUsd(price: number | null): string {
  if (price === null) {
    return 'N/D';
  }
  return `$${price.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function getPrimaryGenreLabel(genres: string[]): string {
  if (genres.length === 0) {
    return 'Sin género';
  }
  const first = genres[0];
  return GENRE_LABELS[first] ?? first;
}

export function filterSteamGames(
  games: SteamGame[],
  selectedGenre: GenreFilter,
  yearRange: YearRange,
  searchTerm: string,
): SteamGame[] {
  const normalizedQuery = searchTerm.trim().toLowerCase();

  return games.filter((game) => {
    const matchesGenre =
      selectedGenre === 'Todos' || game.genres.includes(selectedGenre);

    const releaseYear = getReleaseYear(game.releaseDate);
    const matchesYear =
      releaseYear === null ||
      (releaseYear >= yearRange.start && releaseYear <= yearRange.end);

    const matchesSearch =
      normalizedQuery.length === 0 ||
      (game.name ?? '').toLowerCase().includes(normalizedQuery);

    return matchesGenre && matchesYear && matchesSearch;
  });
}

export function paginateGames(
  games: SteamGame[],
  currentPage: number,
  pageSize: number,
): { items: SteamGame[]; totalPages: number; safePage: number } {
  const totalPages = Math.max(1, Math.ceil(games.length / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * pageSize;

  return {
    items: games.slice(startIndex, startIndex + pageSize),
    totalPages,
    safePage,
  };
}

export function computeKpiCards(
  selectedGenre: GenreFilter,
  yearRange: YearRange,
  filteredGames: SteamGame[],
): KpiItemData[] {
  const isDefaultWindow =
    selectedGenre === 'Todos' &&
    yearRange.start === MIN_YEAR &&
    yearRange.end === MAX_YEAR;

  const totalSpan = MAX_YEAR - MIN_YEAR;
  const activeSpan = Math.max(1, yearRange.end - yearRange.start);
  const spanRatio = activeSpan / totalSpan;

  let approvalRate = 81.4;
  let averagePrice = 8.45;
  let peakCcu = 1010000;

  if (!isDefaultWindow) {
    const genreWeight =
      selectedGenre === 'Todos' ? 1 : GENRE_SHARE_WEIGHT[selectedGenre];

    const totalPositive = filteredGames.reduce(
      (sum, game) => sum + (game.positive ?? 0),
      0,
    );
    const totalNegative = filteredGames.reduce(
      (sum, game) => sum + (game.negative ?? 0),
      0,
    );
    const totalReviews = totalPositive + totalNegative;

    if (totalReviews > 0) {
      approvalRate = Math.min(98.5, Math.max(60, (totalPositive / totalReviews) * 100));
    } else {
      approvalRate = Math.max(70, 81.4 - (1 - spanRatio) * 4.5);
    }

    const pricedGames = filteredGames.filter((game) => game.price !== null);
    if (pricedGames.length > 0) {
      const sumPrice = pricedGames.reduce((sum, game) => sum + (game.price ?? 0), 0);
      averagePrice = sumPrice / pricedGames.length;
    } else {
      averagePrice = Math.max(2.5, 8.45 * (0.85 + genreWeight * 0.4));
    }

    peakCcu = Math.max(
      12500,
      Math.round(1010000 * (0.45 + spanRatio * 0.55) * (selectedGenre === 'Todos' ? 1 : 0.4 + genreWeight)),
    );
  }

  const approvalFormatted = `${approvalRate.toFixed(1).replace('.', ',')}%`;
  const priceFormatted = `$${averagePrice.toFixed(2).replace('.', ',')}`;
  const ccuFormatted = peakCcu.toLocaleString('es-ES');

  const scaleBar = (bars: number[], factor: number) =>
    bars.map((height) => Math.max(18, Math.min(100, Math.round(height * factor))));

  return [
    {
      id: 'approval',
      label: 'Tasa de aprobación',
      value: approvalFormatted,
      badgeText: 'Positiva',
      variant: 'positive',
      trendBars: scaleBar([38, 52, 46, 68, 60, 84, 78], isDefaultWindow ? 1 : 0.92 + spanRatio * 0.12),
    },
    {
      id: 'avg-price',
      label: 'Precio promedio',
      value: priceFormatted,
      badgeText: 'USD',
      variant: 'neutral',
      trendBars: scaleBar([42, 65, 55, 76, 48, 86, 62], isDefaultWindow ? 1 : 0.85 + Math.min(averagePrice / 25, 0.3)),
    },
    {
      id: 'peak-ccu',
      label: 'Pico máximo de CCU',
      value: ccuFormatted,
      badgeText: 'En vivo',
      variant: 'live',
      trendBars: scaleBar([30, 48, 42, 62, 74, 88, 96], isDefaultWindow ? 1 : 0.7 + spanRatio * 0.3),
    },
  ];
}

export function filterYearlyReleases(
  series: YearlyReleasePoint[],
  selectedGenre: GenreFilter,
  yearRange: YearRange,
): YearlyReleasePoint[] {
  const inRange = series.filter(
    (point) => point.year >= yearRange.start && point.year <= yearRange.end,
  );
  const source = inRange.length >= 2 ? inRange : series;

  if (selectedGenre === 'Todos') {
    return source;
  }
  const weight = GENRE_SHARE_WEIGHT[selectedGenre];
  return source.map((point) => ({
    year: point.year,
    releases: Math.max(15, Math.round(point.releases * weight)),
  }));
}

export function filterScatterPoints(
  points: PricePlaytimePoint[],
  selectedGenre: GenreFilter,
  yearRange: YearRange,
): PricePlaytimePoint[] {
  return points.filter((point) => {
    const matchesGenre =
      selectedGenre === 'Todos' || point.genre === selectedGenre;
    const matchesYear =
      point.year >= yearRange.start && point.year <= yearRange.end;
    return matchesGenre && matchesYear;
  });
}

export function computeGenreOwners(
  baseItems: GenreOwnerItem[],
  yearRange: YearRange,
): GenreOwnerItem[] {
  const ratio = Math.max(
    0.25,
    (yearRange.end - yearRange.start) / (MAX_YEAR - MIN_YEAR),
  );
  if (ratio >= 0.99) {
    return baseItems;
  }
  return baseItems.map((item) => ({
    ...item,
    ownersK: Math.max(2, Math.round(item.ownersK * (0.35 + ratio * 0.65))),
  }));
}

export function exportGamesToCsv(games: SteamGame[]): void {
  const headers = [
    'AppID',
    'Juego',
    'Géneros',
    'Fecha de lanzamiento',
    'Propietarios estimados',
    'Precio (USD)',
    'Peak CCU',
  ];

  const escapeCsv = (value: string | number | null) => {
    const text = value === null ? '' : String(value);
    return `"${text.replaceAll('"', '""')}"`;
  };

  const rows = games.map((game) =>
    [
      game.appId,
      game.name ?? '',
      game.genres.join(', '),
      game.releaseDate ?? '',
      game.owners ?? '',
      game.price ?? '',
      game.ccu ?? '',
    ]
      .map(escapeCsv)
      .join(','),
  );

  const csvContent = `\uFEFF${[headers.join(','), ...rows].join('\n')}`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'steam-nexus-informe.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
