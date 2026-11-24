import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  LinearProgress,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { useMemo, useState } from 'react';
import {
  DEFAULT_MAX_YEAR,
  DEFAULT_MIN_YEAR,
  DEFAULT_PAGE_SIZE,
  GENRE_OPTIONS,
} from '../../constants/dashboardConfig';
import { useSteamGames } from '../../hooks/useSteamGames';
import type {
  GenreFilter,
  NavSectionId,
  SystemModalId,
  YearRange,
} from '../../types/dashboard';
import {
  computeGenreOwners,
  computeKpiCards,
  computeScatterPoints,
  computeYearBounds,
  computeYearlyReleases,
  exportGamesToCsv,
  filterSteamGames,
  paginateGames,
} from '../../utils/dashboardMetrics';
import { ChartsSection } from '../charts/ChartsSection';
import { FilterBar } from '../filters/FilterBar';
import { GamesTable } from '../table/GamesTable';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function DashboardLayout() {
  const { games, loading, error, reload } = useSteamGames();

  const [selectedGenre, setSelectedGenre] = useState<GenreFilter>('Todos');
  const [yearRange, setYearRange] = useState<YearRange>({
    start: DEFAULT_MIN_YEAR,
    end: DEFAULT_MAX_YEAR,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSectionId>('dashboard');
  const [activeModal, setActiveModal] = useState<SystemModalId>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const yearBounds = useMemo(() => computeYearBounds(games), [games]);

  const effectiveYearRange = useMemo<YearRange>(() => {
    const start = Math.max(yearBounds.min, Math.min(yearRange.start, yearBounds.max - 1));
    const end = Math.min(yearBounds.max, Math.max(yearRange.end, start + 1));
    return { start, end };
  }, [yearBounds, yearRange]);

  const gamesInYearRange = useMemo(
    () => filterSteamGames(games, 'Todos', effectiveYearRange, ''),
    [games, effectiveYearRange],
  );

  const globallyFilteredGames = useMemo(
    () => filterSteamGames(games, selectedGenre, effectiveYearRange, ''),
    [games, selectedGenre, effectiveYearRange],
  );

  const tableFilteredGames = useMemo(
    () => filterSteamGames(games, selectedGenre, effectiveYearRange, searchTerm),
    [games, selectedGenre, effectiveYearRange, searchTerm],
  );

  const { items: visibleGames, totalPages, safePage } = useMemo(
    () => paginateGames(tableFilteredGames, currentPage, DEFAULT_PAGE_SIZE),
    [tableFilteredGames, currentPage],
  );

  const kpiItems = useMemo(
    () => computeKpiCards(globallyFilteredGames),
    [globallyFilteredGames],
  );

  const lineData = useMemo(
    () => computeYearlyReleases(globallyFilteredGames),
    [globallyFilteredGames],
  );

  const scatterData = useMemo(
    () => computeScatterPoints(globallyFilteredGames),
    [globallyFilteredGames],
  );

  const genreData = useMemo(
    () => computeGenreOwners(gamesInYearRange),
    [gamesInYearRange],
  );

  const handleGenreChange = (genre: GenreFilter) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  const handleYearChange = (range: YearRange) => {
    setYearRange(range);
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedGenre('Todos');
    setYearRange({ start: yearBounds.min, end: yearBounds.max });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleSelectSection = (section: NavSectionId) => {
    setActiveSection(section);
    const element = document.getElementById(`section-${section}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleExport = () => {
    exportGamesToCsv(tableFilteredGames);
    setExportNotice(
      `Informe CSV generado con ${tableFilteredGames.length.toLocaleString('es-ES')} juegos visibles.`,
    );
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar
        activeSection={activeSection}
        indexedCount={games.length}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onSelectSection={handleSelectSection}
        onOpenModal={setActiveModal}
      />

      <Box
        component="main"
        id="section-dashboard"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          px: { xs: 2, sm: 3, lg: 4 },
          py: { xs: 2, sm: 3 },
        }}
      >
        <Stack spacing={2.5} sx={{ maxWidth: 1360, mx: 'auto' }}>
          <Header
            subtitle="INTELIGENCIA DE MERCADO // EN VIVO"
            title="Centro de mando de Steam"
            totalGames={games.length}
            onExport={handleExport}
            onToggleMenu={() => setMobileMenuOpen((open) => !open)}
          />

          <FilterBar
            genresList={GENRE_OPTIONS}
            selectedGenre={selectedGenre}
            yearRange={effectiveYearRange}
            minYear={yearBounds.min}
            maxYear={yearBounds.max}
            onGenreChange={handleGenreChange}
            onYearChange={handleYearChange}
            onReset={handleResetFilters}
          />

          {error && (
            <Alert
              severity="error"
              variant="outlined"
              action={
                <Button
                  color="error"
                  size="small"
                  startIcon={<RefreshRoundedIcon fontSize="small" />}
                  onClick={reload}
                >
                  Reintentar
                </Button>
              }
              sx={{ bgcolor: '#FFFFFF', borderRadius: 3 }}
            >
              Error al recuperar los datos desde Firebase Realtime Database: {error}
            </Alert>
          )}

          {loading ? (
            <Stack spacing={2.5} aria-busy="true" aria-label="Cargando datos desde Firebase">
              <Card>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Stack spacing={1}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Conectando con Firebase Realtime Database...
                    </Typography>
                    <LinearProgress color="primary" sx={{ borderRadius: 99 }} />
                  </Stack>
                </CardContent>
              </Card>

              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, lg: 4 }}>
                  <Stack spacing={2}>
                    {[0, 1, 2].map((index) => (
                      <Card key={index}>
                        <CardContent sx={{ p: 2.25 }}>
                          <Skeleton variant="text" width="55%" height={20} />
                          <Skeleton variant="text" width="45%" height={42} sx={{ mt: 1 }} />
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, lg: 8 }}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Skeleton variant="text" width="35%" height={18} />
                      <Skeleton variant="text" width="50%" height={28} sx={{ mb: 2 }} />
                      <Skeleton variant="rounded" height={230} />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, lg: 6 }}>
                  <Card>
                    <CardContent sx={{ p: 2.5 }}>
                      <Skeleton variant="text" width="45%" height={26} sx={{ mb: 2 }} />
                      <Skeleton variant="rounded" height={220} />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, lg: 6 }}>
                  <Card>
                    <CardContent sx={{ p: 2.5 }}>
                      <Skeleton variant="text" width="45%" height={26} sx={{ mb: 2 }} />
                      <Skeleton variant="rounded" height={220} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Card>
                <CardContent sx={{ p: 2.5 }}>
                  <Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />
                  <Skeleton variant="rounded" height={210} />
                </CardContent>
              </Card>
            </Stack>
          ) : (
            <>
              <ChartsSection
                kpiItems={kpiItems}
                lineData={lineData}
                scatterData={scatterData}
                genreData={genreData}
                yearRange={effectiveYearRange}
                selectedGenre={selectedGenre}
                onSelectGenre={handleGenreChange}
              />

              <Box id="section-library" sx={{ scrollMarginTop: 24 }}>
                <GamesTable
                  games={visibleGames}
                  totalVisibleText={`${tableFilteredGames.length.toLocaleString('es-ES')} de ${games.length.toLocaleString('es-ES')} visibles`}
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                  currentPage={safePage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </Box>
            </>
          )}
        </Stack>
      </Box>

      {/* Modal: Guía de datos */}
      <Dialog
        open={activeModal === 'guide'}
        onClose={() => setActiveModal(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Guía de datos — Steam Nexus</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              El panel consulta en vivo el conjunto <strong>Steam Games Dataset</strong>{' '}
              almacenado en <strong>Firebase Realtime Database</strong> (repositorio del
              proyecto <code>data-repository-p03</code>).
            </Typography>
            <Divider />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Variables temporales
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Release date</strong> (formato ISO <code>YYYY-MM-DD</code>):
                permite agrupar lanzamientos anuales dentro del rango activo.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Variables categóricas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Genres</strong>, <strong>Estimated owners</strong>,{' '}
                <strong>Categories</strong>, <strong>Developers</strong> y compatibilidad
                nativa (<strong>Windows / Mac / Linux</strong>).
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Variables numéricas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Price</strong> (USD), <strong>Peak CCU</strong>,{' '}
                <strong>Positive / Negative</strong> (tasa de aprobación) y{' '}
                <strong>Average playtime forever</strong> (minutos).
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="contained" onClick={() => setActiveModal(null)}>
            Entendido
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: Configuración */}
      <Dialog
        open={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Configuración del panel</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.75}>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="body2" color="text.secondary">
                Fuente de datos
              </Typography>
              <Chip
                label="Firebase Realtime DB"
                size="small"
                color="success"
                variant="outlined"
              />
            </Stack>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="body2" color="text.secondary">
                Registros cargados
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {games.length.toLocaleString('es-ES')}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="body2" color="text.secondary">
                Ventana temporal
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {effectiveYearRange.start} – {effectiveYearRange.end}
              </Typography>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              handleResetFilters();
              setActiveModal(null);
            }}
          >
            Restablecer filtros
          </Button>
          <Button variant="contained" onClick={() => setActiveModal(null)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={exportNotice !== null}
        autoHideDuration={3500}
        onClose={() => setExportNotice(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setExportNotice(null)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {exportNotice}
        </Alert>
      </Snackbar>
    </Box>
  );
}
