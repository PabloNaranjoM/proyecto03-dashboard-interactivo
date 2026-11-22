import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import {
  BASE_GENRE_OWNERS,
  BASE_SCATTER_POINTS,
  BASE_YEARLY_RELEASES,
  DEFAULT_PAGE_SIZE,
  GENRE_OPTIONS,
  MAX_YEAR,
  MIN_YEAR,
  MOCK_STEAM_GAMES,
  TOTAL_INDEXED_GAMES,
} from '../../data/mockSteamData';
import type {
  GenreFilter,
  NavSectionId,
  SystemModalId,
  YearRange,
} from '../../types/dashboard';
import {
  computeGenreOwners,
  computeKpiCards,
  exportGamesToCsv,
  filterScatterPoints,
  filterSteamGames,
  filterYearlyReleases,
  paginateGames,
} from '../../utils/dashboardMetrics';
import { ChartsSection } from '../charts/ChartsSection';
import { FilterBar } from '../filters/FilterBar';
import { GamesTable } from '../table/GamesTable';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function DashboardLayout() {
  const [selectedGenre, setSelectedGenre] = useState<GenreFilter>('Todos');
  const [yearRange, setYearRange] = useState<YearRange>({
    start: MIN_YEAR,
    end: MAX_YEAR,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSectionId>('dashboard');
  const [activeModal, setActiveModal] = useState<SystemModalId>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const globallyFilteredGames = useMemo(
    () => filterSteamGames(MOCK_STEAM_GAMES, selectedGenre, yearRange, ''),
    [selectedGenre, yearRange],
  );

  const tableFilteredGames = useMemo(
    () => filterSteamGames(MOCK_STEAM_GAMES, selectedGenre, yearRange, searchTerm),
    [selectedGenre, yearRange, searchTerm],
  );

  const { items: visibleGames, totalPages, safePage } = useMemo(
    () => paginateGames(tableFilteredGames, currentPage, DEFAULT_PAGE_SIZE),
    [tableFilteredGames, currentPage],
  );

  const kpiItems = useMemo(
    () => computeKpiCards(selectedGenre, yearRange, globallyFilteredGames),
    [selectedGenre, yearRange, globallyFilteredGames],
  );

  const lineData = useMemo(
    () => filterYearlyReleases(BASE_YEARLY_RELEASES, selectedGenre, yearRange),
    [selectedGenre, yearRange],
  );

  const scatterData = useMemo(
    () => filterScatterPoints(BASE_SCATTER_POINTS, selectedGenre, yearRange),
    [selectedGenre, yearRange],
  );

  const genreData = useMemo(
    () => computeGenreOwners(BASE_GENRE_OWNERS, yearRange),
    [yearRange],
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
    setYearRange({ start: MIN_YEAR, end: MAX_YEAR });
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
      `Informe CSV generado con ${tableFilteredGames.length} juegos visibles.`,
    );
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar
        activeSection={activeSection}
        indexedCount={TOTAL_INDEXED_GAMES}
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
            totalGames={TOTAL_INDEXED_GAMES}
            onExport={handleExport}
            onToggleMenu={() => setMobileMenuOpen((open) => !open)}
          />

          <FilterBar
            genresList={GENRE_OPTIONS}
            selectedGenre={selectedGenre}
            yearRange={yearRange}
            minYear={MIN_YEAR}
            maxYear={MAX_YEAR}
            onGenreChange={handleGenreChange}
            onYearChange={handleYearChange}
            onReset={handleResetFilters}
          />

          <ChartsSection
            kpiItems={kpiItems}
            lineData={lineData}
            scatterData={scatterData}
            genreData={genreData}
            yearRange={yearRange}
            selectedGenre={selectedGenre}
            onSelectGenre={handleGenreChange}
          />

          <Box id="section-library" sx={{ scrollMarginTop: 24 }}>
            <GamesTable
              games={visibleGames}
              totalVisibleText={`${tableFilteredGames.length} de 125k visibles`}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </Box>
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
              El panel analiza el conjunto de datos <strong>Steam Games Dataset</strong>{' '}
              (Kaggle / Fronkon Games), consolidado en 125.855 videojuegos publicados.
            </Typography>
            <Divider />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Variables temporales
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Release date</strong> (formato ISO <code>YYYY-MM-DD</code>):
                permite agrupar lanzamientos anuales entre 1997 y 2026.
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
              <Chip label="Muestra local validada" size="small" />
            </Stack>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="body2" color="text.secondary">
                Registros indexados
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {TOTAL_INDEXED_GAMES.toLocaleString('es-ES')}
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
                {yearRange.start} – {yearRange.end}
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
