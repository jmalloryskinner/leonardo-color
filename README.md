# Leonardo Color Theme Generator

A TypeScript project for generating theme files using Adobe's Leonardo Color tools. This project generates accessible color themes with light and dark variants following a configurable schema.

## Features

- Dynamic schema-based output structure
- Multiple brand support via JSON configuration
- Environment-specific configurations (development, production, staging)
- Automatic light and dark theme generation
- Type-safe configuration and output
- Configurable property prefixes and naming
- Robust error handling with custom error types
- Comprehensive logging system using Winston
- Environment-based configuration via dotenv

## Setup

1. Clone the repository
2. Install dependencies:

bash
npm install

3. Create a `.env` file (optional):

env
LOG_LEVEL=info
SCHEMA_ROOT=alto,prim
SCHEMA_COLOR_SCALE=colorScale
```

## Project Structure

```
project/
├── config/              # Brand configurations
│   ├── development/     # Development environment configs
│   ├── production/      # Production environment configs
│   └── staging/        # Staging environment configs
├── src/
│   ├── brands/         # Brand management
│   ├── core/           # Core functionality
│   │   └── settings/   # Configuration settings
│   ├── schemas/        # Output schema configuration
│   ├── scripts/        # Build scripts
│   ├── services/       # Core services
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── dist/               # Generated output
│   └── themes/         # Generated theme files
└── logs/               # Application logs
```

## Usage

### Brand Configuration

Create a brand configuration in `config/development/brand-name.json`:

```json
{
    "colors": [
        {
            "name": "accent",
            "colorKeys": ["#5CDBFF", "#0000FF"],
            "ratios": [3, 4.5, 7]
        }
    ],
    "backgroundColor": {
        "name": "neutral",
        "colorKeys": ["#cacaca"],
        "ratios": [2, 3, 4.5, 8, 12]
    }
}
```

### Generate Themes

Generate themes for all brands:
```bash
npm run generate
```

### Development

Start the development server with watch mode:
```bash
npm run dev
```

Format code:
```bash
npm run format
```

Lint code:
```bash
npm run lint
```

### Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Error Handling

The application uses custom error types for better error handling:

```typescript
try {
    const config = configLoader.loadBrandConfig('brand1');
} catch (error) {
    if (error instanceof ConfigError) {
        logger.error(`Configuration error: ${error.message}`, { code: error.code });
    }
}
```

## Logging

The application uses Winston for logging with different levels:

```typescript
logger.info('Processing theme', { brandName: 'example' });
logger.error('Failed to load config', { error: 'File not found' });
```

Log files are generated in:
- `error.log`: Error-level messages
- `combined.log`: All log levels

## Technologies

- TypeScript 5.3
- Jest for testing
- ESM (ECMAScript Modules)
- Node.js
- Winston for logging
- Dotenv for environment configuration
- ESLint & Prettier for code quality
- Husky for git hooks
- @adobe/leonardo-contrast-colors

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build the project |
| `npm run dev` | Watch mode for development |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run generate` | Generate theme files |
| `npm run lint` | Lint TypeScript files |
| `npm run format` | Format code with Prettier |

## License

MIT
