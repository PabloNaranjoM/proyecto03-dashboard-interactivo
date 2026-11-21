import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  MenuItem,
  Select,
  Slider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { useState } from 'react';
import type { FilterBarProps, GenreFilter } from '../../types/dashboard';

export function FilterBar({
  genresList,
  selectedGenre,
  yearRange,
  minYear,
  maxYear,
  onGenreChange,
  onYearChange,
  onReset,
}: FilterBarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const hasActiveFilters =
    selectedGenre !== 'Todos' ||
    yearRange.start !== minYear ||
    yearRange.end !== maxYear;

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    onGenreChange(event.target.value as GenreFilter);
  };

  const handleSliderChange = (_event: Event, value: number | number[]) => {
    if (!Array.isArray(value) || value.length !== 2) {
      return;
    }
    const [rawStart, rawEnd] = value;
    const start = Math.min(rawStart, rawEnd - 1);
    const end = Math.max(rawEnd, start + 1);
    onYearChange({ start, end });
  };

  const controls = (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 2, md: 3 }}
      sx={{
        alignItems: { xs: 'stretch', md: 'flex-end' },
        width: '100%',
      }}
    >
      {/* Filtro 1: Género */}
      <Box sx={{ width: { xs: '100%', md: 240 }, flexShrink: 0 }}>
        <Typography
          component="label"
          htmlFor="steam-genre-select"
          variant="caption"
          sx={{
            display: 'block',
            color: 'text.secondary',
            fontWeight: 500,
            mb: 0.75,
          }}
        >
          Género
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            id="steam-genre-select"
            value={selectedGenre}
            onChange={handleSelectChange}
            inputProps={{ 'aria-label': 'Filtrar por género' }}
            sx={{ fontSize: '0.86rem', fontWeight: 500 }}
          >
            {genresList.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Filtro 2: Rango de año de lanzamiento */}
      <Box sx={{ flex: 1, minWidth: 0, px: { xs: 0.5, md: 1 } }}>
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}
        >
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 500 }}
          >
            Año de lanzamiento
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.78rem' }}
          >
            {yearRange.start}{' '}
            <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              a
            </Box>{' '}
            {yearRange.end}
          </Typography>
        </Stack>
        <Slider
          value={[yearRange.start, yearRange.end]}
          onChange={handleSliderChange}
          min={minYear}
          max={maxYear}
          disableSwap
          valueLabelDisplay="auto"
          getAriaLabel={() => 'Rango de años de lanzamiento'}
          sx={{ my: 0.5 }}
        />
      </Box>

      {/* Acción: Restablecer filtros */}
      <Button
        variant="outlined"
        startIcon={<RefreshRoundedIcon fontSize="small" />}
        onClick={onReset}
        sx={{
          flexShrink: 0,
          px: 2,
          height: 40,
          fontSize: '0.84rem',
          alignSelf: { xs: 'stretch', md: 'flex-end' },
        }}
      >
        Restablecer
      </Button>
    </Stack>
  );

  if (isMobile) {
    return (
      <Accordion
        expanded={mobileExpanded}
        onChange={(_event, expanded) => setMobileExpanded(expanded)}
        disableGutters
        elevation={0}
        sx={{
          border: '1px solid #E6E8EC',
          borderRadius: '14px !important',
          boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04)',
          '&::before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreRoundedIcon />}
          aria-controls="global-filters-content"
          id="global-filters-header"
          sx={{ px: 2, py: 0.25 }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Filtros globales
            </Typography>
            {hasActiveFilters && (
              <Chip
                label="Activos"
                size="small"
                color="primary"
                variant="outlined"
                sx={{ height: 20, fontSize: '0.68rem' }}
              />
            )}
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 2, pb: 2, pt: 0.5 }}>{controls}</AccordionDetails>
      </Accordion>
    );
  }

  return (
    <Card>
      <CardContent sx={{ px: 2.5, py: 2, '&:last-child': { pb: 2 } }}>
        {controls}
      </CardContent>
    </Card>
  );
}
