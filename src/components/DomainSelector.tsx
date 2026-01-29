import { motion } from 'framer-motion';
import { Monitor, Radio, Briefcase } from 'lucide-react';
import type { JobDomain } from '@/types/resume';
import { DOMAIN_LABELS } from '@/types/resume';

interface DomainSelectorProps {
  selectedDomain: JobDomain | null;
  onSelect: (domain: JobDomain) => void;
  disabled?: boolean;
}

const domainConfig: Record<JobDomain, { icon: typeof Monitor; description: string }> = {
  technical: {
    icon: Monitor,
    description: 'Software, IT, Data, DevOps',
  },
  telecom: {
    icon: Radio,
    description: 'Network, RF, Telecom Systems',
  },
  other: {
    icon: Briefcase,
    description: 'Business, Support, Management',
  },
};

export function DomainSelector({
  selectedDomain,
  onSelect,
  disabled = false,
}: DomainSelectorProps) {
  const domains: JobDomain[] = ['technical', 'telecom', 'other'];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {domains.map((domain, index) => {
        const { icon: Icon, description } = domainConfig[domain];
        const isSelected = selectedDomain === domain;

        return (
          <motion.button
            key={domain}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => !disabled && onSelect(domain)}
            disabled={disabled}
            className={`
              relative p-5 rounded-xl border-2 text-left transition-all duration-300
              ${isSelected 
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
                : 'border-border hover:border-primary/30 hover:bg-muted/30'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {isSelected && (
              <motion.div
                layoutId="domain-indicator"
                className="absolute inset-0 rounded-xl border-2 border-primary"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            <div className="relative z-10">
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center mb-3
                ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                transition-colors duration-300
              `}>
                <Icon className="w-5 h-5" />
              </div>
              
              <h3 className={`font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                {DOMAIN_LABELS[domain]}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}