import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import type { ReactNode } from 'react';
import type { NavSectionId, SidebarProps } from '../../types/dashboard';

export const SIDEBAR_WIDTH = 244;

interface NavItemConfig {
  id: NavSectionId;
  label: string;
  icon: ReactNode;
}

const MAIN_NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'dashboard',
    label: 'Centro de mando',
    icon: <DashboardOutlinedIcon fontSize="small" />,
  },
  {
    id: 'trends',
    label: 'Tendencias',
    icon: <BarChartRoundedIcon fontSize="small" />,
  },
  {
    id: 'library',
    label: 'Biblioteca',
    icon: <SportsEsportsOutlinedIcon fontSize="small" />,
  },
];

export function Sidebar({
  activeSection,
  indexedCount,
  isOpen,
  onClose,
  onSelectSection,
  onOpenModal,
}: SidebarProps) {
  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FFFFFF',
        px: 2,
        py: 2.5,
      }}
    >
      {/* Marca Steam Nexus */}
      <Stack
        direction="row"
        spacing={1.25}
        sx={{ alignItems: 'center', px: 1, pb: 3 }}
      >
        <Box
          aria-hidden="true"
          sx={{
            width: 30,
            height: 30,
            borderRadius: 2,
            bgcolor: '#F4F5F7',
            border: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.45,
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: '#18181B',
            }}
          />
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: '#EA580C',
            }}
          />
        </Box>
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 800,
              letterSpacing: '0.14em',
              lineHeight: 1.1,
              color: 'text.primary',
            }}
          >
            STEAM
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              fontSize: '0.62rem',
              letterSpacing: '0.24em',
              color: 'text.secondary',
              lineHeight: 1.2,
            }}
          >
            NEXUS
          </Typography>
        </Box>
      </Stack>

      {/* Navegación principal */}
      <List
        component="nav"
        aria-label="Navegación principal"
        disablePadding
        sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}
      >
        {MAIN_NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <ListItemButton
              key={item.id}
              selected={isActive}
              onClick={() => {
                onSelectSection(item.id);
                onClose();
              }}
              sx={{
                borderRadius: 2.5,
                py: 1,
                px: 1.5,
                border: '1px solid',
                borderColor: isActive ? '#18181B' : 'transparent',
                color: isActive ? 'text.primary' : 'text.secondary',
                '&.Mui-selected': {
                  bgcolor: '#F8F9FA',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: '#F3F4F6',
                  },
                },
                '&:hover': {
                  bgcolor: '#F9FAFB',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 34,
                  color: isActive ? 'text.primary' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    variant: 'body2',
                    sx: { fontWeight: isActive ? 600 : 500 },
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Bloque inferior: Sistema y estado de sincronización */}
      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography
          variant="overline"
          sx={{ px: 1.5, display: 'block', mb: 0.75 }}
        >
          SISTEMA
        </Typography>

        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, mb: 2 }}>
          <ListItemButton
            onClick={() => {
              onOpenModal('settings');
              onClose();
            }}
            sx={{ borderRadius: 2, py: 0.85, px: 1.5, color: 'text.secondary' }}
          >
            <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>
              <SettingsOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Configuración"
              slotProps={{ primary: { variant: 'body2', sx: { fontWeight: 500 } } }}
            />
          </ListItemButton>

          <ListItemButton
            onClick={() => {
              onOpenModal('guide');
              onClose();
            }}
            sx={{ borderRadius: 2, py: 0.85, px: 1.5, color: 'text.secondary' }}
          >
            <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>
              <HelpOutlineRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Guía de datos"
              slotProps={{ primary: { variant: 'body2', sx: { fontWeight: 500 } } }}
            />
          </ListItemButton>
        </List>

        <Box
          sx={{
            p: 1.5,
            borderRadius: 2.5,
            bgcolor: '#F8F9FB',
            border: '1px solid #E6E8EC',
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'success.main',
                flexShrink: 0,
              }}
            />
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}
            >
              Núcleo sincronizado
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: 'text.secondary',
              pl: 2,
              mt: 0.35,
              fontSize: '0.7rem',
            }}
          >
            {indexedCount.toLocaleString('es-ES')} juegos indexados
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      component="aside"
      sx={{
        width: { md: SIDEBAR_WIDTH },
        flexShrink: { md: 0 },
      }}
    >
      {/* Cajón temporal para móvil */}
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            borderRight: '1px solid #E6E8EC',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Barra lateral fija en escritorio */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            borderRight: '1px solid #E6E8EC',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
