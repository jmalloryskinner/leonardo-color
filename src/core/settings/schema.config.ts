export interface SchemaConfig {
    root: string[];
    colorScale: string;
    variants: Record<string, string>;
    prefixes: Record<string, string>;
}

export const defaultSchema: SchemaConfig = {
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
};
