import {
  DEFAULT_MAX_YEAR,
  DEFAULT_MIN_YEAR,
  GENRE_LABELS,
  PRIMARY_GENRES,
} from '../constants/dashboardConfig';
import type {
  GenreFilter,
  GenreOwnerItem,
  KpiItemData,
  PricePlaytimePoint,
  PrimaryGenre,
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

const PRIMARY_GENRE_SET = new Set<string>(PRIMARY_GENRES);

export function getReleaseYear(releaseDate: string | null): number | null {
  if (!releaseDate || releaseDate.length < 4) {
    return null;
  }
  const year = Number(releaseDate.slice(0, 4));
  return Number.isNaN(year) ? null : year;
}

export function computeYearBounds(games: SteamGame[]): { min: number; max: number } {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (const game of games) {
    const year = getReleaseYear(game.releaseDate);
    if (year !== null && year >= 1990 && year <= 2030) {
      if (year < min) {
        min = year;
      }
      if (year > max) {
        max = year;
      }
    }
  }

  if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) {
    return { min: DEFAULT_MIN_YEAR, max: DEFAULT_MAX_YEAR };
  }

  return { min, max };
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

export function parseOwnersMidpoint(owners: string | null): number {
  if (!owners) {
    return 0;
  }
  const parts = owners.split('-');
  if (parts.length !== 2) {
    const single = Number(owners.trim().replaceAll(',', ''));
    return Number.isNaN(single) ? 0 : single;
  }
  const low = Number(parts[0].trim().replaceAll(',', ''));
  const high = Number(parts[1].trim().replaceAll(',', ''));
  if (Number.isNaN(low) || Number.isNaN(high)) {
    return 0;
  }
  return (low + high) / 2;
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

export function formatCompactOwners(ownersK: number): string {
  if (ownersK >= 1000) {
    const millions = ownersK / 1000;
    return `${millions.toFixed(1).replace('.', ',')}M`;
  }
  return `${ownersK.toLocaleString('es-ES')}k`;
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

function normalizeTrendBars(values: number[], fallback: number[]): number[] {
  if (values.length === 0) {
    return fallback;
  }
  const sliced = values.slice(-7);
  const maxVal = Math.max(...sliced);
  if (maxVal <= 0) {
    return fallback;
  }
  while (sliced.length < 7) {
    sliced.unshift(sliced[0] ?? 0);
  }
  return sliced.map((val) => Math.max(18, Math.min(100, Math.round((val / maxVal) * 100))));
}

export function computeKpiCards(filteredGames: SteamGame[]): KpiItemData[] {
  let totalPositive = 0;
  let totalNegative = 0;
  let priceSum = 0;
  let pricedCount = 0;
  let peakCcu = 0;

  const byYear = new Map<
    number,
    { pos: number; neg: number; priceSum: number; pricedCount: number; maxCcu: number }
  >();

  for (const game of filteredGames) {
    const pos = game.positive ?? 0;
    const neg = game.negative ?? 0;
    totalPositive += pos;
    totalNegative += neg;

    if (game.price !== null) {
      priceSum += game.price;
      pricedCount += 1;
    }

    const ccu = game.ccu ?? 0;
    if (ccu > peakCcu) {
      peakCcu = ccu;
    }

    const year = getReleaseYear(game.releaseDate);
    if (year !== null) {
      const bucket = byYear.get(year) ?? {
        pos: 0,
        neg: 0,
        priceSum: 0,
        pricedCount: 0,
        maxCcu: 0,
      };
      bucket.pos += pos;
      bucket.neg += neg;
      if (game.price !== null) {
        bucket.priceSum += game.price;
        bucket.pricedCount += 1;
      }
      if (ccu > bucket.maxCcu) {
        bucket.maxCcu = ccu;
      }
      byYear.set(year, bucket);
    }
  }

  const totalReviews = totalPositive + totalNegative;
  const approvalRate = totalReviews > 0 ? (totalPositive / totalReviews) * 100 : 0;
  const averagePrice = pricedCount > 0 ? priceSum / pricedCount : 0;

  const sortedYears = Array.from(byYear.entries()).sort((a, b) => a[0] - b[0]);

  const approvalSeries = sortedYears
    .map(([, bucket]) => {
      const total = bucket.pos + bucket.neg;
      return total > 0 ? (bucket.pos / total) * 100 : 0;
    })
    .filter((v) => v > 0);

  const priceSeries = sortedYears
    .map(([, bucket]) => (bucket.pricedCount > 0 ? bucket.priceSum / bucket.pricedCount : 0))
    .filter((v) => v > 0);

  const ccuSeries = sortedYears.map(([, bucket]) => bucket.maxCcu);

  const approvalFormatted =
    totalReviews > 0 ? `${approvalRate.toFixed(1).replace('.', ',')}%` : 'N/D';
  const priceFormatted =
    pricedCount > 0 ? `$${averagePrice.toFixed(2).replace('.', ',')}` : 'N/D';
  const ccuFormatted = peakCcu.toLocaleString('es-ES');

  return [
    {
      id: 'approval',
      label: 'Tasa de aprobación',
      value: approvalFormatted,
      badgeText: 'Positiva',
      variant: 'positive',
      trendBars: normalizeTrendBars(approvalSeries, [38, 52, 46, 68, 60, 84, 78]),
    },
    {
      id: 'avg-price',
      label: 'Precio promedio',
      value: priceFormatted,
      badgeText: 'USD',
      variant: 'neutral',
      trendBars: normalizeTrendBars(priceSeries, [42, 65, 55, 76, 48, 86, 62]),
    },
    {
      id: 'peak-ccu',
      label: 'Pico máximo de CCU',
      value: ccuFormatted,
      badgeText: 'En vivo',
      variant: 'live',
      trendBars: normalizeTrendBars(ccuSeries, [30, 48, 42, 62, 74, 88, 96]),
    },
  ];
}

export function computeYearlyReleases(filteredGames: SteamGame[]): YearlyReleasePoint[] {
  const counts = new Map<number, number>();

  for (const game of filteredGames) {
    const year = getReleaseYear(game.releaseDate);
    if (year !== null) {
      counts.set(year, (counts.get(year) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([year, releases]) => ({ year, releases }));
}

export function computeScatterPoints(
  filteredGames: SteamGame[],
  maxPoints = 40,
): PricePlaytimePoint[] {
  const candidates: PricePlaytimePoint[] = [];

  for (const game of filteredGames) {
    const price = game.price;
    const playtime = game.averagePlaytime;
    const year = getReleaseYear(game.releaseDate);

    if (
      price === null ||
      playtime === null ||
      year === null ||
      price <= 0 ||
      price > 60 ||
      playtime <= 0 ||
      playtime > 1200
    ) {
      continue;
    }

    const matchedGenre = game.genres.find((genre) => PRIMARY_GENRE_SET.has(genre));
    const primaryGenre: PrimaryGenre = (matchedGenre as PrimaryGenre | undefined) ?? 'Indie';

    candidates.push({
      id: String(game.appId),
      name: game.name ?? `App ${game.appId}`,
      price,
      averagePlaytime: playtime,
      genre: primaryGenre,
      year,
    });
  }

  if (candidates.length <= maxPoints) {
    return candidates;
  }

  // Muestreo determinista repartido por precio para mantener visibilidad en todo el rango
  candidates.sort((a, b) => a.price - b.price || a.averagePlaytime - b.averagePlaytime);
  const sampled: PricePlaytimePoint[] = [];
  const step = (candidates.length - 1) / (maxPoints - 1);

  for (let index = 0; index < maxPoints; index += 1) {
    sampled.push(candidates[Math.round(index * step)]);
  }

  return sampled;
}

export function computeGenreOwners(gamesInYearRange: SteamGame[]): GenreOwnerItem[] {
  const totals: Record<PrimaryGenre, number> = {
    Action: 0,
    Indie: 0,
    Adventure: 0,
    RPG: 0,
    Strategy: 0,
  };

  for (const game of gamesInYearRange) {
    const midpoint = parseOwnersMidpoint(game.owners);
    if (midpoint <= 0) {
      continue;
    }
    for (const genre of PRIMARY_GENRES) {
      if (game.genres.includes(genre)) {
        totals[genre] += midpoint;
      }
    }
  }

  return PRIMARY_GENRES.map((key) => ({
    key,
    label: GENRE_LABELS[key] ?? key,
    ownersK: Math.round(totals[key] / 1000),
  })).sort((a, b) => b.ownersK - a.ownersK);
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
