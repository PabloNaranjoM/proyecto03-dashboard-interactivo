import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import type { GamesTableProps } from '../../types/dashboard';
import {
  formatOwnersRange,
  formatPriceUsd,
  formatReleaseDateEs,
  getPrimaryGenreLabel,
} from '../../utils/dashboardMetrics';

const DESKTOP_ONLY_CELL_SX = {
  display: { xs: 'none', md: 'table-cell' },
} as const;

type PaginationItem = number | 'ellipsis-start' | 'ellipsis-end';

function buildPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PaginationItem[] = [1];
  const windowStart = Math.max(2, currentPage - 1);
  const windowEnd = Math.min(totalPages - 1, currentPage + 1);

  if (windowStart > 2) {
    items.push('ellipsis-start');
  }

  for (let page = windowStart; page <= windowEnd; page += 1) {
    items.push(page);
  }

  if (windowEnd < totalPages - 1) {
    items.push('ellipsis-end');
  }

  items.push(totalPages);
  return items;
}

export function GamesTable({
  games,
  totalVisibleText,
  searchTerm,
  onSearchChange,
  currentPage,
  totalPages,
  onPageChange,
}: GamesTableProps) {
  const paginationItems = buildPaginationItems(currentPage, totalPages);

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.25, sm: 2.5 }, '&:last-child': { pb: 2.5 } }}>
        {/* Encabezado */}
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
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
            sx={{
              bgcolor: '#F4F5F7',
              color: 'text.secondary',
              fontSize: '0.7rem',
              flexShrink: 0,
            }}
          />
        </Stack>

        {/* Barra de búsqueda e indicador de página */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.25}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            mb: 2,
          }}
        >
          <TextField
            size="small"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            sx={{ width: { xs: '100%', sm: 290 } }}
            slotProps={{
              htmlInput: {
                'aria-label': 'Buscar videojuego por nombre',
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon
                      fontSize="small"
                      sx={{ color: 'text.secondary' }}
                    />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      edge="end"
                      aria-label="Limpiar búsqueda"
                      onClick={() => onSearchChange('')}
                    >
                      <CloseRoundedIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />

          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '0.76rem',
              fontWeight: 500,
              textAlign: { xs: 'right', sm: 'left' },
            }}
          >
            Página {currentPage.toLocaleString('es-ES')} de {totalPages.toLocaleString('es-ES')}
          </Typography>
        </Stack>

        {/* Tabla responsiva: 6 columnas en escritorio, 3 columnas en móvil */}
        <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
          <Table aria-label="Catálogo de videojuegos de Steam">
            <TableHead>
              <TableRow>
                <TableCell sx={{ px: { xs: 0.75, sm: 2 }, whiteSpace: 'nowrap' }}>
                  AppID
                </TableCell>
                <TableCell sx={{ px: { xs: 0.75, sm: 2 } }}>Juego</TableCell>
                <TableCell sx={{ px: { xs: 0.75, sm: 2 }, whiteSpace: 'nowrap' }}>
                  Lanzamiento
                </TableCell>
                <TableCell sx={{ ...DESKTOP_ONLY_CELL_SX, whiteSpace: 'nowrap' }}>
                  Propietarios
                </TableCell>
                <TableCell sx={{ ...DESKTOP_ONLY_CELL_SX, whiteSpace: 'nowrap' }}>
                  Precio
                </TableCell>
                <TableCell sx={{ ...DESKTOP_ONLY_CELL_SX, whiteSpace: 'nowrap' }}>
                  CCU
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {games.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{ borderBottom: 'none', py: 5, textAlign: 'center' }}
                  >
                    <Stack
                      spacing={1}
                      sx={{ alignItems: 'center', justifyContent: 'center' }}
                    >
                      <SearchOffRoundedIcon
                        sx={{ fontSize: 30, color: 'text.secondary' }}
                      />
                      <Typography variant="subtitle2" color="text.primary">
                        No hay juegos que coincidan con los filtros activos.
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Prueba con otro término de búsqueda o restablece los filtros globales.
                      </Typography>
                      {searchTerm.trim().length > 0 && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => onSearchChange('')}
                          sx={{ mt: 0.5 }}
                        >
                          Limpiar búsqueda
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                games.map((game) => (
                  <TableRow
                    key={game.appId}
                    hover
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                    }}
                  >
                    <TableCell
                      sx={{
                        px: { xs: 0.75, sm: 2 },
                        color: 'text.secondary',
                        fontSize: { xs: '0.75rem', sm: '0.82rem' },
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {game.appId}
                    </TableCell>

                    <TableCell sx={{ px: { xs: 0.75, sm: 2 } }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: 'text.primary',
                          fontSize: { xs: '0.78rem', sm: '0.85rem' },
                          lineHeight: 1.35,
                        }}
                      >
                        {game.name ?? 'Sin título'}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          color: 'text.secondary',
                          fontSize: '0.72rem',
                        }}
                      >
                        {getPrimaryGenreLabel(game.genres)}
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{
                        px: { xs: 0.75, sm: 2 },
                        fontSize: { xs: '0.75rem', sm: '0.82rem' },
                        color: 'text.primary',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatReleaseDateEs(game.releaseDate)}
                    </TableCell>

                    <TableCell
                      sx={{
                        ...DESKTOP_ONLY_CELL_SX,
                        fontSize: '0.82rem',
                        color: 'text.secondary',
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatOwnersRange(game.owners)}
                    </TableCell>

                    <TableCell
                      sx={{
                        ...DESKTOP_ONLY_CELL_SX,
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'text.primary',
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatPriceUsd(game.price)}
                    </TableCell>

                    <TableCell
                      sx={{
                        ...DESKTOP_ONLY_CELL_SX,
                        fontSize: '0.82rem',
                        color: 'text.primary',
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {(game.ccu ?? 0).toLocaleString('es-ES')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Controles de paginación */}
        <Stack
          direction="row"
          spacing={{ xs: 0.5, sm: 0.75 }}
          sx={{
            justifyContent: { xs: 'center', md: 'flex-end' },
            alignItems: 'center',
            mt: 2.25,
            pt: 1.75,
            borderTop: '1px solid #EEF0F3',
            flexWrap: 'wrap',
            rowGap: 1,
          }}
        >
          <Button
            size="small"
            variant="outlined"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            sx={{ px: { xs: 1, sm: 1.5 }, minHeight: { xs: 28, sm: 32 }, fontSize: { xs: '0.74rem', sm: '0.78rem' } }}
          >
            Anterior
          </Button>

          {paginationItems.map((item) => {
            if (typeof item !== 'number') {
              return (
                <Typography
                  key={item}
                  component="span"
                  aria-hidden="true"
                  sx={{
                    px: 0.5,
                    color: 'text.secondary',
                    fontSize: '0.8rem',
                    userSelect: 'none',
                  }}
                >
                  …
                </Typography>
              );
            }

            const isCurrent = item === currentPage;
            return (
              <Button
                key={item}
                size="small"
                variant={isCurrent ? 'contained' : 'outlined'}
                color={isCurrent ? 'secondary' : 'inherit'}
                aria-current={isCurrent ? 'page' : undefined}
                onClick={() => onPageChange(item)}
                sx={{
                  minWidth: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                  px: 0.85,
                  fontSize: { xs: '0.74rem', sm: '0.78rem' },
                  fontVariantNumeric: 'tabular-nums',
                  ...(isCurrent
                    ? {
                        bgcolor: 'secondary.main',
                        color: 'secondary.contrastText',
                        '&:hover': { bgcolor: 'secondary.light' },
                      }
                    : {
                        borderColor: '#E2E5EB',
                        color: 'text.secondary',
                      }),
                }}
              >
                {item.toLocaleString('es-ES')}
              </Button>
            );
          })}

          <Button
            size="small"
            variant="outlined"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            sx={{ px: { xs: 1, sm: 1.5 }, minHeight: { xs: 28, sm: 32 }, fontSize: { xs: '0.74rem', sm: '0.78rem' } }}
          >
            Siguiente
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
