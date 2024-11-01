import path from 'path';
import fs from 'fs';
import { Theme, Color, BackgroundColor, CssColor } from '@adobe/leonardo-contrast-colors';
import { ConfigManager } from '../core/ConfigManager.js';
import { 
    ThemeConfig, 
    ContrastColors, 
    ThemeOutput, 
    ContrastColor,
    ContrastColorValue,
    ColorConfig 
} from '../types/theme.js';
import { ColorGenerationError } from '../types/errors.js';
import { ColorValidationResult, ColorScaleOutput } from '../types/validation.js';
import { createColorScale, validateColor } from '../utils/colorUtils.js';
import { DESIGN_TOKENS_DIRECTORY } from '../constants/index.js';
import { logger } from '../utils/logger.js';
import { benchmark } from '../utils/benchmark.js';
import { ThemeVariant } from '../core/settings/theme.config.js';

interface ColorScaleStep {
    light: {
        $value: CssColor;
        $type: string;
        $description: string;
    };
    dark: {
        $value: CssColor;
        $type: string;
        $description: string;
    };
}

interface ColorScaleData {
    [colorName: string]: {
        [step: string]: ColorScaleStep;
    };
}

export class ThemeGenerator {
    #configManager: ConfigManager;
    #outputDir: string;
    #colorScaleCache = new Map<string, ColorScaleOutput>();

    constructor(outputDir = 'dist') {
        this.#configManager = ConfigManager.getInstance();
        this.#outputDir = outputDir;
    }

    private getColorScale(color: ColorConfig): ColorScaleOutput {
        const cacheKey = `${color.name}-${color.colorKeys.join()}`;
        
        if (!this.#colorScaleCache.has(cacheKey)) {
            createColorScale({
                swatches: 3000,
                colorKeys: color.colorKeys,
                colorspace: 'lab',
                smooth: false
            });

            const output: ColorScaleOutput = {};
            this.#colorScaleCache.set(cacheKey, output);
        }
        
        return this.#colorScaleCache.get(cacheKey)!;
    }

    private validateColorConfig(config: ColorConfig): ColorValidationResult {
        const errors: string[] = [];
        
        if (!config.colorKeys.every(key => validateColor(key))) {
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

    private generateColorSet(config: ThemeConfig): Color[] {
        return [
            ...config.colors,
            config.backgroundColor
        ].map(colorConfig => {
            const validation = this.validateColorConfig(colorConfig);
            if (!validation.isValid) {
                throw new ColorGenerationError(
                    validation.errors.join(', '),
                    colorConfig.name
                );
            }
            return new Color(colorConfig);
        });
    }

    private createThemeVariant(colors: Color[], variant: ThemeVariant): Theme {
        return new Theme({
            colors,
            backgroundColor: new BackgroundColor(colors[colors.length - 1]),
            ...variant
        });
    }

    private formatOutput(lightColors: ContrastColors, darkColors: ContrastColors): ContrastColors {
        const [background] = lightColors;
        const colorScales = this.formatColorScales(lightColors, darkColors);
        
        // Transform to ContrastColors format
        const colors: ContrastColor[] = Object.entries(colorScales).map(([name, values]) => ({
            name,
            values: Object.entries(values).map(([step, data]) => ({
                name: `${name}-${step}`,
                contrast: parseFloat(data.light.$description.split(':')[0]),
                value: data.light.$value as CssColor
            }))
        }));

        return [background, ...colors];
    }

    public generateTheme(config: ThemeConfig): ThemeOutput {
        return benchmark('Theme Generation', () => {
            try {
                const { light, dark } = this.#configManager.getThemes();
                
                const themeColors = this.generateColorSet(config);
                const lightTheme = this.createThemeVariant(themeColors, light);
                const darkTheme = this.createThemeVariant(themeColors, dark);

                return {
                    theme: lightTheme,
                    colors: this.formatOutput(lightTheme.contrastColors, darkTheme.contrastColors)
                };
            } catch (error) {
                logger.error('Theme generation failed', { error });
                throw error;
            }
        });
    }

    private formatColorScales(lightColors: ContrastColors, darkColors: ContrastColors): ColorScaleOutput {
        const colorScales: ColorScaleOutput = {};
        
        const lightColorGroups = lightColors.slice(1) as ContrastColor[];
        const darkColorGroups = darkColors.slice(1) as ContrastColor[];

        lightColorGroups.forEach((lightColor: ContrastColor, i: number) => {
            const darkColor = darkColorGroups[i];
            colorScales[lightColor.name] = {};

            lightColor.values.forEach((value: ContrastColorValue, j: number) => {
                const step = ((j + 1) * 100).toString();
                colorScales[lightColor.name][step] = {
                    light: {
                        $value: value.value,
                        $type: 'color',
                        $description: `${value.contrast}:1 against background`
                    },
                    dark: {
                        $value: darkColor.values[j].value,
                        $type: 'color',
                        $description: `${darkColor.values[j].contrast}:1 against background`
                    }
                };
            });
        });

        return colorScales;
    }

    public saveThemeToFile(themeName: string, themeData: ThemeOutput): void {
        const tokensPath = path.join(process.cwd(), this.#outputDir, DESIGN_TOKENS_DIRECTORY);
        
        if (!fs.existsSync(tokensPath)) {
            fs.mkdirSync(tokensPath, { recursive: true });
        }

        const { root, colorScale } = this.#configManager.getSchema();
        
        // Transform ContrastColors to the expected schema format
        const colorScaleData: ColorScaleData = {};
        
        // Skip the background color (first element)
        const colors = themeData.colors.slice(1) as ContrastColor[];
        
        colors.forEach((color) => {
            colorScaleData[color.name] = {};
            color.values.forEach((value, index) => {
                const step = ((index + 1) * 100).toString();
                colorScaleData[color.name][step] = {
                    light: {
                        $value: value.value,
                        $type: 'color',
                        $description: `${value.contrast}:1 against background`
                    },
                    dark: {
                        $value: value.value, // Use the same value for dark for now
                        $type: 'color',
                        $description: `${value.contrast}:1 against background`
                    }
                };
            });
        });

        // Create the final output structure
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
