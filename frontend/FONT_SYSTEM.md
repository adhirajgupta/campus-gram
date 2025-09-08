# Font System Documentation

This document describes the comprehensive font system implemented for Campus Gram, featuring Patrick Hand and Gloria Hallelujah fonts.

## Overview

The font system provides multiple ways to use fonts throughout the application:
- **Patrick Hand**: Primary font for main content
- **Gloria Hallelujah**: Secondary font for accents and special elements
- **MTF Jude**: Legacy font (kept for backward compatibility)

## Quick Start

### 1. Using Font Components

```tsx
import { Font, Header, Body, Accent } from '../components/Font';

// Using the main Font component
<Font variant="PRIMARY" size="LG" weight="BOLD">Hello World</Font>

// Using preset components
<Header>My Title</Header>
<Body>My content</Body>
<Accent>Special text</Accent>
```

### 2. Using the useFonts Hook

```tsx
import { useFonts } from '../hooks/useFonts';

function MyComponent() {
  const fonts = useFonts();
  
  return (
    <div style={fonts.primary}>
      <h1 style={fonts.header}>Title</h1>
      <p style={fonts.body}>Content</p>
    </div>
  );
}
```

### 3. Using CSS Classes

```tsx
<div className="font-primary">Primary font content</div>
<div className="font-secondary">Secondary font content</div>
<div className="font-legacy">Legacy font content</div>
```

## Font Variants

| Variant | Font Family | Use Case |
|---------|-------------|----------|
| `PRIMARY` | Patrick Hand | Main content, headers, body text |
| `SECONDARY` | Gloria Hallelujah | Accents, special elements, display text |
| `LEGACY` | MTF Jude | Backward compatibility |

## Font Presets

| Preset | Font | Size | Weight | Use Case |
|--------|------|------|--------|----------|
| `HEADER` | Patrick Hand | 2xl | Bold | Main headers |
| `SUBHEADER` | Patrick Hand | lg | Semibold | Subheaders |
| `BODY` | Patrick Hand | base | Normal | Body text |
| `ACCENT` | Gloria Hallelujah | base | Normal | Special elements |
| `BUTTON` | Patrick Hand | base | Semibold | Button text |
| `SMALL` | Patrick Hand | sm | Normal | Small text |
| `DISPLAY` | Gloria Hallelujah | 4xl | Bold | Large display text |

## API Reference

### Font Component

```tsx
interface FontProps {
  children: React.ReactNode;
  variant?: FontVariant;        // 'PRIMARY' | 'SECONDARY' | 'LEGACY'
  preset?: FontPreset;          // 'HEADER' | 'SUBHEADER' | 'BODY' | etc.
  size?: FontSize;              // 'XS' | 'SM' | 'BASE' | 'LG' | etc.
  weight?: FontWeight;          // 'NORMAL' | 'MEDIUM' | 'SEMIBOLD' | etc.
  className?: string;
  style?: React.CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}
```

### useFonts Hook

```tsx
const fonts = useFonts();

// Available properties:
fonts.primary        // Primary font style object
fonts.secondary      // Secondary font style object
fonts.legacy         // Legacy font style object
fonts.header         // Header preset style object
fonts.subheader      // Subheader preset style object
fonts.body           // Body preset style object
fonts.accent         // Accent preset style object
fonts.button         // Button preset style object
fonts.small          // Small preset style object
fonts.display        // Display preset style object
fonts.getFont(variant)           // Get font style by variant
fonts.getFontWithProps(variant, size, weight)  // Get font with custom props
fonts.getPreset(preset)          // Get preset style
```

### CSS Classes

```css
.font-primary        /* Patrick Hand */
.font-secondary      /* Gloria Hallelujah */
.font-legacy         /* MTF Jude */
.font-patrick-hand   /* Patrick Hand (direct) */
.font-gloria         /* Gloria Hallelujah (direct) */
.font-mtf-jude       /* MTF Jude (direct) */
```

## Migration Guide

### From MTF Jude to New Fonts

1. **Replace inline styles:**
   ```tsx
   // Old
   <div style={{ fontFamily: 'MTF Jude, cursive' }}>
   
   // New
   <div style={fonts.primary}>
   // or
   <Font variant="PRIMARY">
   ```

2. **Update existing components:**
   ```tsx
   // Old
   <h1 style={{ fontFamily: 'MTF Jude, cursive' }}>Title</h1>
   
   // New
   <Header>Title</Header>
   ```

3. **Replace CSS classes:**
   ```tsx
   // Old
   <div className="font-[MTF_Jude]">
   
   // New
   <div className="font-primary">
   ```

## Best Practices

1. **Use presets when possible** - They provide consistent styling
2. **Primary font for content** - Use Patrick Hand for most text
3. **Secondary font for accents** - Use Gloria Hallelujah sparingly for special elements
4. **Consistent sizing** - Use the predefined font sizes
5. **Accessibility** - Ensure sufficient contrast and readability

## Examples

### Post Component
```tsx
function Post({ title, content, author }) {
  return (
    <div className="p-4 border rounded-lg">
      <Header>{title}</Header>
      <Body className="mt-2">{content}</Body>
      <Small className="mt-2 text-gray-500">by {author}</Small>
    </div>
  );
}
```

### Button Component
```tsx
function CustomButton({ children, variant = 'primary' }) {
  return (
    <button className={`px-4 py-2 rounded-lg ${variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
      <Button>{children}</Button>
    </button>
  );
}
```

### Study Group Card
```tsx
function StudyGroupCard({ name, description, memberCount }) {
  return (
    <div className="p-4 border rounded-lg">
      <Subheader>{name}</Subheader>
      <Body className="mt-2">{description}</Body>
      <Accent className="mt-2">👥 {memberCount} members</Accent>
    </div>
  );
}
```

## Demo Page

Visit `/font-demo` to see all fonts and usage examples in action.

## File Structure

```
frontend/
├── lib/
│   └── fonts.ts              # Font configuration and utilities
├── hooks/
│   └── useFonts.ts           # React hook for font usage
├── components/
│   └── Font.tsx              # Font components
├── contexts/
│   └── FontContext.tsx       # Font context provider
├── pages/
│   └── FontDemo.tsx          # Demo page
└── index.css                 # CSS classes and font imports
```

## Browser Support

- **Patrick Hand**: Supported in all modern browsers
- **Gloria Hallelujah**: Supported in all modern browsers
- **Fallbacks**: Cursive fonts as fallbacks for older browsers

## Performance

- Fonts are loaded via Google Fonts with `display=swap`
- Preconnect headers for faster loading
- Font loading is checked and fallbacks are provided
