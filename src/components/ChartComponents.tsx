'use client';

import React, { memo, ReactNode } from 'react';
import { Box, useTheme, SxProps, Theme } from '@mui/material';
import {
  BarChart,
  LineChart,
  PieChart,
  BarChartProps,
  LineChartProps,
  PieChartProps
} from '@mui/x-charts';

// Types
interface ChartContainerProps {
  children: ReactNode;
  height?: string | number;
  sx?: SxProps<Theme>;
}

interface ChartProps {
  colors?: string[];
}

// Memoized chart container with consistent styling
export const MemoizedChartContainer = memo<ChartContainerProps>(
  ({ children, height = '100%', sx = {} }) => {
    const theme = useTheme();

    return (
      <Box
        sx={{
          width: '100%',
          height,
          minHeight: '300px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0px',
          '& .MuiChartsAxis-root': {
            '& .MuiChartsAxis-tick': {
              fontSize: '0.6875rem',
              fill: theme.palette.text.secondary
            },
            '& .MuiChartsAxis-label': {
              fontSize: '0.75rem',
              fontWeight: 500,
              fill: theme.palette.text.primary
            }
          },
          '& .MuiChartsLegend-root': {
            '& .MuiChartsLegend-label': {
              fontSize: '0.75rem',
              fill: theme.palette.text.primary
            }
          },
          '& > div': {
            width: '100% !important',
            height: '100% !important'
          },
          '& svg': {
            width: '100%',
            height: '100%'
          },
          ...sx
        }}
      >
        {children}
      </Box>
    );
  }
);

// Memoized chart components with default styling
export const MemoizedBarChart = memo<ChartProps & BarChartProps>(
  ({ colors, ...props }: ChartProps & BarChartProps & { colors?: string[] }) => {
    const theme = useTheme();
    return (
      <BarChart
        colors={colors || theme.palette.chart}
        margin={{ top: 20, bottom: 60, left: 80, right: 20 }}
        {...props}
      />
    );
  }
);

export const MemoizedLineChart = memo<ChartProps & LineChartProps>(
  ({ colors, ...props }: ChartProps & LineChartProps & { colors?: string[] }) => {
    const theme = useTheme();
    return (
      <LineChart
        colors={colors || theme.palette.chart}
        margin={{ top: 20, bottom: 60, left: 80, right: 20 }}
        {...props}
      />
    );
  }
);

export const MemoizedPieChart = memo<ChartProps & PieChartProps>(
  ({ colors, ...props }: ChartProps & PieChartProps & { colors?: string[] }) => {
    const theme = useTheme();
    return (
      <PieChart
        colors={colors || theme.palette.chart}
        margin={{ top: 20, bottom: 60, left: 20, right: 20 }}
        {...props}
      />
    );
  }
);

MemoizedChartContainer.displayName = 'MemoizedChartContainer';
MemoizedBarChart.displayName = 'MemoizedBarChart';
MemoizedLineChart.displayName = 'MemoizedLineChart';
MemoizedPieChart.displayName = 'MemoizedPieChart';
