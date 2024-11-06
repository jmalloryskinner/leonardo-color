import { Theme, Color, BackgroundColor, InterpolationColorspace } from '@adobe/leonardo-contrast-colors';
import { SettingsManager } from '../core/SettingsManager.js';
import { 
    ThemeConfig, 
    ThemeOutput, 
    ContrastColor,
    ContrastColorValue,
    ColorConfig 
} from '../types/theme.js';
import { logger } from '../utils/logger.js';
import { benchmark } from '../utils/benchmark.js';
import { ThemeVariantType } from '../core/settings/ThemeSettings.js';
import path from 'path';
import fs from 'fs';
import { DESIGN_TOKENS_DIRECTORY } from '../constants/index.js';

export class ThemeGenerator {
    #settings: SettingsManager;
    #outputDir: string;

    constructor(outputDir = 'dist') {
        this.#settings = SettingsManager.getInstance();
        this.#outputDir = outputDir;
    }

    public generateTheme(config: ThemeConfig): ThemeOutput {
        return benchmark('Theme Generation', () => {
            try {
                // Create the background color
                const backgroundColor = this.createBackgroundColor(config.backgroundColor);

                // Create colors including the background color as a regular color
                const colors = [
                    ...this.createColors([config.backgroundColor]), // Include background color as a regular color
                    ...this.createColors(config.colors)
                ];

                // Generate light and dark variants
                const lightTheme = this.createThemeVariant('light', colors, backgroundColor);
                const darkTheme = this.createThemeVariant('dark', colors, backgroundColor);

                // Return theme output with variants
                return {
                    theme: lightTheme,
                    colors: lightTheme.contrastColors,
                    variants: {
                        light: lightTheme.contrastColors,
                        dark: darkTheme.contrastColors
                    }
                };
            } catch (error) {
                logger.error('Theme generation failed', { error });
                throw error;
            }
        });
    }

    private validateColorspace(colorspace: string | undefined): InterpolationColorspace {
        const validColorspaces = ['CAM02', 'CAM02p', 'LCH', 'LAB', 'HSL', 'HSLuv', 'HSV', 'RGB'] as const;
        type ValidColorspace = typeof validColorspaces[number];
        const defaultColorspace = 'LAB' as ValidColorspace;

        if (!colorspace) return defaultColorspace;
        
        const normalizedColorspace = colorspace.toUpperCase();
        if (validColorspaces.includes(normalizedColorspace as ValidColorspace)) {
            return normalizedColorspace as ValidColorspace;
        }

        logger.warn('Invalid colorspace specified, using default', {
            specified: colorspace,
            default: defaultColorspace,
            valid: validColorspaces.join(', ')
        });
        return defaultColorspace;
    }

    private createColors(colorConfigs: ColorConfig[]): Color[] {
        return colorConfigs.map(config => new Color({
            name: config.name,
            colorKeys: config.colorKeys,
            ratios: config.ratios,
            colorspace: this.validateColorspace(config.colorspace),
            smooth: config.smooth || true,
            output: 'HEX'
        }));
    }

    private createBackgroundColor(config: ColorConfig): BackgroundColor {
        return new BackgroundColor({
            name: config.name,
            colorKeys: config.colorKeys,
            ratios: config.ratios,
            colorspace: this.validateColorspace(config.colorspace),
            smooth: config.smooth || true,
            output: 'HEX'
        });
    }

    private createThemeVariant(variant: ThemeVariantType, colors: Color[], backgroundColor: BackgroundColor): Theme {
        const variantConfig = this.#settings.getThemes().variants[variant];
        return new Theme({
            colors,
            backgroundColor,
            lightness: variantConfig.lightness,
            contrast: variantConfig.contrast,
            saturation: variantConfig.saturation,
            output: 'HEX',
            formula: 'wcag2'
        });
    }

    public saveThemeToFile(themeName: string, themeData: ThemeOutput): void {
        try {
            const tokensPath = path.join(process.cwd(), this.#outputDir, DESIGN_TOKENS_DIRECTORY);
            fs.mkdirSync(tokensPath, { recursive: true });

            const outputPath = path.join(tokensPath, `${themeName}.json`);
            const outputData = this.formatThemeOutput(themeData, themeName);

            fs.writeFileSync(
                outputPath,
                JSON.stringify(outputData, null, 2)
            );

            logger.info('Successfully saved theme file', { themeName, outputPath });
        } catch (error) {
            logger.error('Failed to save theme file', { themeName, error });
            throw error;
        }
    }

    private formatThemeOutput(themeData: ThemeOutput, brandName: string): unknown {
        // Get schema configuration
        const { root } = this.#settings.getSchema();

        // Generate color scales
        const colorScales = themeData.colors.reduce((acc: Record<string, unknown>, color, index) => {
            // Handle background color (first item in the array)
            if (index === 0 && 'background' in color) {
                // Create background color scale using the name from config
                const neutralScale = {} as Record<string, unknown>;
                
                // Add base background color
                neutralScale['100'] = {
                    light: {
                        $type: 'color',
                        $value: color.background,
                        $description: '1:1 base background color'
                    },
                    dark: {
                        $type: 'color',
                        $value: themeData.variants.dark[0].background,
                        $description: '1:1 base background color'
                    }
                };

                // Find the background color in the array
                const neutralColor = themeData.colors.find((c): c is ContrastColor => 
                    'name' in c && c.name === 'neutral'
                );

                // Add all the background color steps if found
                if (neutralColor && 'values' in neutralColor) {
                    neutralColor.values.forEach((value: ContrastColorValue, stepIndex: number) => {
                        const step = ((stepIndex + 2) * 100).toString(); // Start from 200
                        const darkColors = themeData.variants.dark;
                        const darkNeutral = darkColors.find((c): c is ContrastColor => 
                            'name' in c && c.name === 'neutral'
                        );

                        if (darkNeutral && 'values' in darkNeutral) {
                            neutralScale[step] = {
                                light: {
                                    $type: 'color',
                                    $value: value.value,
                                    $description: `${value.contrast}:1 against background`
                                },
                                dark: {
                                    $type: 'color',
                                    $value: darkNeutral.values[stepIndex].value,
                                    $description: `${darkNeutral.values[stepIndex].contrast}:1 against background`
                                }
                            };
                        }
                    });
                }

                acc['neutral'] = neutralScale;
                return acc;
            }

            // Handle other colors
            if ('values' in color) {
                const colorName = color.name;
                logger.debug('Processing color for output', { colorName });

                acc[colorName] = color.values.reduce((steps: Record<string, unknown>, value, stepIndex) => {
                    const step = ((stepIndex + 1) * 100).toString();
                    const darkColors = themeData.variants.dark;
                    
                    // Find the matching dark color by name
                    const darkColor = darkColors.find((c): c is ContrastColor => 
                        'name' in c && c.name === colorName
                    );

                    if (!darkColor || !('values' in darkColor)) {
                        logger.warn('Missing dark variant for color', { 
                            colorName, 
                            step 
                        });
                        return steps;
                    }

                    // Get the corresponding dark value for this step
                    const darkValue = darkColor.values[stepIndex];

                    steps[step] = {
                        light: {
                            $type: 'color',
                            $value: value.value,
                            $description: `${value.contrast}:1 against background`
                        },
                        dark: {
                            $type: 'color',
                            $value: darkValue.value,
                            $description: `${darkValue.contrast}:1 against background`
                        }
                    };

                    logger.debug('Generated color step', {
                        colorName,
                        step,
                        light: value.value,
                        dark: darkValue.value
                    });

                    return steps;
                }, {});
            }
            return acc;
        }, {});

        // Build output structure dynamically based on schema root
        return root.reduceRight((acc, key, index) => {
            // Handle brandName placeholder
            const processedKey = key === '{brandName}' ? brandName : key;
                
            if (index === root.length - 1) {
                return { [processedKey]: colorScales };
            }
            return { [processedKey]: acc };
        }, {} as Record<string, unknown>);
    }
}
