import { Box, Stack, Typography } from '@mui/material';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import { LineChart } from '@mui/x-charts/LineChart';
import type { ReleasesLineChartProps } from '../../types/dashboard';

function formatReleasesTick(value: number): string {
  if (value === 0) {
    return '0';
  }
  if (value >= 1000) {
    const thousands = value / 1000;
    return Number.isInteger(thousands)
      ? `${thousands}k`
      : `${thousands.toFixed(1)}k`;
  }
  return String(Math.round(value));
}

export function ReleasesLineChart({ data }: ReleasesLineChartProps) {
  if (data.length === 0) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 230,
          borderRadius: 2.5,
          border: '1px dashed #D1D5DB',
          bgcolor: '#FAFAFB',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={0.75} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <ShowChartRoundedIcon sx={{ color: 'text.secondary', fontSize: 28 }} />
          <Typography variant="subtitle2" color="text.primary">
            Sin datos anuales para el filtro actual
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Amplía el rango de años o selecciona otro género para visualizar la evolución.
          </Typography>
        </Stack>
      </Box>
    );
  }

  const years = data.map((point) => point.year);
  const releases = data.map((point) => point.releases);
  const firstYear = years[0];
  const lastYear = years[years.length - 1];
  const maxReleases = Math.max(...releases, 0);

  const xTickInterval =
    lastYear - firstYear >= 4
      ? [firstYear, Math.round((firstYear + lastYear) / 2), lastYear]
      : firstYear !== lastYear
        ? [firstYear, lastYear]
        : [firstYear];

  const usePrototypeYScale = maxReleases > 12000 && maxReleases <= 18500;

  return (
    <Box
      sx={{ width: '100%', minWidth: 0 }}
      role="img"
      aria-label="Gráfico de evolución anual de lanzamientos de videojuegos"
    >
      <LineChart
        height={240}
        hideLegend
        skipAnimation
        grid={{ horizontal: true }}
        margin={{ top: 16, right: 20, bottom: 26, left: 6 }}
        xAxis={[
          {
            data: years,
            scaleType: 'linear',
            min: firstYear,
            max: lastYear,
            tickInterval: xTickInterval,
            disableLine: true,
            disableTicks: true,
            valueFormatter: (value: number) => String(Math.round(value)),
          },
        ]}
        yAxis={[
          {
            min: 0,
            ...(usePrototypeYScale
              ? { max: 18000, tickInterval: [0, 6000, 12000, 18000] }
              : { tickNumber: 4 }),
            width: 44,
            disableLine: true,
            disableTicks: true,
            valueFormatter: formatReleasesTick,
          },
        ]}
        series={[
          {
            id: 'yearly-releases',
            label: 'Lanzamientos',
            data: releases,
            color: '#18181B',
            showMark: true,
            curve: 'monotoneX',
            valueFormatter: (value) =>
              value === null
                ? 'Sin datos'
                : `${value.toLocaleString('es-ES')} juegos`,
          },
        ]}
        sx={{
          '& .MuiLineElement-root': {
            stroke: '#18181B',
            strokeWidth: 2.5,
            filter: 'drop-shadow(0px 3px 6px rgba(234, 88, 12, 0.4))',
          },
          '& .MuiMarkElement-root': {
            fill: '#FFFFFF',
            stroke: '#18181B',
            strokeWidth: 2,
          },
          '& .MuiChartsGrid-line': {
            stroke: '#EEF0F3',
            strokeDasharray: '3 3',
          },
          '& .MuiChartsAxis-tickLabel': {
            fill: '#6B7280',
            fontSize: 11,
          },
        }}
      />
    </Box>
  );
}
