import { Box, Stack, Typography } from '@mui/material';
import ScatterPlotRoundedIcon from '@mui/icons-material/ScatterPlotRounded';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import type { PricePlaytimeScatterChartProps } from '../../types/dashboard';
import { formatPriceUsd } from '../../utils/dashboardMetrics';

function formatPlaytimeTick(value: number): string {
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

export function PricePlaytimeScatterChart({
  data,
}: PricePlaytimeScatterChartProps) {
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
          <ScatterPlotRoundedIcon sx={{ color: 'text.secondary', fontSize: 28 }} />
          <Typography variant="subtitle2" color="text.primary">
            Sin puntos para los filtros actuales
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Ajusta el género o el rango de años para comparar precio y tiempo medio de juego.
          </Typography>
        </Stack>
      </Box>
    );
  }

  const maxPrice = Math.max(
    60,
    Math.ceil(Math.max(...data.map((point) => point.price), 0) / 15) * 15,
  );
  const maxPlaytime = Math.max(
    1200,
    Math.ceil(Math.max(...data.map((point) => point.averagePlaytime), 0) / 400) *
      400,
  );

  const scatterPoints = data.map((point) => ({
    id: point.id,
    x: point.price,
    y: point.averagePlaytime,
  }));

  return (
    <Box
      sx={{ width: '100%', minWidth: 0 }}
      role="img"
      aria-label="Gráfico de dispersión entre precio en dólares y tiempo medio de juego en minutos"
    >
      <ScatterChart
        height={240}
        hideLegend
        grid={{ horizontal: true }}
        margin={{ top: 16, right: 18, bottom: 26, left: 6 }}
        xAxis={[
          {
            min: 0,
            max: maxPrice,
            ...(maxPrice === 60
              ? { tickInterval: [0, 15, 30, 45, 60] }
              : { tickNumber: 5 }),
            disableLine: true,
            disableTicks: true,
            valueFormatter: (value: number) => `$${Math.round(value)}`,
          },
        ]}
        yAxis={[
          {
            min: 0,
            max: maxPlaytime,
            ...(maxPlaytime === 1200
              ? { tickInterval: [0, 400, 800, 1200] }
              : { tickNumber: 4 }),
            width: 44,
            disableLine: true,
            disableTicks: true,
            valueFormatter: formatPlaytimeTick,
          },
        ]}
        series={[
          {
            id: 'price-vs-playtime',
            label: 'Juego',
            data: scatterPoints,
            color: '#EA580C',
            markerSize: 6,
            valueFormatter: (point, context) => {
              if (!point) {
                return null;
              }
              const source = data[context.dataIndex];
              const prefix = source ? `${source.name} · ` : '';
              return `${prefix}${formatPriceUsd(point.x)} · ${Math.round(point.y).toLocaleString('es-ES')} min`;
            },
          },
        ]}
        sx={{
          '& .MuiScatterChart-marker': {
            fill: 'rgba(234, 88, 12, 0.14)',
            stroke: '#C2410C',
            strokeWidth: 2,
            transition: 'fill 150ms ease, stroke-width 150ms ease',
          },
          '& .MuiScatterChart-marker:hover': {
            fill: 'rgba(234, 88, 12, 0.35)',
            stroke: '#EA580C',
            strokeWidth: 2.5,
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
