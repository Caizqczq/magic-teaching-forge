import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'muted';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className,
  text,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const variantClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    muted: 'text-muted-foreground',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 
          className={cn(
            'animate-spin',
            sizeClasses[size],
            variantClasses[variant]
          )} 
        />
        {text && (
          <p className={cn('text-sm', variantClasses[variant])}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export const FullPageLoader: React.FC<{ text?: string }> = ({ text = '加载中...' }) => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-card p-6 rounded-lg shadow-lg border animate-scale-in">
      <LoadingSpinner size="lg" text={text} />
    </div>
  </div>
);

export const InlineLoader: React.FC<{ text?: string; className?: string }> = ({ 
  text = '加载中...', 
  className 
}) => (
  <div className={cn('flex items-center justify-center py-8', className)}>
    <LoadingSpinner text={text} />
  </div>
);

// Pulse Loading Animation
export const PulseLoader: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex space-x-1', className)}>
    {[0, 1, 2].map((index) => (
      <div
        key={index}
        className="w-2 h-2 bg-primary rounded-full animate-pulse"
        style={{
          animationDelay: `${index * 0.15}s`,
          animationDuration: '0.6s',
        }}
      />
    ))}
  </div>
);

// Dots Loading Animation
export const DotsLoader: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex space-x-1', className)}>
    {[0, 1, 2].map((index) => (
      <div
        key={index}
        className="w-2 h-2 bg-primary rounded-full animate-bounce"
        style={{
          animationDelay: `${index * 0.1}s`,
        }}
      />
    ))}
  </div>
);

// Progress Ring Loader
export const ProgressRing: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}> = ({ 
  progress, 
  size = 40, 
  strokeWidth = 4,
  className 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn('relative', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-foreground">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};