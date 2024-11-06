# Leonardo Color Theme Generator

A type-safe theme generator built on top of Adobe's Leonardo Color, designed to create accessible color themes with support for light, dark, and dim variants.

## Features

- 🎨 **Dynamic Theme Generation**: Create color themes with multiple variants (light/dark/dim)
- ♿ **Accessibility First**: Built-in contrast ratio validation and WCAG compliance
- 🔄 **Flexible Output**: Configurable Design Token format
- 🛡️ **Type Safety**: Full TypeScript support with strict type checking
- ⚙️ **Customizable**: Extensible configuration system for properties and formats
- 🧪 **Well Tested**: Comprehensive test suite with Jest

## Installation

```bash
npm install leonardo-color-theme-generator
```

## Quick Start

1. Create a theme configuration:

```typescript
import { ThemeConfig } from 'leonardo-color-theme-generator';

const config: ThemeConfig = {
    colors: [{
        name: 'primary',
        colorKeys: ['#2D6BFF', '#1635FF'],
        ratios: [3, 4.5, 7]
    }],
    backgroundColor: {
        name: 'background',
        colorKeys: ['#FFFFFF'],
        ratios: [1]
    }
};
```

2. Generate your theme:

```typescript
import { generateThemeFile } from 'leonardo-color-theme-generator';

generateThemeFile('my-theme', config);
```

## Output Format

The generator creates a Design Tokens compatible JSON file:

```json
{
  "design": {
    "tokens": {
      "colors": {
        "primary": {
          "100": {
            "light": {
              "$type": "color",
              "$value": "#3f95ff",
              "$description": "3:1 against background"
            },
            "dark": {
              "$type": "color",
              "$value": "#3162a1",
              "$description": "3.4:1 against background"
            }
          }
        }
      }
    }
  }
}
```

## Configuration

### Theme Variants

Configure different theme variants in `ThemeSettings.ts`:

```typescript
export const defaultThemes: ThemeConfig = {
    variants: {
        light: {
            lightness: 100,
            contrast: 1,
            saturation: 100
        },
        dark: {
            lightness: 0,
            contrast: 1.2,
            saturation: 90
        }
    },
    defaultVariant: 'light'
};
```

### Schema Configuration

Customize the output format in `SchemaSettings.ts`:

```typescript
export const defaultSchema: SchemaConfig = {
    root: ['design', 'tokens'],
    colorScale: 'colors',
    properties: {
        order: ['type', 'value', 'description'],
        config: {
            // Property configurations
        }
    }
};
```

## Environment Variables

- `SCHEMA_ROOT`: Override the root path (comma-separated)
- `SCHEMA_COLOR_SCALE`: Override the color scale key
- `THEME_VARIANTS`: Override theme variant configurations (JSON)

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Generate themes
npm run generate
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built on [Adobe's Leonardo Color](https://github.com/adobe/leonardo)
- Inspired by Design Tokens format
