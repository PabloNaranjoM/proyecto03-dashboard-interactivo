import { CssBaseline, ThemeProvider } from '@mui/material';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { steamNexusTheme } from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={steamNexusTheme}>
      <CssBaseline />
      <DashboardLayout />
    </ThemeProvider>
  );
}

export default App;
