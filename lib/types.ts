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

