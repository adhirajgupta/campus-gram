// Plugin loading and execution utilities
import React from 'react';

export interface PluginComponent {
  id: number;
  pluginId: number;
  componentName: string;
  componentType: 'page' | 'widget' | 'modal' | 'sidebar' | 'navbar';
  routePath?: string;
  componentCode: string;
  propsSchema: Record<string, any>;
}

export interface PluginConfig {
  [key: string]: any;
}

// Dynamic component loader for plugins
export class PluginLoader {
  private static componentCache = new Map<string, React.ComponentType<any>>();
  
  // Load and execute plugin component code
  static async loadComponent(component: PluginComponent, config: PluginConfig = {}): Promise<React.ComponentType<any>> {
    const cacheKey = `${component.pluginId}-${component.componentName}`;
    
    if (this.componentCache.has(cacheKey)) {
      return this.componentCache.get(cacheKey)!;
    }
    
    try {
      // Create a safe execution environment
      const componentCode = this.sanitizeComponentCode(component.componentCode);
      
      // Create a function that returns the component
      const componentFunction = new Function(
        'React',
        'useState',
        'useEffect',
        'useContext',
        'config',
        'backend',
        'components',
        'utils',
        `
        ${componentCode}
        
        // Return the default export or the component
        if (typeof default !== 'undefined') {
          return default;
        }
        
        // If no default export, try to find a component
        const componentNames = Object.keys(this).filter(key => 
          typeof this[key] === 'function' && 
          key.charAt(0) === key.charAt(0).toUpperCase()
        );
        
        if (componentNames.length > 0) {
          return this[componentNames[0]];
        }
        
        throw new Error('No valid component found in plugin code');
        `
      );
      
      // Provide safe imports and utilities
      const safeImports = {
        React,
        useState: React.useState,
        useEffect: React.useEffect,
        useContext: React.useContext,
        config,
        backend: this.createSafeBackendAPI(),
        components: this.getSafeComponents(),
        utils: this.getSafeUtils()
      };
      
      const Component = componentFunction.call(safeImports, ...Object.values(safeImports));
      
      // Cache the component
      this.componentCache.set(cacheKey, Component);
      
      return Component;
    } catch (error) {
      console.error(`Failed to load plugin component ${component.componentName}:`, error);
      
      // Return error component
      return this.createErrorComponent(component.componentName, error);
    }
  }
  
  // Sanitize component code to prevent security issues
  private static sanitizeComponentCode(code: string): string {
    // Remove potentially dangerous patterns
    const dangerousPatterns = [
      /eval\s*\(/g,
      /Function\s*\(/g,
      /setTimeout\s*\(/g,
      /setInterval\s*\(/g,
      /document\./g,
      /window\./g,
      /localStorage\./g,
      /sessionStorage\./g,
      /fetch\s*\(/g,
      /XMLHttpRequest/g,
      /import\s*\(/g,
      /require\s*\(/g
    ];
    
    let sanitized = code;
    dangerousPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '/* BLOCKED */');
    });
    
    return sanitized;
  }
  
  // Create a safe backend API interface
  private static createSafeBackendAPI() {
    return {
      // Only allow safe API calls
      get: async (url: string) => {
        // Validate URL and make safe request
        if (!url.startsWith('/api/plugin/')) {
          throw new Error('Unauthorized API access');
        }
        // Implementation would make actual API call
        return { data: null };
      },
      
      post: async (url: string, data: any) => {
        if (!url.startsWith('/api/plugin/')) {
          throw new Error('Unauthorized API access');
        }
        // Implementation would make actual API call
        return { success: true };
      }
    };
  }
  
  // Get safe UI components
  private static getSafeComponents() {
    return {
      Button: ({ children, onClick, ...props }: any) => (
        <button onClick={onClick} {...props}>
          {children}
        </button>
      ),
      Card: ({ children, ...props }: any) => (
        <div className="border rounded-lg p-4" {...props}>
          {children}
        </div>
      ),
      Input: ({ ...props }: any) => (
        <input className="border rounded px-3 py-2" {...props} />
      )
    };
  }
  
  // Get safe utility functions
  private static getSafeUtils() {
    return {
      formatDate: (date: Date) => date.toLocaleDateString(),
      formatTime: (date: Date) => date.toLocaleTimeString(),
      debounce: (func: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
      }
    };
  }
  
  // Create error component for failed plugin loads
  private static createErrorComponent(componentName: string, error: any): React.ComponentType<any> {
    return () => (
      <div className="border-2 border-red-400 bg-red-50 p-4 rounded-lg">
        <h3 className="text-red-800 font-bold">Plugin Error</h3>
        <p className="text-red-600 text-sm">
          Failed to load component: {componentName}
        </p>
        <p className="text-red-500 text-xs mt-1">
          {error.message}
        </p>
      </div>
    );
  }
  
  // Clear component cache
  static clearCache() {
    this.componentCache.clear();
  }
  
  // Get cached component
  static getCachedComponent(pluginId: number, componentName: string): React.ComponentType<any> | null {
    const cacheKey = `${pluginId}-${componentName}`;
    return this.componentCache.get(cacheKey) || null;
  }
}

// Plugin context for sharing data between plugins
export const PluginContext = React.createContext<{
  config: PluginConfig;
  data: Record<string, any>;
  updateData: (key: string, value: any) => void;
}>({
  config: {},
  data: {},
  updateData: () => {}
});

// Hook for plugins to access their context
export const usePluginContext = () => {
  return React.useContext(PluginContext);
};

// Plugin provider component
export const PluginProvider: React.FC<{
  children: React.ReactNode;
  config: PluginConfig;
  data: Record<string, any>;
  updateData: (key: string, value: any) => void;
}> = ({ children, config, data, updateData }) => {
  return (
    <PluginContext.Provider value={{ config, data, updateData }}>
      {children}
    </PluginContext.Provider>
  );
};
