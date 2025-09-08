import React from 'react';
import { 
  FONT_PRESETS, 
  getFontStyle, 
  getFontStyleWithProps,
  type FontVariant,
  type FontSize,
  type FontWeight,
  type FontPreset
} from '../lib/fonts';

interface FontProps {
  children: React.ReactNode;
  variant?: FontVariant;
  preset?: FontPreset;
  size?: FontSize;
  weight?: FontWeight;
  className?: string;
  style?: React.CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

export const Font: React.FC<FontProps> = ({
  children,
  variant,
  preset,
  size,
  weight,
  className = '',
  style = {},
  as: Component = 'span',
}) => {
  let fontStyle: React.CSSProperties = {};

  if (preset) {
    // Use predefined preset
    fontStyle = FONT_PRESETS[preset];
  } else if (variant) {
    // Use variant with optional size and weight
    fontStyle = getFontStyleWithProps(variant, size, weight);
  } else {
    // Default to primary font
    fontStyle = getFontStyle('PRIMARY');
  }

  const combinedStyle = {
    ...fontStyle,
    ...style,
  };

  return (
    <Component 
      className={className}
      style={combinedStyle}
    >
      {children}
    </Component>
  );
};

// Convenience components for common use cases
export const Header: React.FC<Omit<FontProps, 'preset'>> = (props) => (
  <Font {...props} preset="HEADER" />
);

export const Subheader: React.FC<Omit<FontProps, 'preset'>> = (props) => (
  <Font {...props} preset="SUBHEADER" />
);

export const Body: React.FC<Omit<FontProps, 'preset'>> = (props) => (
  <Font {...props} preset="BODY" />
);

export const Accent: React.FC<Omit<FontProps, 'preset'>> = (props) => (
  <Font {...props} preset="ACCENT" />
);

export const Button: React.FC<Omit<FontProps, 'preset'>> = (props) => (
  <Font {...props} preset="BUTTON" />
);

export const Small: React.FC<Omit<FontProps, 'preset'>> = (props) => (
  <Font {...props} preset="SMALL" />
);

export const Display: React.FC<Omit<FontProps, 'preset'>> = (props) => (
  <Font {...props} preset="DISPLAY" />
);

// Export all components
export default Font;
