# Leonardo Color

A TypeScript project for color manipulation using Adobe's Leonardo Color tools.

## Setup

1. Clone the repository
2. Install dependencies:

bash
npm install


## Development

Start the development server with watch mode:

bash
npm run dev


## Testing

Run tests in watch mode:

bash
npm run test:watch


## Building

Build the project:

bash
npm run build


The compiled output will be in the `dist` directory.

## Project Structure
project-root/
├── src/
│ ├── index.ts # Main entry point
│ ├── types/ # Type definitions
│ ├── utils/ # Utility functions
│ ├── services/ # Business logic
│ └── tests/ # Test files
└── dist/ # Compiled output


## Technologies

- TypeScript 5.3
- Jest for testing
- ESM (ECMAScript Modules)
- Node.js

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build the project |
| `npm run dev` | Watch mode for development |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |

## License

MIT

## Features

- Color contrast generation using @adobe/leonardo-contrast-colors
- Generate accessible color palettes
- ESM-based TypeScript architecture

## Usage
