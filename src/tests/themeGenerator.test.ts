import { ThemeGenerator } from '../services/themeGenerator.js';
import { ThemeConfig, ContrastColor, ContrastColorValue, ThemeSchema } from '../types/theme.js';
import type { CssColor } from '@adobe/leonardo-contrast-colors';
import fs from 'fs';
import path from 'path';

describe('ThemeGenerator', () => {
    let generator: ThemeGenerator;
    const testOutputDir = 'test-dist';

    // Sample test configuration
    const testConfig: ThemeConfig = {
        colors: [
            {
                name: 'accent',
                colorKeys: ['#5CDBFF', '#0000FF'] as CssColor[],
                ratios: [3, 4.5],
                colorspace: 'LAB',
                smooth: true
            }
        ],
        backgroundColor: {
            name: 'neutral',
            colorKeys: ['#FFFFFF'] as CssColor[],
            ratios: [1],
            colorspace: 'LAB',
            smooth: true
        },
        options: {
            variant: 'light'
        }
    };

    beforeEach(() => {
        generator = new ThemeGenerator(testOutputDir);
    });

    afterEach(() => {
        // Clean up test output directory
        if (fs.existsSync(testOutputDir)) {
            fs.rmSync(testOutputDir, { recursive: true });
        }
    });

    describe('Theme Generation', () => {
        it('should generate a theme with correct structure', () => {
            const theme = generator.generateTheme(testConfig);
            
            // Check theme structure
            expect(theme).toHaveProperty('theme');
            expect(theme).toHaveProperty('colors');
            
            // Check colors array structure
            expect(Array.isArray(theme.colors)).toBe(true);
            expect(theme.colors[0]).toHaveProperty('background');
            expect(theme.colors.length).toBeGreaterThan(1);
        });

        it('should generate correct number of color variants', () => {
            const theme = generator.generateTheme(testConfig);
            const accentColor = theme.colors.find((value): value is ContrastColor => 
                'name' in value && value.name === 'accent'
            );

            expect(accentColor).toBeDefined();
            if (accentColor && 'values' in accentColor) {
                expect(accentColor.values.length).toBe(testConfig.colors[0].ratios.length);
            }
        });

        it('should maintain contrast ratios', () => {
            const theme = generator.generateTheme(testConfig);
            const accentColor = theme.colors.find((value): value is ContrastColor => 
                'name' in value && value.name === 'accent'
            );

            if (accentColor && 'values' in accentColor) {
                accentColor.values.forEach((value: ContrastColorValue, index: number) => {
                    expect(value.contrast).toBe(testConfig.colors[0].ratios[index]);
                });
            }
        });
    });

    describe('File Output', () => {
        it('should save theme file with correct structure', () => {
            const theme = generator.generateTheme(testConfig);
            generator.saveThemeToFile('test-theme', theme);

            const outputPath = path.join(process.cwd(), testOutputDir, 'design-tokens', 'test-theme.json');
            expect(fs.existsSync(outputPath)).toBe(true);

            const fileContent = JSON.parse(fs.readFileSync(outputPath, 'utf8')) as ThemeSchema;
            
            expect(fileContent.alto).toBeDefined();
            expect(fileContent.alto.prim).toBeDefined();
            expect(fileContent.alto.prim.colorScale).toBeDefined();
            expect(fileContent.alto.prim.colorScale.accent).toBeDefined();
        });

        it('should generate both light and dark variants', () => {
            const theme = generator.generateTheme(testConfig);
            generator.saveThemeToFile('test-theme', theme);

            const outputPath = path.join(process.cwd(), testOutputDir, 'design-tokens', 'test-theme.json');
            const fileContent = JSON.parse(fs.readFileSync(outputPath, 'utf8')) as ThemeSchema;

            // Check first color step for light/dark variants
            const firstColorStep = fileContent.alto.prim.colorScale.accent['100'];
            expect(firstColorStep).toHaveProperty('light');
            expect(firstColorStep).toHaveProperty('dark');
            expect(firstColorStep.light.$value).not.toBe(firstColorStep.dark.$value);
        });

        it('should handle multiple colors', () => {
            const multiColorConfig: ThemeConfig = {
                ...testConfig,
                colors: [
                    ...testConfig.colors,
                    {
                        name: 'red',
                        colorKeys: ['#FF0000'] as CssColor[],
                        ratios: [3, 4.5],
                        colorspace: 'LAB',
                        smooth: true
                    }
                ]
            };

            const theme = generator.generateTheme(multiColorConfig);
            generator.saveThemeToFile('test-theme', theme);

            const outputPath = path.join(process.cwd(), testOutputDir, 'design-tokens', 'test-theme.json');
            const fileContent = JSON.parse(fs.readFileSync(outputPath, 'utf8')) as ThemeSchema;

            expect(fileContent.alto.prim.colorScale).toHaveProperty('accent');
            expect(fileContent.alto.prim.colorScale).toHaveProperty('red');
        });
    });
}); 