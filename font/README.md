# Persian Fonts for Kooreh App

This folder contains Persian fonts optimized for the Kooreh web application.

## Required Fonts

### Vazir Font Family
- **Vazir.woff2** - Regular weight (400)
- **Vazir-Bold.woff2** - Bold weight (700)
- **Vazir-Light.woff2** - Light weight (300)

### IranSans Font Family
- **IranSans.woff2** - Regular weight (400)
- **IranSans-Bold.woff2** - Bold weight (700)

## Download Instructions

### Option 1: Download from Official Sources
1. **Vazir Font**: Visit [Vazir Font GitHub](https://github.com/rastikerdar/vazir-font)
2. **IranSans Font**: Visit [IranSans Font](https://fontiran.com/fonts/iran-sans/)

### Option 2: Use Google Fonts (Fallback)
If you prefer to use Google Fonts as a fallback, the CSS already includes Vazirmatn as a backup.

## Font Features
- **RTL Support**: All fonts support right-to-left text direction
- **Persian Characters**: Optimized for Persian/Arabic script
- **Multiple Weights**: Light, Regular, and Bold variants
- **Web Optimized**: WOFF2 format for better performance

## CSS Integration
The fonts are already integrated into the CSS with proper fallbacks:

```css
--font-family: 'Vazir', 'Vazirmatn', 'Tahoma', 'Arial', sans-serif;
--font-family-secondary: 'IranSans', 'Vazir', 'Tahoma', 'Arial', sans-serif;
```

## Performance Notes
- WOFF2 format provides the best compression
- Font-display: swap ensures text remains visible during font loading
- Fallback fonts ensure content is always readable
