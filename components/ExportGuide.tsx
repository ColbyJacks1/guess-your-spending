'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';

/**
 * Tooltip version - Small help icon with popup
 */
export function ExportGuideTooltip() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className="p-1 rounded-full hover:bg-muted transition-colors"
        title="How to export from YNAB"
      >
        <HelpCircle className="w-5 h-5 text-muted-foreground hover:text-primary" />
      </button>
      
      {showTooltip && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowTooltip(false)}
          />
          
          {/* Tooltip */}
          <div className="absolute z-50 top-full right-0 mt-2 w-80">
            <Card className="shadow-lg border-primary/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <p className="font-semibold text-sm">Export from YNAB</p>
                  <button 
                    onClick={() => setShowTooltip(false)} 
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <ol className="text-sm space-y-2 text-foreground/80">
                  <li>1. Open YNAB and select your budget</li>
                  <li>2. Click your budget name (top-left)</li>
                  <li>3. Select &quot;Export Budget Data&quot;</li>
                  <li>4. Download and extract the ZIP file</li>
                  <li>5. Upload the <code className="text-xs bg-muted px-1 py-0.5 rounded">Register.csv</code> file here</li>
                </ol>
                <p className="text-xs text-muted-foreground mt-3">
                  💡 Your data stays in your browser - nothing is uploaded to a server
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Accordion version - Expandable section with detailed steps
 */
export function ExportGuideAccordion() {
  const [isOpen, setIsOpen] = useState(false);
  
  const steps = [
    {
      number: 1,
      title: 'Open YNAB',
      description: 'Log into your YNAB account and select your budget',
    },
    {
      number: 2,
      title: 'Access Settings',
      description: 'Click on your budget name in the top-left corner',
    },
    {
      number: 3,
      title: 'Export Budget Data',
      description: 'Select "Export Budget Data" from the dropdown menu',
    },
    {
      number: 4,
      title: 'Download & Extract',
      description: 'Download the ZIP file and extract it on your computer',
    },
    {
      number: 5,
      title: 'Upload Register.csv',
      description: 'Find the Register.csv file in the extracted folder and upload it above',
    },
  ];
  
  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
      >
        <HelpCircle className="w-4 h-4" />
        <span>How do I export from YNAB?</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      
      <div className={cn(
        'overflow-hidden transition-all duration-300',
        isOpen ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'
      )}>
        <div className="bg-muted/50 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-center">Export Your YNAB Budget</h3>
          
          <ol className="space-y-3">
            {steps.map((step) => (
              <li key={step.number} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">
                  {step.number}
                </span>
                <div>
                  <p className="font-medium text-sm">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
          
          <div className="pt-2 border-t">
            <p className="text-xs text-center text-muted-foreground">
              <strong>Note:</strong> Only the Register.csv file is needed. Your data stays in your browser and is never sent to a server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

