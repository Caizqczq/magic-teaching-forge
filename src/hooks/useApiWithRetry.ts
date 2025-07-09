import React, { useState, useCallback, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseApiWithRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retryCount: number;
}

export const useApiWithRetry = <T, P extends any[]>(
  apiFunction: (...args: P) => Promise<T>,
  options: UseApiWithRetryOptions = {}
) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    showErrorToast = true,
    showSuccessToast = false,
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    retryCount: 0,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (...args: P): Promise<T | null> => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await apiFunction(...args);
        
        setState({
          data: result,
          loading: false,
          error: null,
          retryCount: attempt,
        });

        if (showSuccessToast && attempt > 0) {
          toast({
            title: '操作成功',
            description: `经过 ${attempt + 1} 次尝试后成功完成`,
          });
        }

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (abortControllerRef.current?.signal.aborted) {
          setState(prev => ({
            ...prev,
            loading: false,
          }));
          return null;
        }

        if (attempt < maxRetries) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      }
    }

    setState({
      data: null,
      loading: false,
      error: lastError,
      retryCount: maxRetries,
    });

    if (showErrorToast && lastError) {
      toast({
        title: '操作失败',
        description: `经过 ${maxRetries + 1} 次尝试后仍然失败: ${lastError.message}`,
        variant: 'destructive',
      });
    }

    return null;
  }, [apiFunction, maxRetries, retryDelay, showErrorToast, showSuccessToast]);

  const retry = useCallback((...args: P) => {
    if (state.error) {
      return execute(...args);
    }
    return Promise.resolve(null);
  }, [execute, state.error]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState(prev => ({
      ...prev,
      loading: false,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      retryCount: 0,
    });
  }, []);

  return {
    ...state,
    execute,
    retry,
    cancel,
    reset,
    isRetrying: state.retryCount > 0 && state.loading,
  };
};

// Hook for automatic retry with exponential backoff
export const useAutoRetryApi = <T, P extends any[]>(
  apiFunction: (...args: P) => Promise<T>,
  dependencies: any[] = [],
  options: UseApiWithRetryOptions = {}
) => {
  const api = useApiWithRetry(apiFunction, options);

  React.useEffect(() => {
    api.execute(...([] as unknown as P));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return api;
};

// Hook for optimistic updates
export const useOptimisticApi = <T, P extends any[]>(
  apiFunction: (...args: P) => Promise<T>,
  optimisticUpdate?: (currentData: T | null, ...args: P) => T,
  options: UseApiWithRetryOptions = {}
) => {
  const api = useApiWithRetry(apiFunction, options);
  const [optimisticData, setOptimisticData] = useState<T | null>(null);

  const executeOptimistic = useCallback(async (...args: P): Promise<T | null> => {
    if (optimisticUpdate) {
      const newOptimisticData = optimisticUpdate(api.data, ...args);
      setOptimisticData(newOptimisticData);
    }

    try {
      const result = await api.execute(...args);
      setOptimisticData(null);
      return result;
    } catch (error) {
      setOptimisticData(null);
      throw error;
    }
  }, [api, optimisticUpdate]);

  return {
    ...api,
    data: optimisticData || api.data,
    execute: executeOptimistic,
  };
};