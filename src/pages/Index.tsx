import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSearch2, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResumeUploader } from '@/components/ResumeUploader';
import { DomainSelector } from '@/components/DomainSelector';
import { LoadingAnalysis } from '@/components/LoadingAnalysis';
import { AnalysisResults } from '@/components/AnalysisResults';
import { useResumeAnalysis } from '@/hooks/useResumeAnalysis';
import type { JobDomain } from '@/types/resume';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<JobDomain | null>(null);
  const { isAnalyzing, error, results, analyzeResume, reset } = useResumeAnalysis();

  const handleAnalyze = async () => {
    if (selectedFile && selectedDomain) {
      await analyzeResume(selectedFile, selectedDomain);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSelectedDomain(null);
    reset();
  };

  const canAnalyze = selectedFile && selectedDomain && !isAnalyzing;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden"
        style={{ background: 'var(--gradient-hero)' }}
      >
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm text-white/90">AI-Powered Resume Analysis</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Resume Analyzer &
              <span className="block gradient-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                Job Recommender
              </span>
            </h1>
            
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Upload your resume, select a job domain, and get instant insights on your job fit,
              skill gaps, and personalized career recommendations.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 -mt-8">
        <AnimatePresence mode="wait">
          {results ? (
            <AnalysisResults key="results" results={results} onReset={handleReset} />
          ) : isAnalyzing ? (
            <LoadingAnalysis key="loading" />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Upload Section */}
              <div className="card-elevated p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileSearch2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-semibold text-foreground">
                      Step 1: Upload Your Resume
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      We'll extract and analyze your skills and experience
                    </p>
                  </div>
                </div>
                
                <ResumeUploader
                  onFileSelect={setSelectedFile}
                  selectedFile={selectedFile}
                  onClear={() => setSelectedFile(null)}
                  disabled={isAnalyzing}
                />
              </div>

              {/* Domain Selection */}
              <div className="card-elevated p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-secondary">2</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-semibold text-foreground">
                      Step 2: Select Job Domain
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Choose the industry you're targeting
                    </p>
                  </div>
                </div>
                
                <DomainSelector
                  selectedDomain={selectedDomain}
                  onSelect={setSelectedDomain}
                  disabled={isAnalyzing}
                />
              </div>

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Analyze Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center"
              >
                <Button
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  className="px-8 py-6 text-lg gap-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="w-5 h-5" />
                  Analyze Resume
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8"
              >
                {[
                  {
                    title: 'Skill Extraction',
                    description: 'AI identifies all your technical and soft skills automatically',
                  },
                  {
                    title: 'Job Matching',
                    description: 'Get matched with roles based on your qualifications',
                  },
                  {
                    title: 'Gap Analysis',
                    description: 'Discover which skills to develop for your dream role',
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="text-center p-6 rounded-xl bg-muted/30 border border-border"
                  >
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Resume Analyzer • Built with AI-powered insights</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;