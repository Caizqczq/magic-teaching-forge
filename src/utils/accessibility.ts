// Accessibility utility functions

/**
 * Announces text to screen readers
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Clean up after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Trap focus within a container
 */
export const trapFocus = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };
  
  container.addEventListener('keydown', handleTabKey);
  
  // Return cleanup function
  return () => container.removeEventListener('keydown', handleTabKey);
};

/**
 * Generate unique IDs for accessibility
 */
let idCounter = 0;
export const generateId = (prefix = 'id') => {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Check if user is using keyboard navigation
 */
export const isUsingKeyboard = () => {
  let isKeyboard = false;
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      isKeyboard = true;
    }
  });
  
  document.addEventListener('mousedown', () => {
    isKeyboard = false;
  });
  
  return () => isKeyboard;
};

/**
 * Skip link functionality
 */
export const createSkipLink = (targetId: string, text = '跳转到主内容') => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = text;
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50';
  
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  return skipLink;
};

/**
 * Set page title for screen readers
 */
export const setPageTitle = (title: string) => {
  document.title = title;
  announceToScreenReader(`页面已更改为: ${title}`);
};

/**
 * ARIA live region utilities
 */
export class LiveRegion {
  private element: HTMLElement;
  
  constructor(priority: 'polite' | 'assertive' = 'polite') {
    this.element = document.createElement('div');
    this.element.setAttribute('aria-live', priority);
    this.element.setAttribute('aria-atomic', 'true');
    this.element.setAttribute('class', 'sr-only');
    document.body.appendChild(this.element);
  }
  
  announce(message: string) {
    this.element.textContent = message;
  }
  
  clear() {
    this.element.textContent = '';
  }
  
  destroy() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

/**
 * Focus management utilities
 */
export const focusElement = (selector: string | HTMLElement, options?: FocusOptions) => {
  const element = typeof selector === 'string' 
    ? document.querySelector(selector) as HTMLElement
    : selector;
    
  if (element) {
    element.focus(options);
  }
};

export const saveFocus = () => {
  return document.activeElement as HTMLElement;
};

export const restoreFocus = (element: HTMLElement) => {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
};