import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number as currency with cents
 */
export function formatCurrencyDetailed(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate the percentage difference between two numbers
 */
export function calculatePercentageDifference(guess: number, actual: number): number {
  if (actual === 0) return guess === 0 ? 0 : 100;
  return Math.abs((guess - actual) / actual) * 100;
}

/**
 * Get accuracy rating based on percentage difference
 */
export function getAccuracyRating(percentOff: number): {
  rating: string;
  color: string;
  description: string;
} {
  if (percentOff <= 5) {
    return {
      rating: 'Excellent',
      color: 'text-green-600',
      description: '🎯 Spot on!',
    };
  } else if (percentOff <= 15) {
    return {
      rating: 'Good',
      color: 'text-green-500',
      description: '👍 Pretty close!',
    };
  } else if (percentOff <= 30) {
    return {
      rating: 'Fair',
      color: 'text-yellow-500',
      description: '🤔 Not bad',
    };
  } else if (percentOff <= 50) {
    return {
      rating: 'Poor',
      color: 'text-orange-500',
      description: '😬 Way off',
    };
  } else {
    return {
      rating: 'Very Poor',
      color: 'text-red-500',
      description: '🤯 Wildly off',
    };
  }
}

/**
 * Calculate overall accuracy score (0-100)
 */
export function calculateOverallScore(results: Array<{ percentOff: number }>): number {
  if (results.length === 0) return 0;
  
  const avgPercentOff = results.reduce((sum, r) => sum + r.percentOff, 0) / results.length;
  
  // Convert to a 0-100 score (lower percent off = higher score)
  // 0% off = 100 score, 100% off = 0 score
  return Math.max(0, Math.min(100, 100 - avgPercentOff));
}

// Date Range Types
export type DateRangePreset = 'last-month' | 'last-3-months' | 'last-6-months' | 'last-12-months' | 'all-time' | 'custom';

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Get date range from a preset option
 */
export function getDateRangeFromPreset(preset: DateRangePreset): DateRange {
  const now = new Date();
  const end = now;

  switch (preset) {
    case 'last-month': {
      const start = new Date(now);
      start.setMonth(start.getMonth() - 1);
      return { start, end };
    }
    case 'last-3-months': {
      const start = new Date(now);
      start.setMonth(start.getMonth() - 3);
      return { start, end };
    }
    case 'last-6-months': {
      const start = new Date(now);
      start.setMonth(start.getMonth() - 6);
      return { start, end };
    }
    case 'last-12-months': {
      const start = new Date(now);
      start.setMonth(start.getMonth() - 12);
      return { start, end };
    }
    case 'all-time': {
      // Return a very wide range
      return {
        start: new Date(2000, 0, 1),
        end: new Date(2099, 11, 31),
      };
    }
    default:
      // Default to last 12 months
      const start = new Date(now);
      start.setMonth(start.getMonth() - 12);
      return { start, end };
  }
}

/**
 * Get date range for a specific year (and optional month)
 */
export function getCustomDateRange(year: number, month?: number): DateRange {
  if (month !== undefined) {
    // Specific month
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0); // Last day of month
    return { start, end };
  } else {
    // Entire year
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    return { start, end };
  }
}

/**
 * Filter transactions by date range
 */
export function filterTransactionsByDate<T extends { date: string }>(
  transactions: T[],
  dateRange: DateRange | null
): T[] {
  if (!dateRange) {
    return transactions;
  }

  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= dateRange.start && transactionDate <= dateRange.end;
  });
}

/**
 * Get available years from transactions
 */
export function getAvailableYears<T extends { date: string }>(transactions: T[]): number[] {
  const years = new Set<number>();
  
  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    if (!isNaN(date.getTime())) {
      years.add(date.getFullYear());
    }
  });

  return Array.from(years).sort((a, b) => b - a); // Descending order
}

/**
 * Format a date range for display
 */
export function formatDateRange(dateRange: DateRange): string {
  const formatOptions: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    year: 'numeric' 
  };

  const startStr = dateRange.start.toLocaleDateString('en-US', formatOptions);
  const endStr = dateRange.end.toLocaleDateString('en-US', formatOptions);

  return `${startStr} - ${endStr}`;
}

/**
 * Get the number of months between two dates
 */
export function getMonthsBetween(start: Date, end: Date): number {
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  return years * 12 + months;
}
