import { Box, Stack, Typography } from '@mui/material';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import type { ReleasesLineChartProps } from '../../types/dashboard';

export function ReleasesLineChart({ data }: ReleasesLineChartProps) {
  // TODO: Implementar el gráfico de líneas de evolución anual de lanzamientos
  // utilizando LineChart de @mui/x-charts a partir de la prop `data` (`year`, `releases`).
  // Considerar el formateo del eje Y en miles (0, 6k, 12k, 18k), tooltips y adaptación responsiva.
  const firstYear = data[0]?.year;
  const lastYear = data[data.length - 1]?.year;

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
        <ShowChartRoundedIcon sx={{ color: 'primary.main', fontSize: 30 }} />
        <Typography variant="subtitle2" color="text.primary">
          Evolución anual de lanzamientos
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Espacio reservado para gráfico de líneas ({data.length} puntos
          {firstYear && lastYear ? ` · ${firstYear}–${lastYear}` : ''})
        </Typography>
      </Stack>
    </Box>
  );
}
