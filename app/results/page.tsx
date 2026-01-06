'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ResultsSummary } from '@/components/ResultsSummary';
import { Button } from '@/components/ui/button';
import { GameResult } from '@/lib/types';
import { RotateCcw, Home } from 'lucide-react';

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<GameResult[]>([]);
  const [mode, setMode] = useState<'retailer' | 'category'>('retailer');

  useEffect(() => {
    const stored = sessionStorage.getItem('game-results');
    if (!stored) {
      router.push('/');
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setResults(parsed.results);
      setMode(parsed.mode);
    } catch (error) {
      console.error('Failed to parse results:', error);
      router.push('/');
    }
  }, [router]);

  const handlePlayAgain = () => {
    // Clear session storage
    sessionStorage.removeItem('game-results');
    sessionStorage.removeItem('ynab-transactions');
    router.push('/');
  };

  const handleTryOtherMode = () => {
    // Keep transactions, just go back to game
    sessionStorage.removeItem('game-results');
    router.push('/game');
  };

  if (results.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Your Results</h1>
            <p className="text-muted-foreground">
              Here&apos;s how well you know your {mode === 'retailer' ? 'retailer' : 'category'} spending
            </p>
          </div>

          {/* Results */}
          <ResultsSummary results={results} mode={mode} />

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleTryOtherMode} variant="outline" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try {mode === 'retailer' ? 'Category' : 'Retailer'} Mode
            </Button>
            <Button onClick={handlePlayAgain} size="lg">
              <Home className="w-4 h-4 mr-2" />
              Upload New Data
            </Button>
          </div>

          {/* Share Suggestion */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              💡 Challenge your friends to see if they know their spending better than you!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

