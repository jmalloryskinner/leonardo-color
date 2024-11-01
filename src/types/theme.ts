import { Theme, Color, BackgroundColor, CssColor } from '@adobe/leonardo-contrast-colors';

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

// Theme configuration extends brand config with theme options
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

export interface ThemeOutput {
    theme: Theme;
    colors: ContrastColors;
}
