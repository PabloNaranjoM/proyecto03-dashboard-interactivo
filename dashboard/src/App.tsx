import { Box, Card, CardContent, Chip, CssBaseline, Stack, ThemeProvider, Typography } from '@mui/material';
import { steamNexusTheme } from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={steamNexusTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Card sx={{ maxWidth: 520, width: '100%' }}>
          <CardContent sx={{ p: 3.5 }}>
            <Stack spacing={1.5}>
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Typography variant="overline">INTELIGENCIA DE MERCADO // EN VIVO</Typography>
                <Chip
                  label="Steam Nexus"
                  size="small"
                  sx={{ bgcolor: 'success.light', color: 'success.dark' }}
                />
              </Stack>
              <Typography variant="h4">Centro de mando de Steam</Typography>
              <Typography variant="body2" color="text.secondary">
                Configuración inicial de la aplicación web interactiva para el análisis del
                catálogo Steam Games Dataset.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default App;
