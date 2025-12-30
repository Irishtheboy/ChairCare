# Logo Placeholder

This directory is ready for your Chair Care logo files.

## Recommended Logo Files:

1. **logo-light.png** - Logo for light mode (dark text/elements)
2. **logo-dark.png** - Logo for dark mode (light text/elements)
3. **logo-icon.png** - Icon only version for small spaces
4. **logo-full.png** - Full logo with text for headers

## Recommended Specifications:

- **Format**: PNG with transparent background
- **Size**: 
  - Full logo: 300x80px (or similar aspect ratio)
  - Icon only: 64x64px or 128x128px
- **Quality**: High resolution for crisp display on all devices

## Usage:

Once you add the logo files, update the Logo component in `src/components/ui/Logo.tsx` to use the actual image files instead of the current SVG-based design.

Example update:
```typescript
// Replace the current SVG chair icon with:
<img 
  src={`/logo-${variant}.png`} 
  alt="Chair Care Logo" 
  width={logoWidth} 
  height={logoHeight} 
/>
```