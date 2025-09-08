// Font configuration and utilities
export const FONTS = {
  // Hand-drawn fonts
  PATRICK_HAND: 'Patrick Hand, cursive',
  GLORIA_HALLELUJAH: 'Gloria Hallelujah, cursive',
  
  // Existing fonts
  MTF_JUDE: 'MTF Jude, cursive',
  
  // Fallback fonts
  CURSIVE: 'cursive',
  SANS_SERIF: 'sans-serif',
} as const;

// Font variants for different use cases
export const FONT_VARIANTS = {
  // Primary hand-drawn font for main content
  PRIMARY: FONTS.PATRICK_HAND,
  
  // Secondary hand-drawn font for accents and special elements
  SECONDARY: FONTS.GLORIA_HALLELUJAH,
  
  // Legacy font (keeping for backward compatibility)
  LEGACY: FONTS.MTF_JUDE,
  
  // System fallback
  FALLBACK: FONTS.CURSIVE,
} as const;

// Font size presets
export const FONT_SIZES = {
  XS: 'text-xs',
  SM: 'text-sm',
  BASE: 'text-base',
  LG: 'text-lg',
  XL: 'text-xl',
  '2XL': 'text-2xl',
  '3XL': 'text-3xl',
  '4XL': 'text-4xl',
  '5XL': 'text-5xl',
  '6XL': 'text-6xl',
} as const;

// Font weight presets
export const FONT_WEIGHTS = {
  NORMAL: 'font-normal',
  MEDIUM: 'font-medium',
  SEMIBOLD: 'font-semibold',
  BOLD: 'font-bold',
  EXTRABOLD: 'font-extrabold',
} as const;

// Utility function to get font style object
export const getFontStyle = (font: keyof typeof FONT_VARIANTS) => ({
  fontFamily: FONT_VARIANTS[font],
});

// Utility function to get font style with size and weight
export const getFontStyleWithProps = (
  font: keyof typeof FONT_VARIANTS,
  size?: keyof typeof FONT_SIZES,
  weight?: keyof typeof FONT_WEIGHTS
) => ({
  fontFamily: FONT_VARIANTS[font],
  ...(size && { fontSize: FONT_SIZES[size] }),
  ...(weight && { fontWeight: FONT_WEIGHTS[weight] }),
});

// Common font combinations for different UI elements
export const FONT_PRESETS = {
  // Headers and titles
  HEADER: {
    fontFamily: FONT_VARIANTS.PRIMARY,
    fontSize: 'text-2xl',
    fontWeight: 'font-bold',
  },
  
  // Subheaders
  SUBHEADER: {
    fontFamily: FONT_VARIANTS.PRIMARY,
    fontSize: 'text-lg',
    fontWeight: 'font-semibold',
  },
  
  // Body text
  BODY: {
    fontFamily: FONT_VARIANTS.PRIMARY,
    fontSize: 'text-base',
    fontWeight: 'font-normal',
  },
  
  // Accent text (special elements)
  ACCENT: {
    fontFamily: FONT_VARIANTS.SECONDARY,
    fontSize: 'text-base',
    fontWeight: 'font-normal',
  },
  
  // Button text
  BUTTON: {
    fontFamily: FONT_VARIANTS.PRIMARY,
    fontSize: 'text-base',
    fontWeight: 'font-semibold',
  },
  
  // Small text
  SMALL: {
    fontFamily: FONT_VARIANTS.PRIMARY,
    fontSize: 'text-sm',
    fontWeight: 'font-normal',
  },
  
  // Large display text
  DISPLAY: {
    fontFamily: FONT_VARIANTS.SECONDARY,
    fontSize: 'text-4xl',
    fontWeight: 'font-bold',
  },
} as const;

// Type definitions for better TypeScript support
export type FontVariant = keyof typeof FONT_VARIANTS;
export type FontSize = keyof typeof FONT_SIZES;
export type FontWeight = keyof typeof FONT_WEIGHTS;
export type FontPreset = keyof typeof FONT_PRESETS;
