# Custom Icons

This folder contains custom icons for the Chair Care application.

## Organization

- `/svg/` - SVG icon files
- `/png/` - PNG icon files  
- `/ico/` - ICO icon files
- `/components/` - React icon components

## Usage

### SVG Icons
Place your custom SVG icons in the `/svg/` folder. You can reference them in your components like:

```jsx
<img src="/icons/svg/chair-icon.svg" alt="Chair" />
```

### React Icon Components
Create reusable React components in the `/components/` folder for complex icons:

```jsx
import { ChairIcon } from '/icons/components/ChairIcon';

<ChairIcon size={24} color="#0ea5e9" />
```

## Naming Convention

Use kebab-case for file names:
- `chair-repair.svg`
- `qr-scanner.svg` 
- `technician-tools.svg`
- `dashboard-panel.svg`

## Recommended Sizes

- Small icons: 16x16, 20x20, 24x24
- Medium icons: 32x32, 48x48
- Large icons: 64x64, 96x96, 128x128