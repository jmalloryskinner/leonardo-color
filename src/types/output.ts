export interface ColorThemeVariant {
    [key: `$${string}`]: string;  // Allow dynamic prefixed properties
}

export interface ColorStep {
    [key: string]: ColorThemeVariant;  // Allow dynamic theme variants (light, dark, etc.)
}

export interface ColorScale {
    [colorName: string]: {
        [step: string]: ColorStep;
    };
}

// Make the output structure dynamic based on schema
export type ThemeOutput = {
    [K in string]: {
        [L in string]: {
            [M in string]: ColorScale;
        };
    };
};
