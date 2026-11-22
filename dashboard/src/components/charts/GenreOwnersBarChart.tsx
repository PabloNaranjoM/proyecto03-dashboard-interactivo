import { Box, Stack, Typography } from '@mui/material';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import type { GenreOwnersBarChartProps } from '../../types/dashboard';

export function GenreOwnersBarChart(props: GenreOwnersBarChartProps) {
  // TODO: Implementar el ranking de barras horizontales de propietarios por género con MUI
  // usando `props.data`, resaltando `props.selectedGenre` y permitiendo filtrar por género
  // al hacer clic en cada barra mediante `props.onSelectGenre` (con opción de volver a 'Todos').
  const { data, selectedGenre } = props;

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
        <BarChartRoundedIcon sx={{ color: 'primary.main', fontSize: 30 }} />
        <Typography variant="subtitle2" color="text.primary">
          Propietarios por género
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Espacio reservado para barras horizontales ({data.length} géneros · filtro:{' '}
          {selectedGenre})
        </Typography>
      </Stack>
    </Box>
  );
}
