import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className,
  showHome = true,
}) => {
  const allItems = showHome 
    ? [{ label: '首页', href: '/' }, ...items]
    : items;

  return (
    <nav 
      aria-label="面包屑导航" 
      className={cn('flex items-center space-x-1 text-sm', className)}
    >
      <ol className="flex items-center space-x-1">
        {allItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            )}
            
            {item.current || !item.href ? (
              <span 
                className={cn(
                  'font-medium',
                  item.current 
                    ? 'text-foreground' 
                    : 'text-muted-foreground'
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                {index === 0 && showHome ? (
                  <Home className="h-4 w-4" />
                ) : (
                  item.label
                )}
              </span>
            ) : (
              <Link
                to={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-sm px-1 py-0.5"
              >
                {index === 0 && showHome ? (
                  <Home className="h-4 w-4" />
                ) : (
                  item.label
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};