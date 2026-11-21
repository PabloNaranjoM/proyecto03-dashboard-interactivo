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
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import {
  GENRE_LABELS,
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
  exportGamesToCsv,
  filterSteamGames,
} from '../../utils/dashboardMetrics';
import { FilterBar } from '../filters/FilterBar';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function DashboardLayout() {
  const [selectedGenre, setSelectedGenre] = useState<GenreFilter>('Todos');
  const [yearRange, setYearRange] = useState<YearRange>({
    start: MIN_YEAR,
    end: MAX_YEAR,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSectionId>('dashboard');
  const [activeModal, setActiveModal] = useState<SystemModalId>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const filteredGames = useMemo(
    () => filterSteamGames(MOCK_STEAM_GAMES, selectedGenre, yearRange, ''),
    [selectedGenre, yearRange],
  );

  const handleSelectSection = (section: NavSectionId) => {
    setActiveSection(section);
    const targetId = `section-${section}`;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleResetFilters = () => {
    setSelectedGenre('Todos');
    setYearRange({ start: MIN_YEAR, end: MAX_YEAR });
  };

  const handleExport = () => {
    exportGamesToCsv(filteredGames);
    setExportNotice(
      `Informe CSV generado con ${filteredGames.length} juegos filtrados.`,
    );
  };

  const activeGenreLabel =
    selectedGenre === 'Todos'
      ? 'Todos los géneros'
      : (GENRE_LABELS[selectedGenre] ?? selectedGenre);

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
            onGenreChange={setSelectedGenre}
            onYearChange={setYearRange}
            onReset={handleResetFilters}
          />

          <Card id="section-trends">
            <CardContent sx={{ p: 2.5 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                }}
              >
                <Box>
                  <Typography variant="overline">CONTEXTO DE CONSULTA ACTIVO</Typography>
                  <Typography variant="h6">
                    {activeGenreLabel} · {yearRange.start}–{yearRange.end}
                  </Typography>
                </Box>
                <Chip
                  id="section-library"
                  label={`${filteredGames.length} de ${MOCK_STEAM_GAMES.length} juegos en muestra`}
                  size="small"
                  sx={{ bgcolor: '#F3F4F6', color: 'text.primary' }}
                />
              </Stack>
            </CardContent>
          </Card>
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
