'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DateRangePreset,
  DateRange,
  getDateRangeFromPreset,
  getCustomDateRange,
  getAvailableYears,
  formatCurrency,
} from '@/lib/utils';

interface DateRangeSelectorProps {
  transactions: Array<{ date: string; outflow?: number }>;
  onDateRangeChange: (dateRange: DateRange, preset: DateRangePreset) => void;
  transactionCount?: number;
  totalSpent?: number;
}

const QUICK_FILTERS: { value: DateRangePreset; label: string }[] = [
  { value: 'last-month', label: 'Last month' },
  { value: 'last-6-months', label: 'Last 6 months' },
  { value: 'last-12-months', label: 'Last 12 months' },
  { value: 'all-time', label: 'All time' },
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function DateRangeSelector({
  transactions,
  onDateRangeChange,
  transactionCount = 0,
  totalSpent = 0,
}: DateRangeSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>('last-12-months');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  
  // Custom date range states
  const [customFromYear, setCustomFromYear] = useState<number | null>(null);
  const [customFromMonth, setCustomFromMonth] = useState<number>(0);
  const [customToYear, setCustomToYear] = useState<number | null>(null);
  const [customToMonth, setCustomToMonth] = useState<number>(11);

  // Track if we've initialized to prevent re-triggering
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize available years and default range (only once)
  useEffect(() => {
    const years = getAvailableYears(transactions);
    setAvailableYears(years);
    
    // Initialize custom date range to current year
    if (years.length > 0) {
      setCustomFromYear(years[0]);
      setCustomToYear(years[0]);
    }
    
    // Set default to last 12 months ONLY on first mount
    if (!hasInitialized && transactions.length > 0) {
      const defaultRange = getDateRangeFromPreset('last-12-months');
      onDateRangeChange(defaultRange, 'last-12-months');
      setHasInitialized(true);
    }
  }, [transactions, onDateRangeChange, hasInitialized]);

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setSelectedPreset('custom');
    setShowCustomPicker(false);
    const range = getCustomDateRange(year);
    onDateRangeChange(range, 'custom');
  };

  const handlePresetChange = (preset: DateRangePreset) => {
    setSelectedPreset(preset);
    setSelectedYear(null);
    setShowCustomPicker(false);
    const range = getDateRangeFromPreset(preset);
    onDateRangeChange(range, preset);
  };

  const handleCustomRangeApply = () => {
    if (customFromYear && customToYear) {
      const fromDate = new Date(customFromYear, customFromMonth, 1);
      const toDate = new Date(customToYear, customToMonth + 1, 0); // Last day of month
      
      const range: DateRange = {
        start: fromDate,
        end: toDate,
      };
      
      setSelectedPreset('custom');
      setSelectedYear(null);
      onDateRangeChange(range, 'custom');
    }
  };

  // Show last complete year as hero, with adjacent years on either side
  const currentYear = new Date().getFullYear();
  const heroYear = currentYear - 1;
  const prevYear = heroYear - 1;
  const nextYear = heroYear + 1;

  return (
    <Card className="border border-border/50 shadow-sm bg-muted/20 rounded-2xl">
      <CardContent className="p-6 space-y-5">
        {/* Year Selection Row */}
        <div className="flex items-center justify-center gap-2">
          {/* Previous Year */}
          <button
            onClick={() => handleYearSelect(prevYear)}
            className={cn(
              'w-12 h-12 rounded-full text-xs font-medium transition-all flex items-center justify-center',
              selectedYear === prevYear
                ? 'bg-foreground text-background'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            &apos;{prevYear.toString().slice(-2)}
          </button>

          {/* Hero Year (Current Year) */}
          <button
            onClick={() => handleYearSelect(heroYear)}
            className={cn(
              'px-8 py-3 rounded-2xl text-xl font-bold transition-all shadow-md',
              selectedYear === heroYear
                ? 'bg-foreground text-background scale-100'
                : 'bg-muted/70 text-muted-foreground hover:bg-muted scale-95 opacity-70 hover:opacity-100'
            )}
          >
            {heroYear}
          </button>

          {/* Next Year */}
          <button
            onClick={() => handleYearSelect(nextYear)}
            className={cn(
              'w-12 h-12 rounded-full text-xs font-medium transition-all flex items-center justify-center',
              selectedYear === nextYear
                ? 'bg-foreground text-background'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            &apos;{nextYear.toString().slice(-2)}
          </button>

          {/* Custom Date Picker Button */}
          <button
            onClick={() => setShowCustomPicker(!showCustomPicker)}
            className={cn(
              'w-12 h-12 rounded-full text-xs font-medium transition-all flex items-center justify-center',
              showCustomPicker
                ? 'bg-foreground text-background'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
            title="Custom date range"
          >
            <Calendar className="w-4 h-4" />
          </button>
        </div>

        {/* Custom Date Range Picker */}
        {showCustomPicker && (
          <div className="flex flex-col items-center gap-4 p-6 bg-muted/30 rounded-2xl">
            <p className="text-sm font-medium text-muted-foreground">Select a custom date range</p>
            
            {/* From Date */}
            <div className="flex flex-col gap-2 w-full max-w-md">
              <label className="text-xs font-medium text-muted-foreground uppercase">From</label>
              <div className="flex items-center gap-2">
                <select
                  value={customFromYear ?? currentYear}
                  onChange={(e) => setCustomFromYear(parseInt(e.target.value))}
                  className="flex-1 px-4 py-2 rounded-lg border bg-background text-sm font-medium"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  value={customFromMonth}
                  onChange={(e) => setCustomFromMonth(parseInt(e.target.value))}
                  className="flex-1 px-4 py-2 rounded-lg border bg-background text-sm font-medium"
                >
                  {MONTHS.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* To Date */}
            <div className="flex flex-col gap-2 w-full max-w-md">
              <label className="text-xs font-medium text-muted-foreground uppercase">To</label>
              <div className="flex items-center gap-2">
                <select
                  value={customToYear ?? currentYear}
                  onChange={(e) => setCustomToYear(parseInt(e.target.value))}
                  className="flex-1 px-4 py-2 rounded-lg border bg-background text-sm font-medium"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  value={customToMonth}
                  onChange={(e) => setCustomToMonth(parseInt(e.target.value))}
                  className="flex-1 px-4 py-2 rounded-lg border bg-background text-sm font-medium"
                >
                  {MONTHS.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleCustomRangeApply}
              className="px-6 py-2 bg-foreground text-background rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Apply Date Range
            </button>
          </div>
        )}

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {QUICK_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handlePresetChange(filter.value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                selectedPreset === filter.value && !selectedYear
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Stats Display */}
        <div className="flex items-center justify-center gap-6 pt-2">
          <div className="text-center">
            <p className="text-2xl font-bold">{transactionCount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">transactions</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">total spent</p>
          </div>
        </div>

        {/* Warning if no transactions */}
        {transactionCount === 0 && (
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ No transactions found in this period. Try selecting a different date range.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

