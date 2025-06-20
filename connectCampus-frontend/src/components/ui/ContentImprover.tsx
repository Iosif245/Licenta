import React, { useState } from 'react';
import { Button } from '@app/components/ui/button';
import { Sparkles, Wand2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@app/lib/utils';
import { getApi } from '@app/api';

interface ContentImproverProps {
  content: string;
  onImprove: (improved: string) => void;
  type?: 'announcement' | 'event';
  className?: string;
  disabled?: boolean;
}

interface ImprovementSuggestion {
  type: 'formality' | 'structure' | 'expansion' | 'clarity';
  description: string;
}

export const ContentImprover: React.FC<ContentImproverProps> = ({ content, onImprove, type = 'announcement', className = '', disabled = false }) => {
  const [isImproving, setIsImproving] = useState(false);
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImprove = async () => {
    if (!content.trim() || content.length < 10) {
      setError('Content must be at least 10 characters long to be improved.');
      return;
    }

    setIsImproving(true);
    setError(null);
    setSuggestions([]);

    try {
      const api = getApi();
      const response = await api.post('/api/ai/improve-content', {
        content: content.trim(),
        type: type,
      });

      if (response.data?.improvedContent) {
        onImprove(response.data.improvedContent);
        if (response.data.suggestions) {
          setSuggestions(response.data.suggestions);
          setShowSuggestions(true);
        }
      } else {
        setError('Could not improve the content. Please try again.');
      }
    } catch (error: any) {
      console.error('Content improvement failed:', error);

      if (error.response?.status === 401) {
        setError('You must be authenticated to use this feature.');
      } else if (error.response?.status === 400) {
        setError('Content cannot be processed. Please check if it is valid.');
      } else if (error.response?.status === 503) {
        setError('AI service is temporarily unavailable. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsImproving(false);
    }
  };

  const getSuggestionIcon = (suggestionType: string) => {
    switch (suggestionType) {
      case 'formality':
        return <CheckCircle className="h-3 w-3 text-blue-600" />;
      case 'structure':
        return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'expansion':
        return <CheckCircle className="h-3 w-3 text-purple-600" />;
      case 'clarity':
        return <CheckCircle className="h-3 w-3 text-orange-600" />;
      default:
        return <CheckCircle className="h-3 w-3 text-gray-600" />;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Professional AI Enhancement</span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleImprove}
          disabled={disabled || isImproving || !content.trim() || content.length < 10}
          className="h-9 px-4 text-sm hover:bg-primary hover:text-primary-foreground border-primary/20 hover:border-primary"
        >
          {isImproving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Enhance Content
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="p-4 bg-muted/30 border border-border/40 rounded-lg space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-foreground">Applied improvements:</span>
          </div>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-2">
                {getSuggestionIcon(suggestion.type)}
                <span className="text-sm text-muted-foreground leading-relaxed">{suggestion.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-muted-foreground">AI enhances content with formal, academic tone while preserving the original language.</p>
    </div>
  );
};
