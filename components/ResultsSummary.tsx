'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { GameResult } from '@/lib/types';
import { formatCurrency, calculateOverallScore, getAccuracyRating } from '@/lib/utils';
import { Trophy, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface ResultsSummaryProps {
  results: GameResult[];
  mode: 'retailer' | 'category';
}

export function ResultsSummary({ results, mode }: ResultsSummaryProps) {
  const overallScore = calculateOverallScore(results);
  const totalGuessed = results.reduce((sum, r) => sum + r.guess, 0);
  const totalActual = results.reduce((sum, r) => sum + r.actual, 0);
  const totalDifference = totalActual - totalGuessed;

  // Find biggest surprise (largest percentage off)
  const biggestSurprise = results.reduce((max, r) => 
    r.percentOff > max.percentOff ? r : max
  );

  // Find most accurate (smallest percentage off)
  const mostAccurate = results.reduce((min, r) => 
    r.percentOff < min.percentOff ? r : min
  );

  const getScoreRating = (score: number) => {
    if (score >= 90) return { text: 'Amazing!', emoji: '🏆', color: 'text-yellow-600' };
    if (score >= 80) return { text: 'Excellent!', emoji: '⭐', color: 'text-green-600' };
    if (score >= 70) return { text: 'Great!', emoji: '👍', color: 'text-green-500' };
    if (score >= 60) return { text: 'Good!', emoji: '✅', color: 'text-blue-500' };
    if (score >= 50) return { text: 'Not bad!', emoji: '🤔', color: 'text-yellow-500' };
    return { text: 'Room to improve!', emoji: '📊', color: 'text-orange-500' };
  };

  const scoreRating = getScoreRating(overallScore);

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="border-primary/20">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">{scoreRating.emoji}</div>
          <CardTitle className="text-3xl mb-2">
            <span className={scoreRating.color}>{scoreRating.text}</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Your spending awareness score
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <div className="text-center">
              <p className="text-5xl font-bold text-primary">{overallScore.toFixed(0)}</p>
              <p className="text-sm text-muted-foreground">out of 100</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold">{formatCurrency(totalGuessed)}</p>
              <p className="text-sm text-muted-foreground">Total Guessed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{formatCurrency(totalActual)}</p>
              <p className="text-sm text-muted-foreground">Total Actual</p>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-lg">
              You were{' '}
              <span className="font-bold">
                {formatCurrency(Math.abs(totalDifference))}
              </span>{' '}
              {totalDifference > 0 ? 'under' : 'over'} overall
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-green-600" />
              Most Accurate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold mb-2">{mostAccurate.categoryName}</p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Guessed:</span>
              <span>{formatCurrency(mostAccurate.guess)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Actual:</span>
              <span>{formatCurrency(mostAccurate.actual)}</span>
            </div>
            <p className="text-xs text-green-600 mt-2">
              Only {mostAccurate.percentOff.toFixed(1)}% off! 🎯
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              Biggest Surprise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold mb-2">{biggestSurprise.categoryName}</p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Guessed:</span>
              <span>{formatCurrency(biggestSurprise.guess)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Actual:</span>
              <span>{formatCurrency(biggestSurprise.actual)}</span>
            </div>
            <p className="text-xs text-orange-600 mt-2">
              {biggestSurprise.percentOff.toFixed(1)}% off 😮
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.map((result, index) => {
              const accuracy = getAccuracyRating(result.percentOff);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{result.categoryName}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Guessed: {formatCurrency(result.guess)}</span>
                      <span>•</span>
                      <span>Actual: {formatCurrency(result.actual)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      {result.difference > 0 ? (
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                      ) : result.difference < 0 ? (
                        <TrendingDown className="w-4 h-4 text-green-500" />
                      ) : (
                        <Target className="w-4 h-4 text-green-600" />
                      )}
                      <span className={`text-sm font-medium ${accuracy.color}`}>
                        {result.percentOff.toFixed(0)}% off
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

