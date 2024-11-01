import { ThemeGenerator } from '../services/themeGenerator.js';
import { ColorGenerationError } from '../types/errors.js';
import { ThemeConfig, ColorConfig } from '../types/theme.js';
import { CssColor } from '@adobe/leonardo-contrast-colors';

describe('ThemeGenerator', () => {
    let generator: ThemeGenerator;
    
    beforeEach(() => {
        generator = new ThemeGenerator('test-dist');
    });

    describe('Color Validation', () => {
        it('should validate correct color configs', () => {
            const config: ColorConfig = {
                name: 'test',
                colorKeys: ['#000000', '#ffffff'] as CssColor[],
                ratios: [3, 4.5]
            };

            const result = generator['validateColorConfig'](config);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should reject invalid color values', () => {
            const config: ColorConfig = {
                name: 'test',
                colorKeys: ['#000000', '#XYZ123'] as CssColor[],
                ratios: [3, 4.5]
            };

            const result = generator['validateColorConfig'](config);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Invalid color keys');
        });

        it('should reject negative contrast ratios', () => {
            const config: ColorConfig = {
                name: 'test',
                colorKeys: ['#000000', '#ffffff'] as CssColor[],
                ratios: [-1, -2]
            };

            const result = generator['validateColorConfig'](config);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Invalid contrast ratios');
        });
    });

    describe('Theme Generation', () => {
        it('should generate theme with correct structure', () => {
            const config: ThemeConfig = {
                colors: [{
                    name: 'test',
                    colorKeys: ['#000000', '#ffffff'] as CssColor[],
                    ratios: [3, 4.5]
                }],
                backgroundColor: {
                    name: 'bg',
                    colorKeys: ['#ffffff'] as CssColor[],
                    ratios: [2]
                },
                lightness: 100
            };

            const result = generator.generateTheme(config);
            expect(result.theme).toBeDefined();
            expect(result.colors).toBeDefined();
            expect(result.colors[0]).toHaveProperty('background');
            expect(result.colors[1]).toHaveProperty('name', 'test');
            expect(Array.isArray(result.colors[1].values)).toBe(true);
            expect(result.colors[1].values[0]).toHaveProperty('contrast');
            expect(result.colors[1].values[0]).toHaveProperty('value');
        });

        it('should throw error for invalid colors', () => {
            const config: ThemeConfig = {
                colors: [{
                    name: 'test',
                    colorKeys: ['#XYZ000'] as CssColor[],
                    ratios: [3]
                }],
                backgroundColor: {
                    name: 'bg',
                    colorKeys: ['#ffffff'] as CssColor[],
                    ratios: [2]
                },
                lightness: 100
            };

            expect(() => generator.generateTheme(config))
                .toThrow(ColorGenerationError);
        });
    });
}); 