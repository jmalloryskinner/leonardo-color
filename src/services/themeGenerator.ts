import fs from 'fs';
import path from 'path';
import { Theme, Color, BackgroundColor } from '@adobe/leonardo-contrast-colors';
import { ThemeConfig, ContrastColors, ContrastColor, ContrastColorValue } from '../types/theme.js';
import { ThemeOutput, ColorStep, ColorScale, ColorThemeVariant } from '../types/output.js';
import { themeSchema } from '../schemas/theme.schema.js';
import { DESIGN_TOKENS_DIRECTORY } from '../constants/index.js';

export class ThemeGenerator {
    private readonly outputDir: string;

    constructor(outputDir: string = 'dist') {
        this.outputDir = outputDir;
    }

    private createNestedObject(keys: string[], value: any): any {
        const lastKey = keys[keys.length - 1];
        const result = keys.slice(0, -1).reduceRight(
            (value, key) => ({ [key]: value }),
            { [lastKey]: value }
        );
        return result;
    }

    private formatThemeVariant(value: ContrastColorValue, variant: string): ColorThemeVariant {
        const { prefixes } = themeSchema.structure;
        return {
            [`${prefixes.value}value`]: value.value,
            [`${prefixes.type}type`]: themeSchema.formatters.colorType,
            [`${prefixes.description}description`]: themeSchema.formatters.description(value.contrast)
        };
    }

    private formatThemeOutput(lightColors: ContrastColors, darkColors: ContrastColors): ThemeOutput {
        const colorScale: ColorScale = {};

        // Process light theme colors
        const lightColorGroups = lightColors.slice(1) as ContrastColor[];
        lightColorGroups.forEach(colorGroup => {
            const colorName = colorGroup.name;
            colorScale[colorName] = {};

            colorGroup.values.forEach((value: ContrastColorValue) => {
                const step = value.name.replace(colorName, '');
                if (!colorScale[colorName][step]) {
                    colorScale[colorName][step] = {} as ColorStep;
                }

                colorScale[colorName][step][themeSchema.structure.variants.light] = 
                    this.formatThemeVariant(value, 'light');
            });
        });

        // Process dark theme colors
        const darkColorGroups = darkColors.slice(1) as ContrastColor[];
        darkColorGroups.forEach(colorGroup => {
            const colorName = colorGroup.name;
            
            colorGroup.values.forEach((value: ContrastColorValue) => {
                const step = value.name.replace(colorName, '');
                if (!colorScale[colorName][step]) {
                    colorScale[colorName][step] = {} as ColorStep;
                }

                colorScale[colorName][step][themeSchema.structure.variants.dark] = 
                    this.formatThemeVariant(value, 'dark');
            });
        });

        // Create the nested structure based on schema
        return this.createNestedObject(
            [...themeSchema.structure.root, themeSchema.structure.colorScale],
            colorScale
        ) as ThemeOutput;
    }

    public generateTheme(config: ThemeConfig): ThemeOutput {
        const backgroundColor = new BackgroundColor(config.backgroundColor);
        const colors = config.colors.map(colorConfig => new Color(colorConfig));

        // Generate light theme
        const lightTheme = new Theme({
            colors,
            backgroundColor,
            lightness: 100
        });

        // Generate dark theme
        const darkTheme = new Theme({
            colors,
            backgroundColor,
            lightness: 0
        });

        return this.formatThemeOutput(
            lightTheme.contrastColors,
            darkTheme.contrastColors
        );
    }

    public saveThemeToFile(themeName: string, themeData: ThemeOutput): void {
        try {
            const themesPath = path.join(process.cwd(), this.outputDir, DESIGN_TOKENS_DIRECTORY);
            if (!fs.existsSync(themesPath)) {
                fs.mkdirSync(themesPath, { recursive: true });
            }

            const filePath = path.join(themesPath, `${themeName}.json`);
            fs.writeFileSync(
                filePath, 
                JSON.stringify(themeData, null, 2), 
                { flag: 'w', encoding: 'utf-8' }
            );

            if (!fs.existsSync(filePath)) {
                throw new Error(`Failed to write theme file: ${filePath}`);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to save theme ${themeName}: ${message}`);
        }
    }
}
