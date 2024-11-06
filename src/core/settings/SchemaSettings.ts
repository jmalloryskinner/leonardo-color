import { CssColor } from '@adobe/leonardo-contrast-colors';

/**
 * Valid property types for theme token properties
 */
export type PropertyType = 'color' | 'string' | 'number';

/**
 * Valid property keys derived from PropertyConfigMap
 */
export type PropertyKey = keyof PropertyConfigMap;

/**
 * Base configuration for a theme token property
 * @template T - The type of value this property holds
 */
export interface BasePropertyConfig<T> {
    /** Property name with $ prefix (e.g., '$type') */
    name: string;
    /** Type of the property value */
    type: PropertyType;
    /** Default value for this property */
    defaultValue: T;
    /** Function to format the value to a string */
    format: (value: T) => string;
}

/**
 * Configuration for the type property ($type)
 * Always has a value of 'color'
 */
export interface TypeProperty extends BasePropertyConfig<string> {
    type: 'string';
    defaultValue: 'color';
}

/**
 * Configuration for the value property ($value)
 * Holds the actual color value
 */
export interface ValueProperty extends BasePropertyConfig<CssColor> {
    type: 'color';
}

/**
 * Configuration for the description property ($description)
 * Holds the contrast ratio information
 */
export interface DescriptionProperty extends BasePropertyConfig<number> {
    type: 'string';
}

/**
 * Maps property keys to their specific configurations
 */
export interface PropertyConfigMap {
    type: TypeProperty;
    value: ValueProperty;
    description: DescriptionProperty;
}

/**
 * Complete schema configuration for theme generation
 */
export interface SchemaConfig {
    /** Root path array for nested structure */
    root: string[];
    /** Configuration for token properties */
    properties: {
        /** Order of properties in the output */
        order: PropertyKey[];
        /** Configuration for each property */
        config: PropertyConfigMap;
    };
}

/**
 * Type-safe formatters for converting values to strings
 */
const formatters = {
    color: (value: CssColor): string => value,
    string: (value: string): string => value,
    contrast: (value: number): string => `${value}:1 against background`
} as const;

/**
 * Default schema configuration
 * Follows Design Tokens format
 */
export const defaultSchema: SchemaConfig = {
    root: ['alto', 'prim', '{brandName}', 'color'],
    properties: {
        order: ['type', 'value', 'description'],
        config: {
            type: {
                name: '$type',
                type: 'string',
                defaultValue: 'color',
                format: formatters.string
            },
            value: {
                name: '$value',
                type: 'color',
                defaultValue: '' as CssColor,
                format: formatters.color
            },
            description: {
                name: '$description',
                type: 'string',
                defaultValue: 0,
                format: formatters.contrast
            }
        }
    }
};
