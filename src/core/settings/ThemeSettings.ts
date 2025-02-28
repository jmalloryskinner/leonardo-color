/**
 * Configuration for a theme variant
 * Defines how colors are transformed for different themes (light/dark)
 */
export interface ThemeVariantConfig {
    /** Base lightness value for the theme (0-100) */
    lightness: number;
    /** Contrast multiplier for the theme */
    contrast: number;
    /** Saturation multiplier for the theme (0-100) */
    saturation: number;
}

/**
 * Available theme variants
 * Used to generate type-safe theme variant keys
 */
export const THEME_VARIANTS = ['light', 'dark'] as const;

/**
 * Type-safe theme variant names
 * Generated from THEME_VARIANTS const array
 */
export type ThemeVariantType = typeof THEME_VARIANTS[number];

/**
 * Complete theme configuration
 * Defines all available theme variants and the default theme
 */
export interface ThemeConfig {
    /** Map of theme variants and their configurations */
    variants: Record<ThemeVariantType, ThemeVariantConfig>;
    /** Default theme variant to use when none specified */
    defaultVariant: ThemeVariantType;
}

/**
 * Default theme configurations
 * Provides base settings for light and dark themes
 */
export const defaultThemes: ThemeConfig = {
    variants: {
        light: {
            lightness: 100,  // Maximum lightness for light theme
            contrast: 1,     // Standard contrast
            saturation: 100  // Full saturation
        },
        dark: {
            lightness: 0,    // Minimum lightness for dark theme
            contrast: 1.1,   // Increased contrast for better readability
            saturation: 100   // Slightly reduced saturation
        }
    },
    defaultVariant: 'light'
}; 