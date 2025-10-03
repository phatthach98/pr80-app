import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`border-primary animate-spin rounded-full border-t-2 border-b-2 ${sizeClasses[size]}`}
      ></div>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width = 'w-full',
  height = 'h-4',
  rounded = true,
  animate = true,
}) => {
  return (
    <div
      className={`bg-muted ${width} ${height} ${rounded ? 'rounded' : ''} ${animate ? 'animate-pulse' : ''} ${className}`}
    />
  );
};

interface SkeletonCardProps {
  className?: string;
  rows?: number;
  rowWidths?: string[];
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  className = '',
  rows = 4,
  rowWidths = ['w-3/4', 'w-full', 'w-5/6', 'w-2/3'],
}) => {
  // Ensure we have enough widths for all rows
  const getWidth = (index: number) => {
    if (index < rowWidths.length) {
      return rowWidths[index];
    }
    // Cycle through widths if we have more rows than defined widths
    return rowWidths[index % rowWidths.length];
  };

  return (
    <div className={`bg-card w-full rounded-lg border p-4 ${className}`}>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} width={getWidth(index)} height="h-4" />
        ))}
      </div>
    </div>
  );
};

export const CenteredSkeletonLoader: React.FC<{
  className?: string;
  cardCount?: number;
  showText?: boolean;
}> = ({ className = '', cardCount = 2, showText = true }) => {
  return (
    <div className={`flex h-full max-h-screen w-full items-center justify-center p-4 ${className}`}>
      <div className="flex w-full max-w-md flex-col items-center gap-4">
        <div className="w-full space-y-4">
          {Array.from({ length: cardCount }).map((_, index) => (
            <SkeletonCard
              key={index}
              rows={index === 0 ? 4 : 3}
              rowWidths={
                index === 0 ? ['w-3/4', 'w-full', 'w-5/6', 'w-2/3'] : ['w-1/2', 'w-full', 'w-3/4']
              }
            />
          ))}
        </div>

        {showText && <p className="text-muted-foreground font-medium">Đang tải...</p>}
      </div>
    </div>
  );
};

export const FullPageLoader: React.FC = () => {
  return (
    <div className="bg-background/80 fixed inset-0 z-60 flex items-center justify-center backdrop-blur-sm">
      <CenteredSkeletonLoader />
    </div>
  );
};
