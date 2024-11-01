import { Theme, CssColor } from '@adobe/leonardo-contrast-colors';

/**
 * Configuration for a single color in the theme
 * @property name - Unique identifier for the color
 * @property colorKeys - Array of hex color values defining the color scale
 * @property ratios - Array of contrast ratios to generate
 */
export interface ColorConfig {
    name: string;
    colorKeys: CssColor[];
    ratios: number[];
}

// Brand configuration
export interface BrandConfig {
    colors: ColorConfig[];
    backgroundColor: ColorConfig;
}

/**
 * Configuration for generating a color theme
 * @property colors - Array of color configurations
 * @property backgroundColor - Background color configuration
 * @property lightness - Theme lightness value (0-100)
 * @property contrast - Optional contrast multiplier
 * @property saturation - Optional saturation value (0-100)
 */
export interface ThemeConfig extends BrandConfig {
    lightness: number;
    contrast?: number;
    saturation?: number;
}

// Output types
export interface ContrastColorValue {
    name: string;
    contrast: number;
    value: CssColor;
}

export interface ContrastColorBackground {
    background: CssColor;
}

export interface ContrastColor {
    name: string;
    values: ContrastColorValue[];
}

export type ContrastColors = [ContrastColorBackground, ...ContrastColor[]];

/**
 * Output format for generated themes
 * @property theme - Leonardo Theme instance
 * @property colors - Generated color values
 */
export interface ThemeOutput {
    theme: Theme;
    colors: ContrastColors;
}
