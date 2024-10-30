import { ThemeConfig } from '../types/theme.js';

type ThemeVariant = Pick<ThemeConfig, 'lightness' | 'contrast' | 'saturation'>;

export const themes: Record<string, ThemeVariant> = {
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
