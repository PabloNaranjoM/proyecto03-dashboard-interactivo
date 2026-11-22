import { Grid, Stack } from '@mui/material';
import type { ChartsSectionProps } from '../../types/dashboard';
import { KpiGrid } from '../kpi/KpiGrid';
import { ChartCard } from './ChartCard';
import { GenreOwnersBarChart } from './GenreOwnersBarChart';
import { PricePlaytimeScatterChart } from './PricePlaytimeScatterChart';
import { ReleasesLineChart } from './ReleasesLineChart';

export function ChartsSection({
  kpiItems,
  lineData,
  scatterData,
  genreData,
  yearRange,
  selectedGenre,
  onSelectGenre,
}: ChartsSectionProps) {
  return (
    <Stack spacing={2.5}>
      {/* Fila superior: 3 KPIs apilados (1/3) + Evolución anual de lanzamientos (2/3) */}
      <Grid container spacing={2.5} sx={{ alignItems: 'stretch' }}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <KpiGrid items={kpiItems} />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <ChartCard
            category="HISTORIAL DE PARTIDAS"
            title="Evolución anual de lanzamientos"
            unitBadge={`${yearRange.start}—${yearRange.end}`}
            footnote="Juegos publicados por año"
          >
            <ReleasesLineChart data={lineData} />
          </ChartCard>
        </Grid>
      </Grid>

      {/* Fila central: Dispersión (1/2) + Propietarios por género (1/2) */}
      <Grid
        container
        spacing={2.5}
        id="section-trends"
        sx={{ alignItems: 'stretch', scrollMarginTop: 24 }}
      >
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard
            category="DUELO DE VARIABLES"
            title="Precio vs. tiempo medio de juego"
            unitBadge="USD / minutos"
            footnote="Tiempo medio total de juego"
          >
            <PricePlaytimeScatterChart data={scatterData} />
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard
            category="MAPA DE POPULARIDAD"
            title="Propietarios por género"
            unitBadge="Estimado"
          >
            <GenreOwnersBarChart
              data={genreData}
              selectedGenre={selectedGenre}
              onSelectGenre={onSelectGenre}
            />
          </ChartCard>
        </Grid>
      </Grid>
    </Stack>
  );
}
