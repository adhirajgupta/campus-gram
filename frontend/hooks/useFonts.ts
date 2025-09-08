import { useMemo } from 'react';
import { 
  FONT_VARIANTS, 
  FONT_PRESETS, 
  getFontStyle, 
  getFontStyleWithProps,
  type FontVariant,
  type FontSize,
  type FontWeight,
  type FontPreset
} from '../lib/fonts';

// Hook for easy font usage in components
export const useFonts = () => {
  const fontStyles = useMemo(() => ({
    // Get font style by variant
    getFont: (variant: FontVariant) => getFontStyle(variant),
    
    // Get font style with size and weight
    getFontWithProps: (variant: FontVariant, size?: FontSize, weight?: FontWeight) => 
      getFontStyleWithProps(variant, size, weight),
    
    // Get predefined font presets
    getPreset: (preset: FontPreset) => FONT_PRESETS[preset],
    
    // Quick access to common font variants
    primary: getFontStyle('PRIMARY'),
    secondary: getFontStyle('SECONDARY'),
    legacy: getFontStyle('LEGACY'),
    
    // Quick access to common presets
    header: FONT_PRESETS.HEADER,
    subheader: FONT_PRESETS.SUBHEADER,
    body: FONT_PRESETS.BODY,
    accent: FONT_PRESETS.ACCENT,
    button: FONT_PRESETS.BUTTON,
    small: FONT_PRESETS.SMALL,
    display: FONT_PRESETS.DISPLAY,
  }), []);

  return fontStyles;
};

// Hook for getting font class names (for Tailwind CSS)
export const useFontClasses = () => {
  const fontClasses = useMemo(() => ({
    // Font family classes
    primary: 'font-[Patrick_Hand]',
    secondary: 'font-[Gloria_Hallelujah]',
    legacy: 'font-[MTF_Jude]',
    
    // Combined classes for common use cases
    header: 'font-[Patrick_Hand] text-2xl font-bold',
    subheader: 'font-[Patrick_Hand] text-lg font-semibold',
    body: 'font-[Patrick_Hand] text-base font-normal',
    accent: 'font-[Gloria_Hallelujah] text-base font-normal',
    button: 'font-[Patrick_Hand] text-base font-semibold',
    small: 'font-[Patrick_Hand] text-sm font-normal',
    display: 'font-[Gloria_Hallelujah] text-4xl font-bold',
  }), []);

  return fontClasses;
};
