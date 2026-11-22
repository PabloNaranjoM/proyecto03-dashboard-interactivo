import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import type { ChartCardProps } from '../../types/dashboard';

export function ChartCard({
  category,
  title,
  unitBadge,
  footnote,
  children,
}: ChartCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2.25, sm: 2.5 },
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': { pb: { xs: 2.25, sm: 2.5 } },
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="overline" sx={{ display: 'block' }}>
              {category}
            </Typography>
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
          </Box>

          <Chip
            label={unitBadge}
            size="small"
            sx={{
              bgcolor: '#F4F5F7',
              color: 'text.secondary',
              fontSize: '0.7rem',
              flexShrink: 0,
            }}
          />
        </Stack>

        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: 220,
          }}
        >
          {children}
        </Box>

        {footnote && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              color: 'text.secondary',
              mt: 1.5,
              fontSize: '0.72rem',
            }}
          >
            {footnote}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
