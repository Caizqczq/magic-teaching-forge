// Performance optimization utilities

/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function to limit function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Intersection Observer for lazy loading
 */
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

/**
 * Image lazy loading utility
 */
export const lazyLoadImage = (img: HTMLImageElement, src: string) => {
  const observer = createIntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLImageElement;
          target.src = src;
          target.classList.remove('lazy');
          observer.unobserve(target);
        }
      });
    },
    { threshold: 0.1 }
  );
  
  observer.observe(img);
  return observer;
};

/**
 * Virtual scrolling helper
 */
export class VirtualScroller {
  private container: HTMLElement;
  private itemHeight: number;
  private bufferSize: number;
  private data: any[];
  private renderItem: (item: any, index: number) => HTMLElement;
  
  constructor(
    container: HTMLElement,
    itemHeight: number,
    data: any[],
    renderItem: (item: any, index: number) => HTMLElement,
    bufferSize = 5
  ) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.bufferSize = bufferSize;
    this.data = data;
    this.renderItem = renderItem;
    
    this.init();
  }
  
  private init() {
    this.container.style.height = `${this.data.length * this.itemHeight}px`;
    this.container.style.position = 'relative';
    this.container.style.overflow = 'auto';
    
    this.update();
    this.container.addEventListener('scroll', this.handleScroll.bind(this));
  }
  
  private handleScroll() {
    this.update();
  }
  
  private update() {
    const scrollTop = this.container.scrollTop;
    const containerHeight = this.container.clientHeight;
    
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / this.itemHeight) - this.bufferSize
    );
    
    const endIndex = Math.min(
      this.data.length - 1,
      Math.ceil((scrollTop + containerHeight) / this.itemHeight) + this.bufferSize
    );
    
    // Clear container
    this.container.innerHTML = '';
    
    // Render visible items
    for (let i = startIndex; i <= endIndex; i++) {
      const item = this.renderItem(this.data[i], i);
      item.style.position = 'absolute';
      item.style.top = `${i * this.itemHeight}px`;
      item.style.height = `${this.itemHeight}px`;
      item.style.width = '100%';
      this.container.appendChild(item);
    }
  }
  
  updateData(newData: any[]) {
    this.data = newData;
    this.container.style.height = `${this.data.length * this.itemHeight}px`;
    this.update();
  }
}

/**
 * Preload resources
 */
export const preloadResource = (url: string, type: 'image' | 'script' | 'style' = 'image') => {
  return new Promise((resolve, reject) => {
    let element: HTMLElement;
    
    switch (type) {
      case 'image':
        element = new Image();
        break;
      case 'script':
        element = document.createElement('script');
        break;
      case 'style':
        element = document.createElement('link');
        (element as HTMLLinkElement).rel = 'stylesheet';
        break;
      default:
        element = new Image();
    }
    
    element.onload = () => resolve(element);
    element.onerror = reject;
    
    if (element instanceof HTMLImageElement) {
      element.src = url;
    } else if (element instanceof HTMLScriptElement) {
      element.src = url;
      document.head.appendChild(element);
    } else if (element instanceof HTMLLinkElement) {
      element.href = url;
      document.head.appendChild(element);
    }
  });
};

/**
 * Memory usage monitoring
 */
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
      percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
    };
  }
  return null;
};

/**
 * Bundle size analyzer
 */
export const analyzeBundleSize = () => {
  const scripts = Array.from(document.scripts);
  let totalSize = 0;
  
  scripts.forEach(script => {
    if (script.src && script.src.includes(window.location.origin)) {
      fetch(script.src, { method: 'HEAD' })
        .then(response => {
          const size = response.headers.get('content-length');
          if (size) {
            totalSize += parseInt(size, 10);
          }
        })
        .catch(console.error);
    }
  });
  
  return totalSize;
};

/**
 * Web Vitals measurement
 */
export const measureWebVitals = () => {
  // FCP - First Contentful Paint
  const paintEntries = performance.getEntriesByType('paint');
  const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
  
  // LCP - Largest Contentful Paint
  let lcp = 0;
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    lcp = lastEntry.startTime;
  }).observe({ entryTypes: ['largest-contentful-paint'] });
  
  // CLS - Cumulative Layout Shift
  let cls = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        cls += (entry as any).value;
      }
    }
  }).observe({ entryTypes: ['layout-shift'] });
  
  return {
    fcp: fcp?.startTime || 0,
    lcp,
    cls,
    ttfb: performance.timing?.responseStart - performance.timing?.requestStart || 0,
  };
};