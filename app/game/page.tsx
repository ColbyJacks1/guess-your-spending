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
import { ArrowLeft, Trophy, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type GameStage = 'mode-selection' | 'guessing' | 'revealing' | 'round-complete';

export default function GamePage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<YNABTransaction[]>([]);
  const [mode, setMode] = useState<'retailer' | 'category'>('retailer');
  const [stage, setStage] = useState<GameStage>('mode-selection');
  const [categories, setCategories] = useState<SpendingCategory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<GameResult[]>([]);
  const [completedNames, setCompletedNames] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset>('last-12-months');
  const [filteredTransactionCount, setFilteredTransactionCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [hasMoreCategories, setHasMoreCategories] = useState(true);

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
      
      // Check if we're continuing a game from results page
      const continueGame = sessionStorage.getItem('continue-game');
      if (continueGame) {
        const continueData = JSON.parse(continueGame);
        setMode(continueData.mode);
        setCompletedNames(continueData.completedNames || []);
        setResults(continueData.results || []);
        sessionStorage.removeItem('continue-game');
      }
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

  const handleStartGame = (continueGame: boolean = false) => {
    const excludeNames = continueGame ? completedNames : [];
    
    const aggregated = aggregateTransactions(transactions, {
      mode,
      topN: 10,
      minAmount: 50, // Only include categories with at least $50
      dateRange,
      excludeNames,
    });

    if (aggregated.length === 0) {
      setHasMoreCategories(false);
      return;
    }

    // Check if there would be more after this batch
    const nextBatchCheck = aggregateTransactions(transactions, {
      mode,
      topN: 1,
      minAmount: 50,
      dateRange,
      excludeNames: [...excludeNames, ...aggregated.map(c => c.name)],
    });
    setHasMoreCategories(nextBatchCheck.length > 0);

    // Shuffle categories so they appear in random order
    const shuffled = [...aggregated].sort(() => Math.random() - 0.5);
    setCategories(shuffled);
    setCurrentIndex(0);
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
      // Add current batch to completed names
      const newCompletedNames = [...completedNames, ...categories.map(c => c.name)];
      setCompletedNames(newCompletedNames);
      
      // Check if there are more categories available
      const nextBatch = aggregateTransactions(transactions, {
        mode,
        topN: 1,
        minAmount: 50,
        dateRange,
        excludeNames: newCompletedNames,
      });
      setHasMoreCategories(nextBatch.length > 0);
      
      // Go to round complete screen
      setStage('round-complete');
    }
  };

  const handleSeeResults = () => {
    // Store results and completed names
    sessionStorage.setItem('game-results', JSON.stringify({
      mode,
      results,
      categories,
      completedNames,
    }));
    router.push('/results');
  };

  const handleContinuePlaying = () => {
    handleStartGame(true);
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
              
              <div className="text-center pt-4">
                <Button 
                  onClick={() => handleStartGame(false)} 
                  size="lg" 
                  className="px-16 py-6 text-xl font-bold shadow-lg hover:shadow-xl transition-shadow"
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

          {stage === 'round-complete' && (
            <Card className="border-none shadow-lg">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">Round Complete!</CardTitle>
                <p className="text-lg text-muted-foreground mt-2">
                  {results.length >= 30 ? "You're unstoppable! 🔥" : 
                   results.length >= 20 ? "On a roll! 🎲" :
                   results.length >= 10 ? "Getting warmer! 🌡️" :
                   "Great start! 🚀"}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-primary mb-2">
                    {results.length}
                  </p>
                  <p className="text-muted-foreground">
                    {mode === 'retailer' ? 'retailers' : 'categories'} guessed
                  </p>
                </div>

                <div className="flex flex-col gap-4 max-w-md mx-auto">
                  <Button
                    onClick={handleSeeResults}
                    size="lg"
                    className="w-full py-6 text-lg"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    See My Results
                  </Button>

                  {hasMoreCategories && (
                    <Button
                      onClick={handleContinuePlaying}
                      variant="outline"
                      size="lg"
                      className="w-full py-6 text-lg"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Keep Going (+10 more)
                    </Button>
                  )}
                </div>

                {!hasMoreCategories && (
                  <p className="text-center text-sm text-muted-foreground">
                    You&apos;ve guessed all available {mode === 'retailer' ? 'retailers' : 'categories'}!
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

