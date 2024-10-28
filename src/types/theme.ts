import { Theme, Color, BackgroundColor, CssColor } from '@adobe/leonardo-contrast-colors';

// Base color configuration
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
