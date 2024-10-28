export interface ThemeConfig {
    lightness: number;
    contrast?: number;
    saturation?: number;
}

export const themes: Record<string, ThemeConfig> = {
    light: {
        lightness: 100,
        contrast: 1,
        saturation: 100
    },
    dark: {
        lightness: 0,  // 0% lightness for dark theme
        contrast: 1,
        saturation: 100
    }
};
