import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} reset={this.handleReset} />;
      }

      return <DefaultErrorFallback error={this.state.error} reset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  reset: () => void;
}

export const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, reset }) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-accent p-4">
      <Card className="max-w-md w-full animate-scale-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-error/10">
            <AlertTriangle className="h-8 w-8 text-error" />
          </div>
          <CardTitle className="text-xl">出现了一些问题</CardTitle>
          <CardDescription>
            很抱歉，应用程序遇到了意外错误。请尝试刷新页面或返回首页。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && error && (
            <details className="text-sm bg-muted p-3 rounded-lg">
              <summary className="cursor-pointer font-medium">错误详情</summary>
              <pre className="mt-2 text-xs overflow-auto">{error.stack}</pre>
            </details>
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={reset}
              className="flex-1"
              variant="outline"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              重试
            </Button>
            <Button
              onClick={handleGoHome}
              className="flex-1"
            >
              <Home className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Hook for error boundaries in functional components
export const useErrorHandler = () => {
  return React.useCallback((error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    // 这里可以集成错误监控服务
  }, []);
};