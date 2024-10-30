# Leonardo Color Theme Generator

A TypeScript project for generating theme files using Adobe's Leonardo Color tools. This project generates accessible color themes with light and dark variants following a configurable schema.

## Features

- Dynamic schema-based output structure
- Multiple brand support via JSON configuration
- Environment-specific configurations (development, production, staging)
- Automatic light and dark theme generation
- Type-safe configuration and output
- Configurable property prefixes and naming

## Setup

1. Clone the repository
2. Install dependencies:

bash
npm install


## Project Structure

```
project/
├── config/              # Brand configurations
│   ├── development/     # Development environment configs
│   ├── production/      # Production environment configs
│   └── staging/        # Staging environment configs
├── src/
│   ├── brands/         # Brand management
│   ├── schemas/        # Output schema configuration
│   ├── scripts/        # Build scripts
│   ├── services/       # Core services
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
└── dist/               # Generated output
    └── themes/         # Generated theme files
```

## Usage

### Brand Configuration

Create a brand configuration in `config/development/brand-name.json`:

```json
{
    "colors": [
        {
            "name": "blue",
            "colorKeys": ["#5CDBFF", "#0000FF"],
            "ratios": [3, 4.5, 7]
        }
    ],
    "backgroundColor": {
        "name": "gray",
        "colorKeys": ["#cacaca"],
        "ratios": [2, 3, 4.5, 8]
    }
}
```

### Generate Themes

Generate themes for all brands:
```bash
npm run generate:brands
```

Generate themes for specific environments:
```bash
npm run generate:brands:prod    # Production
npm run generate:brands:staging # Staging
```

### Output Structure

Themes are generated following the schema:
```json
{
  "alto": {
    "prim": {
      "colorScale": {
        "blue": {
          "100": {
            "light": {
              "$value": "#5CDBFF",
              "$type": "color",
              "$description": "3:1 against background"
            },
            "dark": {
              "$value": "#0000FF",
              "$type": "color",
              "$description": "3:1 against background"
            }
          }
        }
      }
    }
  }
}
```

## Development

Start the development server with watch mode:

bash
npm run dev


## Testing

Run tests:

bash
npm test


Run tests in watch mode:

bash
npm run test:watch


## Building

Build the project:

bash
npm run build


The compiled output will be in the `dist` directory.

## Technologies

- TypeScript 5.3
- Jest for testing
- ESM (ECMAScript Modules)
- Node.js
- @adobe/leonardo-contrast-colors

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build the project |
| `npm run dev` | Watch mode for development |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run generate:brands` | Generate theme files for all brands |
| `npm run generate:brands:prod` | Generate production theme files |
| `npm run generate:brands:staging` | Generate staging theme files |

## License

MIT
