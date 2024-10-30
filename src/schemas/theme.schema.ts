export interface SchemaFormatter {
    description: (contrast: number) => string;
    colorType: 'color';  // Enforce literal type
}

export interface SchemaStructure {
    root: string[];        // Path to root elements ['alto', 'prim']
    colorScale: string;    // Path to color scale 'colorScale'
    variants: {
        [key: string]: string;  // Allow dynamic variants
    };
    prefixes: {
        [key: string]: string;  // Allow dynamic prefixes
    };
}

export interface ThemeSchema {
    structure: SchemaStructure;
    formatters: SchemaFormatter;
}

export const themeSchema: ThemeSchema = {
    structure: {
        root: ['alto', 'prim'],
        colorScale: 'colorScale',
        variants: {
            light: 'light',
            dark: 'dark'
        },
        prefixes: {
            value: '$',
            type: '$',
            description: '$'
        }
    },
    formatters: {
        description: (contrast: number) => `${contrast}:1 against background`,
        colorType: 'color'
    }
};
