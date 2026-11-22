import { Box, Stack, Typography } from '@mui/material';
import ScatterPlotRoundedIcon from '@mui/icons-material/ScatterPlotRounded';
import type { PricePlaytimeScatterChartProps } from '../../types/dashboard';

export function PricePlaytimeScatterChart({ data }: PricePlaytimeScatterChartProps) {
  // TODO: Implementar el gráfico de dispersión utilizando ScatterChart de @mui/x-charts
  // para relacionar `price` (USD en eje X) con `averagePlaytime` (minutos en eje Y) a partir de `data`.
  // Incluir manejo de estado vacío cuando el filtro no devuelva puntos.
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
        <ScatterPlotRoundedIcon sx={{ color: 'primary.main', fontSize: 30 }} />
        <Typography variant="subtitle2" color="text.primary">
          Precio vs. tiempo medio de juego
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Espacio reservado para gráfico de dispersión ({data.length} puntos filtrados)
        </Typography>
      </Stack>
    </Box>
  );
}
