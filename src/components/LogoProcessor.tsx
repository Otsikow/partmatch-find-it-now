import { useState, useEffect } from 'react';
import { processAllCarLogos } from '@/utils/logoProcessor';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface LogoProcessorProps {
  onProcessingComplete?: (processedLogos: Record<string, string>) => void;
}

export const LogoProcessor = ({ onProcessingComplete }: LogoProcessorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcessLogos = async () => {
    setIsProcessing(true);
    setProcessedCount(0);
    setTotalCount(55); // Total number of logos
    setError(null);
    setIsComplete(false);

    try {
      const processedLogos = await processAllCarLogos();
      setIsComplete(true);
      onProcessingComplete?.(processedLogos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process logos');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-background border rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Logo Background Removal</h3>
        
        {!isProcessing && !isComplete && !error && (
          <Button 
            onClick={handleProcessLogos}
            className="w-full"
            size="sm"
          >
            Process All Car Logos
          </Button>
        )}

        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Processing logos...</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(processedCount / totalCount) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {processedCount} / {totalCount} logos processed
            </p>
          </div>
        )}

        {isComplete && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">All logos processed successfully!</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};