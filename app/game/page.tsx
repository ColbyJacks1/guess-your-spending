'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ModeSelector } from '@/components/ModeSelector';
import { DateRangeSelector } from '@/components/DateRangeSelector';
import { GuessCard } from '@/components/GuessCard';
import { RevealCard } from '@/components/RevealCard';
import { Button } from '@/components/ui/button';
import { YNABTransaction, SpendingCategory, GameResult } from '@/lib/types';
import { aggregateTransactions } from '@/lib/aggregator';
import { DateRange, DateRangePreset, filterTransactionsByDate } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

type GameStage = 'mode-selection' | 'guessing' | 'revealing';

export default function GamePage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<YNABTransaction[]>([]);
  const [mode, setMode] = useState<'retailer' | 'category'>('retailer');
  const [stage, setStage] = useState<GameStage>('mode-selection');
  const [categories, setCategories] = useState<SpendingCategory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<GameResult[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset>('last-12-months');
  const [filteredTransactionCount, setFilteredTransactionCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  // Load transactions from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('ynab-transactions');
    if (!stored) {
      router.push('/');
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setTransactions(parsed);
    } catch (error) {
      console.error('Failed to parse transactions:', error);
      router.push('/');
    }
  }, [router]);

  const handleModeSelect = (selectedMode: 'retailer' | 'category') => {
    setMode(selectedMode);
  };

  const handleDateRangeChange = (newDateRange: DateRange, preset: DateRangePreset) => {
    setDateRange(newDateRange);
    setDateRangePreset(preset);
    
    // Update filtered transaction count and total spent
    if (transactions.length > 0) {
      const filtered = filterTransactionsByDate(transactions, newDateRange);
      setFilteredTransactionCount(filtered.length);
      
      const total = filtered.reduce((sum, t) => sum + t.outflow, 0);
      setTotalSpent(total);
    }
  };

  // Update counts when transactions or date range changes
  useEffect(() => {
    if (transactions.length > 0 && dateRange) {
      const filtered = filterTransactionsByDate(transactions, dateRange);
      setFilteredTransactionCount(filtered.length);
      
      const total = filtered.reduce((sum, t) => sum + t.outflow, 0);
      setTotalSpent(total);
    }
  }, [transactions, dateRange]);

  const handleStartGame = () => {
    const aggregated = aggregateTransactions(transactions, {
      mode,
      topN: 10,
      minAmount: 50, // Only include categories with at least $50
      dateRange,
    });

    if (aggregated.length === 0) {
      // Could show an error here, but for now just prevent starting
      return;
    }

    setCategories(aggregated);
    setStage('guessing');
  };

  const handleGuess = (amount: number) => {
    const currentCategory = categories[currentIndex];
    
    const result: GameResult = {
      categoryName: currentCategory.name,
      guess: amount,
      actual: currentCategory.amount,
      difference: currentCategory.amount - amount,
      percentOff: Math.abs((amount - currentCategory.amount) / currentCategory.amount) * 100,
    };

    setResults([...results, result]);
    setStage('revealing');
  };

  const handleNext = () => {
    if (currentIndex < categories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setStage('guessing');
    } else {
      // Store results and go to results page
      sessionStorage.setItem('game-results', JSON.stringify({
        mode,
        results,
        categories,
      }));
      router.push('/results');
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  if (transactions.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Guess Your Spending</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {stage === 'mode-selection' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Choose Your Challenge</h2>
                <p className="text-muted-foreground">
                  How do you want to test your spending awareness?
                </p>
              </div>
              
              <ModeSelector mode={mode} onModeChange={handleModeSelect} />
              
              <DateRangeSelector
                transactions={transactions}
                onDateRangeChange={handleDateRangeChange}
                transactionCount={filteredTransactionCount}
                totalSpent={totalSpent}
              />
              
              <div className="text-center">
                <Button 
                  onClick={handleStartGame} 
                  size="lg" 
                  className="px-12"
                  disabled={filteredTransactionCount === 0}
                >
                  Start Game
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  You&apos;ll guess spending for your top 10 {mode === 'retailer' ? 'retailers' : 'categories'}
                </p>
              </div>
            </div>
          )}

          {stage === 'guessing' && (
            <GuessCard
              categoryName={categories[currentIndex].name}
              currentIndex={currentIndex}
              totalCategories={categories.length}
              onGuess={handleGuess}
            />
          )}

          {stage === 'revealing' && (
            <RevealCard
              categoryName={categories[currentIndex].name}
              guess={results[currentIndex].guess}
              actual={results[currentIndex].actual}
              onNext={handleNext}
              isLast={currentIndex === categories.length - 1}
            />
          )}
        </div>
      </div>
    </div>
  );
}

