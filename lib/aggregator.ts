import { YNABTransaction, SpendingCategory } from './types';
import { DateRange, filterTransactionsByDate } from './utils';

export interface AggregationOptions {
  mode: 'retailer' | 'category';
  topN?: number; // How many top categories to return
  minAmount?: number; // Minimum amount to include
  dateRange?: DateRange | null; // Optional date range filter
  excludeNames?: string[]; // Categories/retailers to exclude (already guessed)
}

/**
 * Aggregate transactions by retailer or category
 */
export function aggregateTransactions(
  transactions: YNABTransaction[],
  options: AggregationOptions
): SpendingCategory[] {
  const { mode, topN = 10, minAmount = 0, dateRange, excludeNames = [] } = options;

  // Filter transactions by date range if provided
  const filteredTransactions = dateRange 
    ? filterTransactionsByDate(transactions, dateRange)
    : transactions;

  // Group transactions
  const grouped = new Map<string, { total: number; count: number }>();

  filteredTransactions.forEach((transaction) => {
    const key = mode === 'retailer' ? transaction.payee : transaction.category;

    // Skip empty categories (for category mode)
    if (!key || key.trim() === '') {
      return;
    }

    // Skip excluded names (already guessed)
    if (excludeNames.includes(key)) {
      return;
    }

    const existing = grouped.get(key) || { total: 0, count: 0 };
    grouped.set(key, {
      total: existing.total + transaction.outflow,
      count: existing.count + 1,
    });
  });

  // Convert to array and filter by minimum amount
  const categories: SpendingCategory[] = Array.from(grouped.entries())
    .map(([name, data]) => ({
      name,
      amount: data.total,
      transactionCount: data.count,
    }))
    .filter((cat) => cat.amount >= minAmount);

  // Sort by amount (descending) and take top N
  categories.sort((a, b) => b.amount - a.amount);

  return categories.slice(0, topN);
}

/**
 * Get total spending from transactions
 */
export function getTotalSpending(transactions: YNABTransaction[]): number {
  return transactions.reduce((sum, transaction) => sum + transaction.outflow, 0);
}

/**
 * Get date range from transactions
 */
export function getDateRange(transactions: YNABTransaction[]): {
  start: string;
  end: string;
} {
  if (transactions.length === 0) {
    return { start: '', end: '' };
  }

  const dates = transactions.map((t) => new Date(t.date)).filter((d) => !isNaN(d.getTime()));

  if (dates.length === 0) {
    return { start: '', end: '' };
  }

  const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
  
  return {
    start: sortedDates[0].toLocaleDateString(),
    end: sortedDates[sortedDates.length - 1].toLocaleDateString(),
  };
}

