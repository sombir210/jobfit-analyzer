import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, FileText, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScoreGauge } from './ScoreGauge';
import { SkillsDisplay } from './SkillsDisplay';
import { RecommendedRoles } from './RecommendedRoles';
import type { AnalysisResults as AnalysisResultsType } from '@/types/resume';

interface AnalysisResultsProps {
  results: AnalysisResultsType;
  onReset: () => void;
}

export function AnalysisResults({ results, onReset }: AnalysisResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            Analysis Complete
          </h2>
          <p className="text-muted-foreground">
            Here's how your resume matches the selected job domain
          </p>
        </div>
        <Button onClick={onReset} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Analyze Another
        </Button>
      </div>

      {/* Main Score Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-elevated p-8 flex flex-col lg:flex-row items-center gap-8"
      >
        <ScoreGauge score={results.matchScore} suitability={results.suitability} />
        
        <div className="flex-1 space-y-4">
          {/* Summary */}
          {results.summary && (
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
              <FileText className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-1">Professional Summary</h4>
                <p className="text-sm text-muted-foreground">{results.summary}</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            {/* Education */}
            {results.education.length > 0 && (
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                <GraduationCap className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-1">Education</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {results.education.slice(0, 2).map((edu, i) => (
                      <li key={i}>{edu}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Experience */}
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
              <Briefcase className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-1">Experience</h4>
                <p className="text-sm text-muted-foreground">
                  {results.experienceYears > 0 
                    ? `~${results.experienceYears} years`
                    : 'Entry level / Fresh graduate'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skills Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-elevated p-6"
      >
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">
          Skills Analysis
        </h3>
        <SkillsDisplay
          extractedSkills={results.extractedSkills}
          missingSkills={results.missingSkills}
          keyStrengths={results.keyStrengths}
        />
      </motion.div>

      {/* Recommended Roles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">
          Recommended Job Roles
        </h3>
        <RecommendedRoles roles={results.recommendedRoles} />
      </motion.div>

      {/* Improvement Suggestions */}
      {results.areasForImprovement && results.areasForImprovement.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card-elevated p-6 bg-primary/5 border-primary/20"
        >
          <h3 className="text-lg font-display font-semibold text-foreground mb-3">
            💡 Improvement Suggestions
          </h3>
          <ul className="space-y-2">
            {results.areasForImprovement.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}