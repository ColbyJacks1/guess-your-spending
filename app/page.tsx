'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/FileUpload';
import { ExportGuideTooltip, ExportGuideAccordion } from '@/components/ExportGuide';
import { parseTransactionCSV } from '@/lib/csv-parser';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await parseTransactionCSV(file);

      if (!result.success) {
        setError(result.error || 'Failed to parse CSV file');
        setIsProcessing(false);
        return;
      }

      if (result.transactions.length === 0) {
        setError('No valid transactions found in the file');
        setIsProcessing(false);
        return;
      }

      // Store transactions in sessionStorage for the game page
      sessionStorage.setItem('transactions', JSON.stringify(result.transactions));

      // Navigate to game page
      router.push('/game');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Guess Your Spending
            </h1>
            <p className="text-xl text-muted-foreground">
              Think you know where your money goes? Let&apos;s find out! 💸
            </p>
          </div>

          {/* Upload Area */}
          <div className="mb-4 relative">
            <div className="absolute top-2 right-2 z-10">
              <ExportGuideTooltip />
            </div>
            <FileUpload onFileSelect={handleFileSelect} disabled={isProcessing} />
          </div>

          {/* Export Help Link */}
          <div className="text-center mb-8">
            <ExportGuideAccordion />
          </div>

          {/* Processing State */}
          {isProcessing && (
            <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Processing your spending data...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          {/* How It Works */}
          {!isProcessing && !error && (
            <div className="mt-12 space-y-6">
              <h2 className="text-2xl font-semibold text-center mb-6">How It Works</h2>
              <div className="grid gap-4">
                <div className="flex gap-4 items-start p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Upload Your Transaction Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload a CSV from YNAB, Mint, your bank, or use our template
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Choose Your Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      Guess by retailer (Amazon, Target, etc.) or by category (Groceries, Gas, etc.)
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Make Your Guesses</h3>
                    <p className="text-sm text-muted-foreground">
                      Guess how much you spent in each category, then see the actual amount
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-400 font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">See Your Results</h3>
                    <p className="text-sm text-muted-foreground">
                      Find out how well you know your spending habits!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
