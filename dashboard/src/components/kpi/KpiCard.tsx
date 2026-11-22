import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import type { KpiCardProps, KpiVariant } from '../../types/dashboard';

const VARIANT_STYLES: Record<
  KpiVariant,
  {
    chipBg: string;
    chipColor: string;
    barColor: string;
    showLiveDot?: boolean;
  }
> = {
  positive: {
    chipBg: '#F3F4F6',
    chipColor: '#374151',
    barColor: '#86EFAC',
  },
  neutral: {
    chipBg: '#F3F4F6',
    chipColor: '#374151',
    barColor: '#6B7280',
  },
  live: {
    chipBg: '#DCFCE7',
    chipColor: '#15803D',
    barColor: '#FDBA74',
    showLiveDot: true,
  },
};

export function KpiCard({
  label,
  value,
  badgeText,
  variant,
  trendBars,
  helperText,
}: KpiCardProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <Card sx={{ flex: 1 }}>
      <CardContent
        sx={{
          px: 2.25,
          py: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          '&:last-child': { pb: 2 },
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.25 }}
        >
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.82rem' }}
          >
            {label}
          </Typography>

          <Chip
            size="small"
            label={
              styles.showLiveDot ? (
                <Stack direction="row" spacing={0.65} sx={{ alignItems: 'center' }}>
                  <Box
                    component="span"
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      display: 'inline-block',
                    }}
                  />
                  <span>{badgeText}</span>
                </Stack>
              ) : (
                badgeText
              )
            }
            sx={{
              bgcolor: styles.chipBg,
              color: styles.chipColor,
              fontSize: '0.68rem',
              height: 22,
            }}
          />
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="p"
              sx={{
                fontSize: { xs: '1.6rem', sm: '1.8rem' },
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: 'text.primary',
              }}
            >
              {value}
            </Typography>
            {helperText && (
              <Typography
                variant="caption"
                sx={{ display: 'block', color: 'text.secondary', mt: 0.5 }}
              >
                {helperText}
              </Typography>
            )}
          </Box>

          <Stack
            direction="row"
            spacing={0.45}
            aria-hidden="true"
            sx={{
              alignItems: 'flex-end',
              height: 28,
              flexShrink: 0,
            }}
          >
            {trendBars.map((barHeight, index) => (
              <Box
                key={`${label}-bar-${index}`}
                sx={{
                  width: 4,
                  height: `${barHeight}%`,
                  borderRadius: 99,
                  bgcolor: styles.barColor,
                  transition: 'height 200ms ease',
                }}
              />
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
