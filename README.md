# Leonardo Color Theme Generator

A TypeScript project for generating theme files using Adobe's Leonardo Color tools. This project allows you to define brand colors and generate theme variations (light, dark, etc.) with proper contrast ratios.

## Features

- Generate theme files for multiple brands
- Support for different environments (development, production, staging)
- Global theme configurations (light, dark)
- Automatic contrast ratio calculations
- Type-safe configuration

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
│   ├── constants/      # Global constants
│   ├── scripts/        # Build scripts
│   ├── services/       # Core services
│   ├── themes/         # Theme configurations
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
└── dist/               # Generated output
    └── themes/         # Generated theme files
```

## Usage

### Brand Configuration

Create a brand configuration file in `config/development/brand-name.json`:

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

### Output

Themes are generated in the `dist/themes` directory with the format:
```
dist/themes/
├── brand1-light.json
├── brand1-dark.json
├── brand2-light.json
└── brand2-dark.json
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