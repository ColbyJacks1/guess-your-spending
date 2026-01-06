'use client';

import { Card } from './ui/card';
import { Store, Tags } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModeSelectorProps {
  mode: 'retailer' | 'category';
  onModeChange: (mode: 'retailer' | 'category') => void;
}

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card
        className={cn(
          'p-6 cursor-pointer transition-all border-2',
          mode === 'retailer'
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        )}
        onClick={() => onModeChange('retailer')}
      >
        <div className="flex flex-col items-center text-center gap-3">
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center',
              mode === 'retailer'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">By Retailer</h3>
            <p className="text-sm text-muted-foreground">
              Guess spending at stores like Amazon, Target, etc.
            </p>
          </div>
        </div>
      </Card>

      <Card
        className={cn(
          'p-6 cursor-pointer transition-all border-2',
          mode === 'category'
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        )}
        onClick={() => onModeChange('category')}
      >
        <div className="flex flex-col items-center text-center gap-3">
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center',
              mode === 'category'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <Tags className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">By Category</h3>
            <p className="text-sm text-muted-foreground">
              Guess spending on categories like Groceries, Gas, etc.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

