import { useState } from 'react';
import { parseResume } from '@/lib/resumeParser';
import type { JobDomain, AnalysisResults, AnalysisResponse } from '@/types/resume';

interface UseResumeAnalysisReturn {
  isAnalyzing: boolean;
  error: string | null;
  results: AnalysisResults | null;
  analyzeResume: (file: File, domain: JobDomain) => Promise<void>;
  reset: () => void;
}

export function useResumeAnalysis(): UseResumeAnalysisReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResults | null>(null);

  const analyzeResume = async (file: File, domain: JobDomain) => {
    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      // Extract text from resume
      const resumeText = await parseResume(file);

      if (!resumeText || resumeText.length < 50) {
        throw new Error('Could not extract enough text from the resume. Please ensure the file is not empty or corrupted.');
      }

      // Call the edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-resume`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            resumeText,
            domain,
            fileName: file.name,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Analysis failed with status ${response.status}`);
      }

      const data: AnalysisResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResults(data.results);
    } catch (err) {
      console.error('Resume analysis error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResults(null);
    setError(null);
    setIsAnalyzing(false);
  };

  return {
    isAnalyzing,
    error,
    results,
    analyzeResume,
    reset,
  };
}