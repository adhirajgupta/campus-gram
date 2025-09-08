import React, { createContext, useContext, useState, useEffect } from 'react';
import { FONT_VARIANTS, type FontVariant } from '../lib/fonts';

interface FontContextType {
  currentFont: FontVariant;
  setCurrentFont: (font: FontVariant) => void;
  getFontFamily: (variant?: FontVariant) => string;
  isFontLoaded: boolean;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

interface FontProviderProps {
  children: React.ReactNode;
  defaultFont?: FontVariant;
}

export const FontProvider: React.FC<FontProviderProps> = ({ 
  children, 
  defaultFont = 'PRIMARY' 
}) => {
  const [currentFont, setCurrentFont] = useState<FontVariant>(defaultFont);
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  // Check if fonts are loaded
  useEffect(() => {
    const checkFontsLoaded = async () => {
      try {
        // Check if Patrick Hand is loaded
        await document.fonts.load('16px "Patrick Hand"');
        // Check if Gloria Hallelujah is loaded
        await document.fonts.load('16px "Gloria Hallelujah"');
        setIsFontLoaded(true);
      } catch (error) {
        console.warn('Fonts not loaded yet, using fallbacks');
        setIsFontLoaded(false);
      }
    };

    checkFontsLoaded();
  }, []);

  const getFontFamily = (variant?: FontVariant) => {
    const fontVariant = variant || currentFont;
    return FONT_VARIANTS[fontVariant];
  };

  const value: FontContextType = {
    currentFont,
    setCurrentFont,
    getFontFamily,
    isFontLoaded,
  };

  return (
    <FontContext.Provider value={value}>
      {children}
    </FontContext.Provider>
  );
};

// Hook to use font context
export const useFontContext = () => {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFontContext must be used within a FontProvider');
  }
  return context;
};

// Higher-order component for easy font application
export const withFont = <P extends object>(
  Component: React.ComponentType<P>,
  fontVariant?: FontVariant
) => {
  return (props: P) => {
    const { getFontFamily } = useFontContext();
    const fontStyle = { fontFamily: getFontFamily(fontVariant) };
    
    return (
      <div style={fontStyle}>
        <Component {...props} />
      </div>
    );
  };
};
