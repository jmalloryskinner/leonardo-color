import { InterpolationMode } from 'chroma-js';
import { CssColor } from '@adobe/leonardo-contrast-colors';

/**
 * Generic validation result interface
 * Used for validating configurations and inputs
 * @template T - Type of validation errors/warnings (defaults to string[])
 */
export interface ValidationResult<T = string[]> {
    /** Whether validation passed */
    isValid: boolean;
    /** Array of validation errors */
    errors: T;
    /** Optional array of validation warnings */
    warnings?: T;
    /** Optional metadata about the validation */
    metadata?: Record<string, unknown>;
}

/**
 * Configuration options for color scale generation
 * @template T - Type of interpolation mode (defaults to chroma-js InterpolationMode)
 */
export interface ColorScaleOptions<T = InterpolationMode> {
    /** Number of color swatches to generate */
    swatches: number;
    /** Base colors for interpolation */
    colorKeys: CssColor[];
    /** Color space for interpolation */
    colorspace: T;
    /** Whether to apply smoothing */
    smooth: boolean;
    /** Additional options */
    options?: {
        /** Optional interpolation mode override */
        interpolation?: T;
        /** Additional configuration options */
        [key: string]: unknown;
    };
}

/**
 * Represents a single step in the theme color scale
 * Contains dynamic property types for flexibility
 */
export interface ColorStepValue {
    [key: string]: {
        /** Type of the value (e.g., 'color') */
        $type: string;
        /** The actual color value */
        $value: CssColor;
        /** Description (usually contrast ratio) */
        $description: string;
        /** Optional metadata */
        metadata?: Record<string, unknown>;
    };
}

/**
 * Output format for color scales
 * Represents the complete color scale structure with variants
 * Example:
 * {
 *   "primary": {
 *     "100": {
 *       "light": { "$type": "color", "$value": "#fff", ... },
 *       "dark": { "$type": "color", "$value": "#000", ... }
 *     }
 *   }
 * }
 */
export interface ColorScaleOutput {
    /** Color name mapping */
    [colorName: string]: {
        /** Step number mapping (e.g., "100", "200") */
        [step: string]: {
            /** Theme variant mapping (e.g., "light", "dark") */
            [variant: string]: Record<string, string>;
        };
    };
} 