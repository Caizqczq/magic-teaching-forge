import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'default',
  width,
  height,
  lines = 1,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4';
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-md';
      default:
        return 'rounded-md';
    }
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'animate-pulse bg-muted',
              getVariantClasses(),
              index === lines - 1 && 'w-3/4' // Last line is shorter
            )}
            style={style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-muted',
        getVariantClasses(),
        className
      )}
      style={style}
      {...props}
    />
  );
};

// Pre-built skeleton components for common use cases
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 space-y-4', className)}>
    <Skeleton className="h-6 w-1/3" />
    <Skeleton variant="text" lines={3} />
    <div className="flex space-x-2">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-20" />
    </div>
  </div>
);

export const AvatarSkeleton: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return <Skeleton variant="circular" className={sizeClasses[size]} />;
};

export const ListSkeleton: React.FC<{ 
  items?: number; 
  showAvatar?: boolean;
  className?: string;
}> = ({ 
  items = 3, 
  showAvatar = false,
  className 
}) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3">
        {showAvatar && <AvatarSkeleton />}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

export const TableSkeleton: React.FC<{ 
  rows?: number; 
  columns?: number;
  className?: string;
}> = ({ 
  rows = 5, 
  columns = 4,
  className 
}) => (
  <div className={cn('space-y-3', className)}>
    {/* Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} className="h-4" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div 
        key={rowIndex} 
        className="grid gap-4" 
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-4" />
        ))}
      </div>
    ))}
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-10 w-24" />
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>

    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <CardSkeleton />
      </div>
      <div>
        <ListSkeleton items={5} showAvatar />
      </div>
    </div>
  </div>
);