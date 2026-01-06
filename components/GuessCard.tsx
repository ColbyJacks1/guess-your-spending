'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { DollarSign } from 'lucide-react';

interface GuessCardProps {
  categoryName: string;
  currentIndex: number;
  totalCategories: number;
  onGuess: (amount: number) => void;
}

export function GuessCard({
  categoryName,
  currentIndex,
  totalCategories,
  onGuess,
}: GuessCardProps) {
  const [guess, setGuess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(guess.replace(/[$,]/g, ''));
    
    if (isNaN(amount) || amount < 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    onGuess(amount);
    setGuess('');
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setGuess(e.target.value);
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {totalCategories}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalCategories }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i <= currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
        <CardTitle className="text-2xl">
          How much did you spend on{' '}
          <span className="text-primary">{categoryName}</span>?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              inputMode="decimal"
              placeholder="Enter your guess"
              value={guess}
              onChange={handleInputChange}
              className="pl-10 text-lg h-12"
              autoFocus
            />
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <Button type="submit" className="w-full" size="lg">
            Lock In Guess
          </Button>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-4">
          💡 Tip: Think about all your purchases from this category
        </p>
      </CardContent>
    </Card>
  );
}

