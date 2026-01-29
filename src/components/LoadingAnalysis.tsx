import { motion } from 'framer-motion';
import { FileSearch, Brain, BarChart3, CheckCircle } from 'lucide-react';

const steps = [
  { icon: FileSearch, label: 'Parsing resume', duration: 1 },
  { icon: Brain, label: 'Extracting skills', duration: 2 },
  { icon: BarChart3, label: 'Matching with roles', duration: 2 },
  { icon: CheckCircle, label: 'Generating recommendations', duration: 1 },
];

export function LoadingAnalysis() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="card-elevated p-8"
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
        >
          <Brain className="w-8 h-8 text-primary-foreground" />
        </motion.div>
        <h3 className="text-xl font-display font-semibold text-foreground">
          Analyzing Your Resume
        </h3>
        <p className="text-muted-foreground mt-1">
          Our AI is reviewing your qualifications
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.5 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-muted/50"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
                className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
              >
                <Icon className="w-5 h-5 text-primary" />
              </motion.div>
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground">{step.label}</span>
                <motion.div 
                  className="h-1.5 mt-2 bg-muted rounded-full overflow-hidden"
                >
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ 
                      delay: index * 1.5,
                      duration: step.duration,
                      ease: "easeInOut",
                    }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}