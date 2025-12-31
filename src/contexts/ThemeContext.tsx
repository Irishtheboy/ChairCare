import React, { createContext, useContext, useState, useEffect } from 'react';
import { theme as lightTheme } from 'styles/theme';

// Light theme configuration
const lightThemeConfig = {
  ...lightTheme,
  mode: 'light' as const,
  colors: {
    ...lightTheme.colors,
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      card: '#ffffff',
      cardHover: '#f8fafc',
      pattern: 'radial-gradient(rgba(0, 0, 0, 0.03) 10%, transparent 1%)',
      patternSize: '11px 11px',
      light: '#ffffff',
      lightSecondary: '#f8fafc',
      lightTertiary: '#f1f5f9',
    },
    text: {
      primary: '#0f172a', // Dark text for good contrast
      secondary: '#334155', // Medium dark for secondary text
      tertiary: '#64748b', // Lighter for tertiary text
      accent: '#16a34a', // Green accent for light mode
      inverse: '#f8fafc', // Light text for dark backgrounds
      lightPrimary: '#0f172a',
      lightSecondary: '#334155',
      lightTertiary: '#64748b',
    },
    border: {
      primary: '#e2e8f0',
      secondary: '#cbd5e1',
      accent: 'rgba(22, 163, 74, 0.2)', // Green accent border
      light: '#e2e8f0',
      lightSecondary: '#cbd5e1',
    }
  },
  // Override gradients for light mode
  gradients: {
    ...lightTheme.gradients,
    primary: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', // Darker green for light mode
    button: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    buttonHover: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
    card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
  }
};

// Dark theme configuration - Modern portfolio style
const darkTheme = {
  ...lightTheme,
  mode: 'dark' as const,
  colors: {
    ...lightTheme.colors,
    // Use the new background structure
    background: lightTheme.colors.background,
    text: lightTheme.colors.text,
    border: lightTheme.colors.border,
  }
};

type ThemeMode = 'light' | 'dark';
type Theme = typeof lightTheme;

interface ThemeContextType {
  mode: ThemeMode;
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('dark'); // Always default to dark mode

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('chaircare-theme') as ThemeMode;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setMode(savedTheme);
    } else {
      // Always default to dark mode - the primary experience
      setMode('dark');
      localStorage.setItem('chaircare-theme', 'dark');
    }
  }, []);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('chaircare-theme', mode);
    
    // Update document class for global styles - prioritize dark
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(mode);
    
    // Update meta theme-color for mobile browsers - dark by default
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', mode === 'dark' ? '#000000' : '#ffffff');
    }
    
    // Set body background to dark by default
    document.body.style.backgroundColor = mode === 'dark' ? '#000000' : '#ffffff';
  }, [mode]);

  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const currentTheme = mode === 'dark' ? darkTheme : lightThemeConfig;

  const value: ThemeContextType = {
    mode,
    theme: currentTheme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme toggle button component - Dark mode prioritized
export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { mode, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className={className}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        color: mode === 'dark' ? '#4ade80' : '#16a34a', // Green accent for current mode
      }}
      title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode (currently ${mode})`}
    >
      {mode === 'light' ? (
        // Moon icon for switching to dark mode
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" fill="currentColor"/>
        </svg>
      ) : (
        // Sun icon for switching to light mode (default state)
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" fill="currentColor"/>
        </svg>
      )}
    </button>
  );
};