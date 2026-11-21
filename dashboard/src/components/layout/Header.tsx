import { Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import type { HeaderProps } from '../../types/dashboard';

export function Header({
  subtitle,
  title,
  totalGames,
  onExport,
  onToggleMenu,
}: HeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
        <IconButton
          aria-label="Abrir navegación"
          onClick={onToggleMenu}
          sx={{
            display: { xs: 'inline-flex', md: 'none' },
            border: '1px solid #E2E5EB',
            borderRadius: 2.5,
            bgcolor: '#FFFFFF',
            color: 'text.primary',
            width: 38,
            height: 38,
            flexShrink: 0,
          }}
        >
          <MenuRoundedIcon fontSize="small" />
        </IconButton>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              fontSize: { xs: '0.62rem', sm: '0.68rem' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {subtitle}
          </Typography>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontSize: { xs: '1.15rem', sm: '1.45rem', md: '1.65rem' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexShrink: 0 }}>
        <Typography
          variant="body2"
          sx={{
            display: { xs: 'none', md: 'block' },
            color: 'text.secondary',
            fontSize: '0.82rem',
          }}
        >
          Base de datos:{' '}
          <Box component="strong" sx={{ color: 'text.primary', fontWeight: 700 }}>
            {totalGames.toLocaleString('es-ES')} juegos
          </Box>
        </Typography>

        <Button
          variant="outlined"
          size="medium"
          startIcon={<DownloadRoundedIcon fontSize="small" />}
          onClick={onExport}
          sx={{
            display: { xs: 'none', md: 'inline-flex' },
            px: 2,
            py: 0.85,
            fontSize: '0.82rem',
          }}
        >
          Exportar informe
        </Button>

        <Tooltip title="Exportar informe">
          <IconButton
            aria-label="Exportar informe"
            onClick={onExport}
            sx={{
              display: { xs: 'inline-flex', md: 'none' },
              border: '1px solid #E2E5EB',
              borderRadius: 2.5,
              bgcolor: '#FFFFFF',
              color: 'text.primary',
              width: 38,
              height: 38,
            }}
          >
            <DownloadRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}
