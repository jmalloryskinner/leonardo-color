import { CssColor, Theme } from '@adobe/leonardo-contrast-colors';
import { BasePropertyConfig } from '../core/settings/SchemaSettings.js';
import { ThemeVariantType } from '../core/settings/ThemeSettings.js';

/**
 * Configuration for a single color in the theme
 * @property name - Unique identifier for the color
 * @property colorKeys - Array of hex color values defining the color scale
 * @property ratios - Array of contrast ratios to generate
 * @property colorspace - Optional colorspace for the color scale
 * @property smooth - Optional smoothing flag for the color scale
 * @property options - Optional additional options for the color scale
 */
export interface ColorConfig {
    name: string;
    colorKeys: CssColor[];
    ratios: number[];
    colorspace?: string;
    smooth?: boolean;
    options?: Record<string, unknown>;
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
 * @property options - Optional additional options for the theme
 */
export interface ThemeConfig extends BrandConfig {
    options?: {
        variant?: ThemeVariantType;
        properties?: Record<string, BasePropertyConfig<unknown>>;
        [key: string]: unknown;
    };
}

// Output types
export interface ContrastColorValue {
    value: CssColor;
    contrast: number;
    metadata?: Record<string, unknown>;
}

export interface ContrastColorBackground {
    background: CssColor;
}

export interface ContrastColor {
    name: string;
    values: ContrastColorValue[];
    options?: Record<string, unknown>;
}

export type ContrastColors = [ContrastColorBackground, ...ContrastColor[]];

/**
 * Output format for generated themes
 * @property theme - Leonardo Theme instance
 * @property colors - Generated color values
 * @property metadata - Optional additional metadata for the theme
 */
export interface ThemeOutput {
    theme: Theme;
    colors: ContrastColors;
    metadata?: Record<string, unknown>;
}

// Combine related types
export interface ThemeColorStep {
    light: ThemeColorValue;
    dark: ThemeColorValue;
}

export interface ThemeColorValue {
    $type: string;
    $value: string;
    $description: string;
}

// Schema types
export interface ThemeSchema {
    [root: string]: {
        [tokens: string]: {
            [colorScale: string]: {
                [colorName: string]: {
                    [step: string]: {
                        [variant: string]: {
                            $type: string;
                            $value: string;
                            $description: string;
                        };
                    };
                };
            };
        };
    };
}
