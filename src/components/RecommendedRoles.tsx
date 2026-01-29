import { motion } from 'framer-motion';
import { Award, TrendingUp, CheckCircle2 } from 'lucide-react';
import type { RecommendedRole } from '@/types/resume';

interface RecommendedRolesProps {
  roles: RecommendedRole[];
}

export function RecommendedRoles({ roles }: RecommendedRolesProps) {
  return (
    <div className="space-y-4">
      {roles.map((role, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.15 }}
          className={`
            card-interactive p-5
            ${index === 0 ? 'ring-2 ring-primary/20 bg-primary/5' : ''}
          `}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {index === 0 && (
                  <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-md">
                    Best Match
                  </span>
                )}
                <span className="text-lg font-semibold text-foreground flex items-center gap-2">
                  {index === 0 && <Award className="w-5 h-5 text-primary" />}
                  {role.title}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {role.description}
              </p>
              
              {/* Matched Skills */}
              {role.matchedSkills.length > 0 && (
                <div className="mb-2">
                  <span className="text-xs text-muted-foreground">Matching skills: </span>
                  <span className="text-xs text-success">
                    {role.matchedSkills.slice(0, 5).join(', ')}
                    {role.matchedSkills.length > 5 && ` +${role.matchedSkills.length - 5} more`}
                  </span>
                </div>
              )}
            </div>
            
            {/* Score */}
            <div className="flex flex-col items-center">
              <div className={`
                w-16 h-16 rounded-xl flex flex-col items-center justify-center
                ${role.matchScore >= 70 
                  ? 'bg-success/10 text-success' 
                  : role.matchScore >= 40 
                    ? 'bg-warning/10 text-warning'
                    : 'bg-muted text-muted-foreground'
                }
              `}>
                <span className="text-2xl font-bold">{role.matchScore}</span>
                <span className="text-xs">%</span>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${role.matchScore}%` }}
                transition={{ duration: 1, delay: index * 0.15 + 0.3 }}
                className={`h-full rounded-full ${
                  role.matchScore >= 70 
                    ? 'bg-gradient-to-r from-success to-emerald-400' 
                    : role.matchScore >= 40 
                      ? 'bg-gradient-to-r from-warning to-amber-400'
                      : 'bg-gradient-to-r from-muted-foreground to-muted'
                }`}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}