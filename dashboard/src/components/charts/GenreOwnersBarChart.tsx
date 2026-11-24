import { Box, ButtonBase, Chip, Stack, Typography } from '@mui/material';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import type { GenreOwnersBarChartProps } from '../../types/dashboard';

export function GenreOwnersBarChart({
  data,
  selectedGenre,
  onSelectGenre,
}: GenreOwnersBarChartProps) {
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
          <BarChartRoundedIcon sx={{ color: 'text.secondary', fontSize: 28 }} />
          <Typography variant="subtitle2" color="text.primary">
            Sin datos de propietarios por género
          </Typography>
          <Typography variant="caption" color="text.secondary">
            No se encontraron registros disponibles para el período seleccionado.
          </Typography>
        </Stack>
      </Box>
    );
  }

  const maxOwnersK = Math.max(...data.map((item) => item.ownersK), 1);
  const hasActiveFilter = selectedGenre !== 'Todos';
  const activeItem = data.find((item) => item.key === selectedGenre);

  return (
    <Stack
      spacing={2}
      sx={{
        flexGrow: 1,
        justifyContent: 'space-between',
        width: '100%',
        pt: 0.5,
      }}
    >
      <Stack spacing={1} role="group" aria-label="Ranking de propietarios por género">
        {data.map((item) => {
          const isSelected = selectedGenre === item.key;
          const isDimmed = hasActiveFilter && !isSelected;
          const widthPercent = Math.max(6, (item.ownersK / maxOwnersK) * 100);

          return (
            <ButtonBase
              key={item.key}
              type="button"
              aria-pressed={isSelected}
              onClick={() =>
                onSelectGenre(isSelected ? 'Todos' : item.key)
              }
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1.25, sm: 2 },
                px: 1.25,
                py: 0.85,
                borderRadius: 2,
                textAlign: 'left',
                border: '1px solid',
                borderColor: isSelected
                  ? 'rgba(234, 88, 12, 0.35)'
                  : 'transparent',
                bgcolor: isSelected
                  ? 'rgba(234, 88, 12, 0.07)'
                  : 'transparent',
                opacity: isDimmed ? 0.5 : 1,
                transition:
                  'background-color 160ms ease, border-color 160ms ease, opacity 160ms ease',
                '&:hover': {
                  bgcolor: isSelected
                    ? 'rgba(234, 88, 12, 0.11)'
                    : '#F9FAFB',
                  opacity: 1,
                },
                '&.Mui-focusVisible': {
                  outline: '2px solid #EA580C',
                  outlineOffset: 1,
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  width: { xs: 76, sm: 88 },
                  flexShrink: 0,
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? 'primary.dark' : 'text.primary',
                }}
              >
                {item.label}
              </Typography>

              <Box
                sx={{
                  flexGrow: 1,
                  height: 8,
                  borderRadius: 99,
                  bgcolor: '#EEF0F3',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${widthPercent}%`,
                    height: '100%',
                    borderRadius: 99,
                    background: isSelected
                      ? 'linear-gradient(90deg, #EA580C 0%, #C2410C 100%)'
                      : 'linear-gradient(90deg, #EA580C 0%, #18181B 100%)',
                    transition: 'width 260ms ease',
                  }}
                />
              </Box>

              <Typography
                variant="body2"
                sx={{
                  width: 38,
                  flexShrink: 0,
                  textAlign: 'right',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  color: isSelected ? 'primary.dark' : 'text.primary',
                }}
              >
                {item.ownersK}k
              </Typography>
            </ButtonBase>
          );
        })}
      </Stack>

      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pl: { xs: '92px', sm: '114px' },
            pr: '54px',
            pt: 1.25,
            borderTop: '1px solid #F1F3F5',
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
            0
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
            Volumen
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
            {maxOwnersK}k
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1.25,
            minHeight: 24,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontSize: '0.72rem' }}
          >
            {hasActiveFilter
              ? `Filtrando por ${activeItem?.label ?? selectedGenre}`
              : 'Haz clic en una barra para filtrar por género'}
          </Typography>

          {hasActiveFilter && (
            <Chip
              label="Ver todos"
              size="small"
              color="primary"
              variant="outlined"
              onClick={() => onSelectGenre('Todos')}
              onDelete={() => onSelectGenre('Todos')}
              deleteIcon={<CloseRoundedIcon sx={{ fontSize: 14 }} />}
              sx={{ height: 22, fontSize: '0.7rem' }}
            />
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
