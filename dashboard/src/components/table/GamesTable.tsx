import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import type { GamesTableProps } from '../../types/dashboard';

export function GamesTable(props: GamesTableProps) {
  // TODO: Implementar la vista completa del catálogo de videojuegos usando componentes de MUI:
  // - Buscador TextField conectado a `props.searchTerm` y `props.onSearchChange`.
  // - Tabla responsiva (TableContainer + Table): 6 columnas en escritorio (AppID, Juego,
  //   Lanzamiento, Propietarios, Precio, CCU) y 3 columnas principales en móvil (AppID, Juego, Lanzamiento).
  // - Estado vacío cuando no existan coincidencias y controles de paginación usando
  //   `props.currentPage`, `props.totalPages` y `props.onPageChange`.
  // - Pueden reutilizarse los helpers de formato disponibles en `src/utils/dashboardMetrics.ts`.
  const { games, totalVisibleText, currentPage, totalPages } = props;

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.25, sm: 2.5 }, '&:last-child': { pb: 2.5 } }}>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="overline" sx={{ display: 'block' }}>
              INVENTARIO DESBLOQUEADO
            </Typography>
            <Typography variant="h6" component="h2">
              Catálogo de videojuegos
            </Typography>
          </Box>

          <Chip
            label={totalVisibleText}
            size="small"
            sx={{ bgcolor: '#F4F5F7', color: 'text.secondary', fontSize: '0.7rem' }}
          />
        </Stack>

        <Box
          sx={{
            minHeight: 200,
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
            <TableChartOutlinedIcon sx={{ color: 'primary.main', fontSize: 30 }} />
            <Typography variant="subtitle2" color="text.primary">
              Tabla de catálogo de videojuegos
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Espacio reservado para tabla responsiva con buscador y paginación ({games.length}{' '}
              filas en página {currentPage} de {totalPages})
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
