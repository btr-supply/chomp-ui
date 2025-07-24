'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Typography,
  useTheme
} from '@mui/material';
import { ReactNode } from 'react';

interface Column<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: unknown, row: T) => ReactNode;
}

interface DataGridProps<T> {
  columns: Column<T>[];
  rows: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  stickyHeader?: boolean;
  maxHeight?: string | number;
}

export function DataGrid<T>({
  columns,
  rows,
  isLoading = false,
  emptyMessage = 'No data available',
  stickyHeader = false,
  maxHeight
}: DataGridProps<T>) {
  const theme = useTheme();

  const LoadingSkeleton = () => (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <TableRow key={index}>
          {columns.map(column => (
            <TableCell key={String(column.id)}>
              <Skeleton animation="wave" height={20} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );

  const EmptyState = () => (
    <TableRow>
      <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
        <Typography color={theme.palette.text.secondary}>{emptyMessage}</Typography>
      </TableCell>
    </TableRow>
  );

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        bgcolor: theme.palette.dark.surface,
        border: `1px solid ${theme.palette.gray[400]}`
      }}
    >
      <TableContainer sx={{ maxHeight }}>
        <Table stickyHeader={stickyHeader}>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={String(column.id)}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    bgcolor: theme.palette.dark.surface,
                    borderBottom: `1px solid ${theme.palette.gray[400]}`,
                    color: theme.palette.gray[400],
                    fontFamily: theme.typography.fontFamily,
                    textTransform: 'lowercase',
                    fontWeight: 500
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <LoadingSkeleton />
            ) : rows.length === 0 ? (
              <EmptyState />
            ) : (
              rows.map((row, index) => (
                <TableRow
                  hover
                  key={index}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': {
                      bgcolor: theme.palette.action.hover
                    }
                  }}
                >
                  {columns.map(column => {
                    const value = row[column.id as keyof T];
                    return (
                      <TableCell
                        key={String(column.id)}
                        align={column.align}
                        sx={{
                          borderBottom: `1px solid ${theme.palette.gray[700]}`,
                          color: theme.palette.gray[400]
                        }}
                      >
                        {column.format ? column.format(value, row) : String(value)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
