import { motion } from 'framer-motion';
import type { Suitability } from '@/types/resume';
import { SUITABILITY_CONFIG } from '@/types/resume';

interface ScoreGaugeProps {
  score: number;
  suitability: Suitability;
}

export function ScoreGauge({ score, suitability }: ScoreGaugeProps) {
  const config = SUITABILITY_CONFIG[suitability];
  
  // Calculate the stroke dasharray for the circular progress
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getGradientColors = () => {
    switch (suitability) {
      case 'suitable':
        return ['#22c55e', '#10b981'];
      case 'partially_suitable':
        return ['#f59e0b', '#eab308'];
      case 'not_suitable':
        return ['#ef4444', '#f97316'];
    }
  };

  const [startColor, endColor] = getGradientColors();

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-muted"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
          </defs>
          
          {/* Progress circle */}
          <motion.circle
            cx="96"
            cy="96"
            r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-5xl font-display font-bold text-foreground"
          >
            {score}
          </motion.span>
          <span className="text-muted-foreground text-sm">Match Score</span>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`mt-4 px-6 py-2 rounded-full font-semibold ${config.bgColor} ${config.color}`}
      >
        {config.label}
      </motion.div>
    </div>
  );
}