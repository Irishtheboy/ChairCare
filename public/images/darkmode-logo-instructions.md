# Dark Mode Logo Instructions

## Current Status
- ✅ Light mode logo: `lightmode.jpeg` (configured)
- ⚠️ Dark mode logo: Using CSS filters (temporary solution)

## To Add a Proper Dark Mode Logo

1. **Create a dark mode version** of your logo:
   - Save it as `darkmode.jpeg` in this directory
   - Should work well on dark backgrounds
   - Consider using lighter colors or white elements

2. **Update the Logo components** to use both versions:
   ```tsx
   <Logo 
     variant={mode} 
     size="lg" 
     showText={true}
     customLogo="/images/lightmode.jpeg"
     customLogoDark="/images/darkmode.jpeg"
     customLogoAlt="Chair Care Logo"
   />
   ```

## Current Temporary Solution
The system currently applies CSS filters to your light mode logo in dark theme:
- Increases brightness slightly
- Adds a subtle white glow
- Improves contrast on dark backgrounds

## Files to Update (if you add darkmode.jpeg)
- `src/pages/login.tsx`
- `src/components/ui/Footer.tsx`
- `src/components/ui/Layout.tsx`
- `src/components/ui/HeroSection.tsx`
- `src/pages/request-access.tsx`

## Recommended Dark Mode Logo Characteristics
- Lighter version of your logo
- Good contrast on dark backgrounds
- Same dimensions as light mode version
- PNG format with transparency (if possible)