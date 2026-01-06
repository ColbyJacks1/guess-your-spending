'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, X, Download } from 'lucide-react';
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
        title="How to get your transaction data"
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
                  <p className="font-semibold text-sm">Getting Your Data</p>
                  <button 
                    onClick={() => setShowTooltip(false)} 
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium mb-2">For YNAB users:</p>
                    <ol className="text-xs space-y-1 text-foreground/80">
                      <li>1. Export Budget Data from YNAB</li>
                      <li>2. Upload the Register.csv file</li>
                    </ol>
                  </div>
                  
                  <div className="border-t pt-3">
                    <p className="text-xs font-medium mb-2">Other formats:</p>
                    <p className="text-xs text-foreground/80 mb-2">
                      Any CSV with Date, Description, and Amount columns
                    </p>
                    <a 
                      href="/example-transactions.csv" 
                      download
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Download className="w-3 h-3" />
                      Download example template
                    </a>
                  </div>
                </div>
                
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
  
  const ynabSteps = [
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
        <span>How do I get my transaction data?</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      
      <div className={cn(
        'overflow-hidden transition-all duration-300',
        isOpen ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'
      )}>
        <div className="bg-muted/50 rounded-xl p-6 space-y-5">
          <div>
            <h3 className="font-semibold text-center mb-4">For YNAB Users</h3>
            
            <ol className="space-y-3">
              {ynabSteps.map((step) => (
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
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="font-semibold text-center mb-3">Using a Different Format?</h3>
            <p className="text-xs text-muted-foreground mb-3">
              You can use any CSV file with these columns:
            </p>
            <ul className="text-xs space-y-1 mb-3">
              <li>• <strong>Date</strong> - Transaction date</li>
              <li>• <strong>Description</strong> - Merchant/payee name</li>
              <li>• <strong>Amount</strong> - Transaction amount</li>
              <li>• <strong>Category</strong> - Optional, needed for category mode</li>
            </ul>
            <a 
              href="/example-transactions.csv" 
              download
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
            >
              <Download className="w-4 h-4" />
              Download example template
            </a>
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-xs text-center text-muted-foreground">
              <strong>Note:</strong> Your data stays in your browser and is never sent to a server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

