import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { FullPageLoader } from '@/components/ui/loading-spinner';

interface LazyRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

export const LazyRoute: React.FC<LazyRouteProps> = ({
  children,
  fallback = <FullPageLoader text="页面加载中..." />,
  errorFallback,
}) => {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// HOC for lazy loading components
export const withLazyLoading = <P extends object>(
  Component: React.ComponentType<P>,
  loadingText?: string
) => {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <LazyRoute fallback={<FullPageLoader text={loadingText} />}>
      <Component {...(props as P)} ref={ref} />
    </LazyRoute>
  ));

  WrappedComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Hook for dynamic imports with loading states
export const useLazyImport = <T,>(
  importFunction: () => Promise<{ default: T }>,
  deps: any[] = []
) => {
  const [component, setComponent] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let isCancelled = false;

    const loadComponent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { default: loadedComponent } = await importFunction();
        
        if (!isCancelled) {
          setComponent(loadedComponent);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load component'));
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadComponent();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { component, loading, error };
};