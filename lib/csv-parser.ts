import Papa from 'papaparse';
import { Transaction } from './types';

export interface ParseResult {
  success: boolean;
  transactions: Transaction[];
  error?: string;
}

interface ColumnMapping {
  date?: string;
  description?: string;
  amount?: string;
  outflow?: string;
  inflow?: string;
  category?: string;
  account?: string;
  memo?: string;
}

/**
 * Parse a transaction CSV file (supports YNAB, Mint, bank exports, etc.)
 */
export function parseTransactionCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (!results.data || results.data.length === 0) {
            resolve({
              success: false,
              transactions: [],
              error: 'CSV file is empty',
            });
            return;
          }

          // Detect column mapping from headers
          const headers = results.meta.fields || [];
          const mapping = detectColumnMapping(headers);

          // Validate required columns
          if (!mapping.date) {
            resolve({
              success: false,
              transactions: [],
              error: 'Could not find a date column (expected: Date, date, Transaction Date, Posted Date, Posting Date)',
            });
            return;
          }

          if (!mapping.description) {
            resolve({
              success: false,
              transactions: [],
              error: 'Could not find a description column (expected: Payee, Description, Merchant, Name, payee, description, merchant, name)',
            });
            return;
          }

          if (!mapping.amount && !mapping.outflow) {
            resolve({
              success: false,
              transactions: [],
              error: 'Could not find an amount column (expected: Amount, Outflow, Debit, amount, outflow, debit)',
            });
            return;
          }

          // Transform rows using detected mapping
          const transactions = processTransactions(results.data, mapping);
          
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
 * Detect which columns map to our standard fields
 */
function detectColumnMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {};

  // Normalize headers for case-insensitive matching
  const headerMap = new Map(
    headers.map((h) => [h.toLowerCase().trim(), h])
  );

  // Date variations
  const dateFields = ['date', 'transaction date', 'posted date', 'posting date', 'trans date'];
  for (const field of dateFields) {
    if (headerMap.has(field)) {
      mapping.date = headerMap.get(field);
      break;
    }
  }

  // Description variations
  const descriptionFields = ['payee', 'description', 'merchant', 'name', 'memo description'];
  for (const field of descriptionFields) {
    if (headerMap.has(field)) {
      mapping.description = headerMap.get(field);
      break;
    }
  }

  // Amount variations
  const amountFields = ['amount', 'debit', 'withdrawal'];
  for (const field of amountFields) {
    if (headerMap.has(field)) {
      mapping.amount = headerMap.get(field);
      break;
    }
  }

  // YNAB-style separate outflow/inflow columns
  const outflowFields = ['outflow'];
  for (const field of outflowFields) {
    if (headerMap.has(field)) {
      mapping.outflow = headerMap.get(field);
      break;
    }
  }

  const inflowFields = ['inflow', 'credit', 'deposit'];
  for (const field of inflowFields) {
    if (headerMap.has(field)) {
      mapping.inflow = headerMap.get(field);
      break;
    }
  }

  // Category (optional)
  const categoryFields = ['category', 'categories'];
  for (const field of categoryFields) {
    if (headerMap.has(field)) {
      mapping.category = headerMap.get(field);
      break;
    }
  }

  // Account (optional)
  const accountFields = ['account', 'account name'];
  for (const field of accountFields) {
    if (headerMap.has(field)) {
      mapping.account = headerMap.get(field);
      break;
    }
  }

  // Memo (optional)
  const memoFields = ['memo', 'notes', 'note'];
  for (const field of memoFields) {
    if (headerMap.has(field)) {
      mapping.memo = headerMap.get(field);
      break;
    }
  }

  return mapping;
}

/**
 * Process raw CSV data into typed transactions
 */
function processTransactions(data: any[], mapping: ColumnMapping): Transaction[] {
  return data
    .map((row) => transformRow(row, mapping))
    .filter((transaction): transaction is Transaction => transaction !== null);
}

/**
 * Transform a single row into a Transaction
 */
function transformRow(row: any, mapping: ColumnMapping): Transaction | null {
  // Get description field
  const description = mapping.description ? String(row[mapping.description] || '').trim() : '';
  
  if (!description) {
    return null;
  }

  // Skip transfers
  if (description.toLowerCase().includes('transfer')) {
    return null;
  }

  // Get date
  const date = mapping.date ? String(row[mapping.date] || '').trim() : '';
  if (!date) {
    return null;
  }

  // Get amount - handle both single amount column and separate inflow/outflow
  let amount = 0;
  
  if (mapping.outflow && mapping.inflow) {
    // YNAB-style: separate outflow and inflow columns
    const outflow = parseAmount(row[mapping.outflow]);
    const inflow = parseAmount(row[mapping.inflow]);
    
    // Only include outflows (spending)
    if (outflow > 0) {
      amount = outflow;
    } else {
      return null;
    }
  } else if (mapping.amount) {
    // Single amount column
    const rawAmount = parseAmount(row[mapping.amount]);
    
    // Convert negative amounts to positive (some formats use negative for debits)
    amount = Math.abs(rawAmount);
    
    // Skip zero or invalid amounts
    if (amount <= 0) {
      return null;
    }
  } else {
    return null;
  }

  // Build transaction object
  const transaction: Transaction = {
    date,
    description,
    amount,
  };

  // Add optional fields if available
  if (mapping.category) {
    const category = String(row[mapping.category] || '').trim();
    if (category) {
      transaction.category = category;
    }
  }

  if (mapping.account) {
    const account = String(row[mapping.account] || '').trim();
    if (account) {
      transaction.account = account;
    }
  }

  if (mapping.memo) {
    const memo = String(row[mapping.memo] || '').trim();
    if (memo) {
      transaction.memo = memo;
    }
  }

  return transaction;
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

  // Remove $, commas, and other currency symbols, then parse
  const cleaned = String(value).replace(/[$,€£¥]/g, '').trim();
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
}

// Legacy export for backward compatibility
export const parseYNABCSV = parseTransactionCSV;

