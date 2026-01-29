import { motion } from 'framer-motion';
import { Check, X, Sparkles, AlertTriangle } from 'lucide-react';

interface SkillsDisplayProps {
  extractedSkills: string[];
  missingSkills: string[];
  keyStrengths?: string[];
}

export function SkillsDisplay({ 
  extractedSkills, 
  missingSkills,
  keyStrengths = [],
}: SkillsDisplayProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <div className="space-y-6">
      {/* Key Strengths */}
      {keyStrengths.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-warning" />
            Key Strengths
          </h4>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-wrap gap-2"
          >
            {keyStrengths.map((strength, index) => (
              <motion.span
                key={index}
                variants={item}
                className="px-3 py-1.5 bg-warning/10 text-warning border border-warning/20 rounded-full text-sm font-medium"
              >
                {strength}
              </motion.span>
            ))}
          </motion.div>
        </div>
      )}

      {/* Extracted Skills */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Check className="w-4 h-4 text-success" />
          Extracted Skills ({extractedSkills.length})
        </h4>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-2"
        >
          {extractedSkills.slice(0, 20).map((skill, index) => (
            <motion.span
              key={index}
              variants={item}
              className="px-3 py-1.5 bg-success/10 text-success border border-success/20 rounded-full text-sm"
            >
              {skill}
            </motion.span>
          ))}
          {extractedSkills.length > 20 && (
            <motion.span
              variants={item}
              className="px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-sm"
            >
              +{extractedSkills.length - 20} more
            </motion.span>
          )}
        </motion.div>
      </div>

      {/* Missing Skills */}
      {missingSkills.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            Skills Gap ({missingSkills.length} missing)
          </h4>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-wrap gap-2"
          >
            {missingSkills.map((skill, index) => (
              <motion.span
                key={index}
                variants={item}
                className="px-3 py-1.5 bg-destructive/10 text-destructive border border-destructive/20 rounded-full text-sm flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}