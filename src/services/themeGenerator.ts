import { Theme, Color, BackgroundColor, CssColor, InterpolationColorspace } from '@adobe/leonardo-contrast-colors';
import { SettingsManager } from '../core/SettingsManager.js';
import { 
    ThemeConfig, 
    ContrastColors, 
    ThemeOutput, 
    ContrastColor,
    ContrastColorValue,
    ColorConfig
} from '../types/theme.js';
import { ColorGenerationError } from '../types/errors.js';
import { ValidationResult, ColorScaleOutput } from '../types/validation.js';
import { validateColor } from '../utils/colorUtils.js';
import { logger } from '../utils/logger.js';
import { benchmark } from '../utils/benchmark.js';
import { ThemeVariantType, ThemeVariantConfig } from '../core/settings/ThemeSettings.js';
import { SchemaConfig } from '../core/settings/SchemaSettings.js';
import path from 'path';
import fs from 'fs';
import { DESIGN_TOKENS_DIRECTORY } from '../constants/index.js';

/**
 * Type definitions for property value handling
 */
type PropertyValues = {
    type: string;
    value: CssColor;
    description: number;
};

/**
 * Type guard to check if a key is a valid property key
 * @param key - The key to check
 * @returns True if the key is a valid property key
 */
function isPropertyKey(key: string): key is keyof PropertyValues {
    const validKeys: Array<keyof PropertyValues> = ['type', 'value', 'description'];
    return validKeys.includes(key as keyof PropertyValues);
}

/**
 * Gets the appropriate value for a property based on its key
 * @param key - The property key
 * @param value - The contrast color value
 * @returns The formatted property value
 */
function getPropertyValue(key: keyof PropertyValues, value: ContrastColorValue): PropertyValues[keyof PropertyValues] {
    switch (key) {
        case 'type':
            return 'color';
        case 'value':
            return value.value;
        case 'description':
            return value.contrast;
        default:
            throw new Error(`Invalid property key: ${String(key)}`);
    }
}

/**
 * Generates and manages color themes using Adobe's Leonardo Color
 * Handles theme generation, validation, and file output
 */
export class ThemeGenerator {
    #settings: SettingsManager;
    #outputDir: string;
    #colorScaleCache = new Map<string, ColorScaleOutput>();

    /**
     * Creates a new ThemeGenerator instance
     * @param outputDir - Directory for generated theme files
     */
    constructor(outputDir = 'dist') {
        this.#settings = SettingsManager.getInstance();
        this.#outputDir = outputDir;
    }

    /**
     * Generates a complete theme from the provided configuration
     * @param config - Theme configuration
     * @returns Generated theme output
     * @throws {ColorGenerationError} If color generation fails
     */
    public generateTheme(config: ThemeConfig): ThemeOutput {
        return benchmark('Theme Generation', () => {
            try {
                const themes = this.#settings.getThemes();
                const themeColors = this.generateColorSet(config);
                
                // Generate all theme variants
                const variants = Object.entries(themes.variants).reduce((acc, [name, variant]) => ({
                    ...acc,
                    [name]: this.createThemeVariant(themeColors, {
                        ...variant,
                        ...config.options
                    })
                }), {} as Record<ThemeVariantType, Theme>);

                return {
                    theme: variants[themes.defaultVariant],
                    colors: this.formatOutput(
                        variants[themes.defaultVariant].contrastColors,
                        Object.entries(variants)
                            .filter(([name]) => name !== themes.defaultVariant)
                            .reduce((acc, [name, theme]) => ({
                                ...acc,
                                [name]: theme.contrastColors
                            }), {})
                    )
                };
            } catch (error) {
                logger.error('Theme generation failed', { error });
                throw error;
            }
        });
    }

    /**
     * Generates a set of colors from the theme configuration
     * @param config - Theme configuration
     * @returns Array of Color instances
     * @private
     */
    private generateColorSet(config: ThemeConfig): Color[] {
        return [
            ...config.colors.map(color => this.createColor(color)),
            this.createColor(config.backgroundColor)
        ];
    }

    private createColor(config: ColorConfig): Color {
        const validation = this.validateColorConfig(config);
        if (!validation.isValid) {
            throw new ColorGenerationError(validation.errors.join(', '), config.name);
        }

        return new Color({
            name: config.name,
            colorKeys: config.colorKeys,
            ratios: config.ratios,
            colorspace: config.colorspace as InterpolationColorspace | undefined,
            smooth: config.smooth
        });
    }

    private validateColorConfig(config: ColorConfig): ValidationResult {
        const errors: string[] = [];

        if (!config.colorKeys.every(validateColor)) {
            errors.push('Invalid color keys');
        }

        if (!config.ratios.every(ratio => ratio > 0)) {
            errors.push('Invalid contrast ratios');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    private createThemeVariant(colors: Color[], variant: ThemeVariantConfig): Theme {
        const background = colors[colors.length - 1];
        return new Theme({
            colors,
            backgroundColor: new BackgroundColor(background),
            ...variant
        });
    }

    private formatOutput(defaultColors: ContrastColors, variants: Record<string, ContrastColors>): ContrastColors {
        const { properties } = this.#settings.getSchema();
        const colorScales: ColorScaleOutput = {};
        
        // Format each color according to schema
        defaultColors.slice(1).filter((color): color is ContrastColor => 'values' in color).forEach((color, i) => {
            colorScales[color.name] = {};
            
            color.values.forEach((value: ContrastColorValue, j: number) => {
                const step = ((j + 1) * 100).toString();
                const variantValues = Object.entries(variants).reduce((acc: Record<string, Record<string, string>>, [name, colors]) => {
                    const variantColor = colors.slice(1).filter((c): c is ContrastColor => 'values' in c)[i];
                    return {
                        ...acc,
                        [name]: this.formatColorValue(variantColor.values[j], properties)
                    };
                }, {
                    [this.#settings.getThemes().defaultVariant]: 
                        this.formatColorValue(value, properties)
                });
                
                colorScales[color.name][step] = variantValues;
            });
        });

        return defaultColors;
    }

    private formatColorValue(value: ContrastColorValue, properties: SchemaConfig['properties']): Record<string, string> {
        return properties.order.reduce((acc: Record<string, string>, key: string) => {
            if (!isPropertyKey(key)) {
                return acc;
            }

            const config = properties.config[key];
            const propertyValue = getPropertyValue(key, value);

            return {
                ...acc,
                [config.name]: config.format(propertyValue as never)
            };
        }, {});
    }

    /**
     * Saves the generated theme to a JSON file
     * @param themeName - Name of the theme file
     * @param themeData - Generated theme data
     */
    public saveThemeToFile(themeName: string, themeData: ThemeOutput): void {
        const tokensPath = path.join(process.cwd(), this.#outputDir, DESIGN_TOKENS_DIRECTORY);
        
        if (!fs.existsSync(tokensPath)) {
            fs.mkdirSync(tokensPath, { recursive: true });
        }

        const { root, colorScale, properties } = this.#settings.getSchema();
        const themes = this.#settings.getThemes();
        
        // Transform ContrastColors to the expected schema format
        const colorScaleData: Record<string, Record<string, Record<string, Record<string, string>>>> = {};
        const { colors: lightColors } = themeData;
        
        // Skip the background color (first element)
        const colors = lightColors.slice(1).filter((color): color is ContrastColor => 'values' in color);
        const darkConfig: ThemeConfig = {
            colors: colors.map(color => ({
                name: color.name,
                colorKeys: [color.values[0].value],
                ratios: color.values.map(v => v.contrast)
            })),
            backgroundColor: {
                name: 'background',
                colorKeys: [lightColors[0].background],
                ratios: [1]
            },
            options: { variant: 'dark' }
        };
        
        const darkTheme = this.createThemeVariant(
            this.generateColorSet(darkConfig),
            themes.variants.dark
        );
        const darkColors = darkTheme.contrastColors.slice(1) as ContrastColor[];
        
        colors.forEach((color, colorIndex) => {
            const darkColor = darkColors[colorIndex];
            colorScaleData[color.name] = {};
            
            color.values.forEach((value, index) => {
                const step = ((index + 1) * 100).toString();
                const variants = {
                    light: this.formatColorValue(value, properties),
                    dark: this.formatColorValue(darkColor.values[index], properties)
                };
                colorScaleData[color.name][step] = variants;
            });
        });

        // Create the final output structure using schema config
        const outputData = {
            [root[0]]: {
                [root[1]]: {
                    [colorScale]: colorScaleData
                }
            }
        };

        fs.writeFileSync(
            path.join(tokensPath, `${themeName}.json`),
            JSON.stringify(outputData, null, 2)
        );
    }
}
