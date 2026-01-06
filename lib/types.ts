// Generic transaction interface for any financial CSV
export interface Transaction {
  date: string;           // Required: any date format
  description: string;    // Required: payee/merchant/description
  amount: number;         // Required: spending amount (positive)
  category?: string;      // Optional: for category mode
  account?: string;       // Optional: account name
  memo?: string;          // Optional: notes
}

// Legacy YNAB-specific transaction interface (kept for backward compatibility)
export interface YNABTransaction {
  account: string;
  flag: string;
  date: string;
  payee: string;
  categoryGroup: string;
  category: string;
  memo: string;
  outflow: number;
  inflow: number;
  cleared: string;
}

export interface SpendingCategory {
  name: string;
  amount: number;
  transactionCount: number;
}

export interface GameState {
  mode: 'retailer' | 'category';
  categories: SpendingCategory[];
  currentIndex: number;
  guesses: Record<string, number>;
  revealed: Record<string, boolean>;
}

export interface GameResult {
  categoryName: string;
  guess: number;
  actual: number;
  difference: number;
  percentOff: number;
}

