'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, calculatePercentageDifference, getAccuracyRating } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface RevealCardProps {
  categoryName: string;
  guess: number;
  actual: number;
  onNext: () => void;
  isLast: boolean;
}

export function RevealCard({
  categoryName,
  guess,
  actual,
  onNext,
  isLast,
}: RevealCardProps) {
  const [isRevealing, setIsRevealing] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsRevealing(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const difference = actual - guess;
  const percentOff = calculatePercentageDifference(guess, actual);
  const accuracy = getAccuracyRating(percentOff);
  
  // Get reaction based on accuracy
  const getReaction = () => {
    if (percentOff < 5) return { emoji: '🎯', message: 'Nailed it!' };
    if (percentOff < 15) return { emoji: '👏', message: 'So close!' };
    if (percentOff < 30) return { emoji: '😊', message: 'Pretty good!' };
    if (percentOff < 50) return { emoji: '😮', message: 'Whoa, plot twist!' };
    return { emoji: '🤯', message: 'Big surprise!' };
  };
  
  const reaction = getReaction();

  return (
    <Card className={cn(
      'max-w-lg mx-auto transition-all duration-300',
      isRevealing && 'scale-95 opacity-0'
    )}>
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Your spending on{' '}
          <span className="text-primary">{categoryName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* The Reveal */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">You guessed</p>
          <p className="text-3xl font-bold mb-4">{formatCurrency(guess)}</p>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-muted-foreground">ACTUAL</span>
            <div className="h-px bg-border flex-1" />
          </div>
          
          <p className="text-4xl font-bold text-primary mb-2">
            {formatCurrency(actual)}
          </p>
        </div>

        {/* Accuracy Feedback */}
        <div className="text-center space-y-2">
          <div className="text-4xl mb-2">
            {reaction.emoji}
          </div>
          
          <p className="text-xl font-semibold text-muted-foreground mb-3">
            {reaction.message}
          </p>
          
          <div className="flex items-center justify-center gap-2">
            {difference > 0 ? (
              <TrendingUp className="w-5 h-5 text-orange-500" />
            ) : difference < 0 ? (
              <TrendingDown className="w-5 h-5 text-green-500" />
            ) : null}
            <p className="text-lg">
              You were{' '}
              <span className={cn('font-bold', accuracy.color)}>
                {formatCurrency(Math.abs(difference))}
              </span>{' '}
              {difference > 0 ? 'under' : difference < 0 ? 'over' : 'exactly right!'}
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {percentOff.toFixed(1)}% off from actual
          </p>
        </div>

        {/* Next Button */}
        <Button onClick={onNext} className="w-full" size="lg">
          {isLast ? 'See Final Results' : 'Next Category'}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

