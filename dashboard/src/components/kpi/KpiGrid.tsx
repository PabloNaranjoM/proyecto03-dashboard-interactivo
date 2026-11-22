import { Stack } from '@mui/material';
import type { KpiGridProps } from '../../types/dashboard';
import { KpiCard } from './KpiCard';

export function KpiGrid({ items }: KpiGridProps) {
  return (
    <Stack
      component="section"
      aria-label="Indicadores clave"
      spacing={2}
      sx={{ height: '100%' }}
    >
      {items.map((item) => (
        <KpiCard
          key={item.id}
          label={item.label}
          value={item.value}
          badgeText={item.badgeText}
          variant={item.variant}
          trendBars={item.trendBars}
          helperText={item.helperText}
        />
      ))}
    </Stack>
  );
}
