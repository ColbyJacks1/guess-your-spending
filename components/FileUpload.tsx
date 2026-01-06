'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function FileUpload({ onFileSelect, disabled = false }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find((file) => file.name.endsWith('.csv'));

    if (csvFile) {
      setSelectedFile(csvFile);
      onFileSelect(csvFile);
    }
  }, [disabled, onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <Card
      className={cn(
        'relative border-2 border-dashed transition-all',
        isDragging && 'border-primary bg-primary/5',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && !isDragging && 'hover:border-primary/50'
      )}
    >
      <div
        className="p-8 text-center"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-10 h-10 text-primary" />
              <div className="text-left">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              {!disabled && (
                <button
                  onClick={clearFile}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  title="Remove file"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Upload Your Transactions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your transaction CSV file here, or click to browse
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              disabled={disabled}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className={cn(
                'inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md transition-colors cursor-pointer',
                !disabled && 'hover:bg-primary/90',
                disabled && 'cursor-not-allowed'
              )}
            >
              Choose File
            </label>
            <p className="text-xs text-muted-foreground mt-4">
              Your data stays in your browser - nothing is uploaded to a server
            </p>
          </>
        )}
      </div>
    </Card>
  );
}

