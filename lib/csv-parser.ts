import Papa from 'papaparse';
import { YNABTransaction } from './types';

export interface ParseResult {
  success: boolean;
  transactions: YNABTransaction[];
  error?: string;
}

/**
 * Parse a YNAB CSV file and return structured transactions
 */
export function parseYNABCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const transactions = processTransactions(results.data);
          resolve({
            success: true,
            transactions,
          });
        } catch (error) {
          resolve({
            success: false,
            transactions: [],
            error: error instanceof Error ? error.message : 'Unknown error parsing CSV',
          });
        }
      },
      error: (error) => {
        resolve({
          success: false,
          transactions: [],
          error: error.message,
        });
      },
    });
  });
}

/**
 * Process raw CSV data into typed transactions
 */
function processTransactions(data: any[]): YNABTransaction[] {
  return data
    .map((row) => {
      // Skip if this is a transfer (payee starts with "Transfer :")
      if (row.Payee && row.Payee.startsWith('Transfer :')) {
        return null;
      }

      const outflow = parseAmount(row.Outflow);
      const inflow = parseAmount(row.Inflow);

      // Only include transactions with outflows (actual spending)
      if (outflow <= 0) {
        return null;
      }

      return {
        account: row.Account || '',
        flag: row.Flag || '',
        date: row.Date || '',
        payee: row.Payee || '',
        categoryGroup: row['Category Group'] || '',
        category: row.Category || '',
        memo: row.Memo || '',
        outflow,
        inflow,
        cleared: row.Cleared || '',
      };
    })
    .filter((transaction): transaction is YNABTransaction => transaction !== null);
}

/**
 * Parse a currency string like "$1,234.56" into a number
 */
function parseAmount(value: string | number): number {
  if (typeof value === 'number') {
    return value;
  }
  
  if (!value || value === '') {
    return 0;
  }

  // Remove $ and commas, then parse
  const cleaned = value.replace(/[$,]/g, '');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
}

