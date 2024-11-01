export interface ThemeVariant {
    lightness: number;
    contrast: number;
    saturation: number;
}

export const defaultThemes: Record<string, ThemeVariant> = {
    light: {
        lightness: 100,
        contrast: 1,
        saturation: 100
    },
    dark: {
        lightness: 0,
        contrast: 1,
        saturation: 100
    }
}; 