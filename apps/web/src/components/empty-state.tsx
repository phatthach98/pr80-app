import React from 'react';
import { cn } from '@/tailwind/utils';
import { PackageOpen } from 'lucide-react';

export interface EmptyStateProps {
  /**
   * Title text displayed below the image
   */
  title: string;

  /**
   * Optional description text displayed below the title
   */
  description?: string;

  /**
   * Optional class name for the container
   */
  className?: string;

  /**
   * Optional class name for the content section
   */
  contentClassName?: string;

  /**
   * Optional image size
   */
  imageSize?: 'sm' | 'md' | 'lg';

  /**
   * Optional children to render below the description
   */
  children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  className,
  contentClassName,
  children,
}) => {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-center p-4 text-center',
        className,
      )}
    >
      <div className={cn('flex flex-col items-center gap-4', contentClassName)}>
        <div className={cn('mb-2')}>
          <PackageOpen className="h-10 w-14 opacity-80" />
        </div>

        <h3 className="text-lg font-medium">{title}</h3>

        {description && <p className="text-muted-foreground max-w-md text-sm">{description}</p>}

        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
};

export default EmptyState;
