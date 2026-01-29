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
      // 1️⃣ Resume text extract
      const resumeText = await parseResume(file);

      if (!resumeText || resumeText.length < 50) {
        throw new Error('Resume text extraction failed. File may be empty or unreadable.');
      }

      // 2️⃣ ENV validation (IMPORTANT)
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase environment variables are missing.');
      }

      // 3️⃣ Call Supabase Edge Function
      const response = await fetch(
        `${supabaseUrl}/functions/v1/analyze-resume`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            resumeText,
            domain,
            fileName: file.name,
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Analysis failed with status ${response.status}`);
      }

      const data: AnalysisResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Resume analysis failed.');
      }

      setResults(data.results);
    } catch (err) {
      console.error('Resume analysis error:', err);
      setError(err instanceof Error ? err.message : 'Unexpected error occurred');
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
