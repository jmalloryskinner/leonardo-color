import { generateThemeFile } from '../index.js';
import { ThemeConfig, ColorConfig } from '../types/theme.js';
import { themeSchema } from '../schemas/theme.schema.js';
import { ColorStep } from '../types/output.js';
import fs from 'fs';
import path from 'path';

describe('Theme File Generation', () => {
    const testThemePath = path.join(process.cwd(), 'dist/themes/test-theme.json');
    
    const mockColor: ColorConfig = {
        name: 'test-color',
        colorKeys: ['#000000'],
        ratios: [4.5]
    };

    const mockBackground: ColorConfig = {
        name: 'test-bg',
        colorKeys: ['#ffffff'],
        ratios: [2]
    };

    beforeEach(() => {
        // Clean up before each test
        if (fs.existsSync(testThemePath)) {
            fs.unlinkSync(testThemePath);
        }
    });

    afterAll(() => {
        // Clean up after all tests
        if (fs.existsSync(testThemePath)) {
            fs.unlinkSync(testThemePath);
        }
    });

    it('should generate theme file with correct schema structure', () => {
        const config: ThemeConfig = {
            colors: [mockColor],
            backgroundColor: mockBackground,
            lightness: 100
        };

        generateThemeFile('test-theme', config);

        expect(fs.existsSync(testThemePath)).toBe(true);
        const fileContent = JSON.parse(fs.readFileSync(testThemePath, 'utf-8'));
        
        // Verify schema structure
        const [rootKey1, rootKey2] = themeSchema.structure.root;
        expect(fileContent).toHaveProperty(rootKey1);
        expect(fileContent[rootKey1]).toHaveProperty(rootKey2);
        expect(fileContent[rootKey1][rootKey2]).toHaveProperty(themeSchema.structure.colorScale);

        // Verify color structure
        const colorScale = fileContent[rootKey1][rootKey2][themeSchema.structure.colorScale];
        expect(colorScale['test-color']).toBeDefined();
        
        // Verify theme variants
        const colorStep = Object.values(colorScale['test-color'])[0] as ColorStep;
        expect(colorStep).toHaveProperty(themeSchema.structure.variants.light);
        expect(colorStep).toHaveProperty(themeSchema.structure.variants.dark);

        // Verify value format
        const lightVariant = colorStep[themeSchema.structure.variants.light];
        expect(lightVariant).toHaveProperty(`${themeSchema.structure.prefixes.value}value`);
        expect(lightVariant).toHaveProperty(`${themeSchema.structure.prefixes.type}type`);
        expect(lightVariant).toHaveProperty(`${themeSchema.structure.prefixes.description}description`);
    });

    it('should throw error for invalid color values', () => {
        const invalidConfig: ThemeConfig = {
            colors: [{
                ...mockColor,
                colorKeys: ['#XYZ000'] // Invalid hex color that matches CssColor type
            }],
            backgroundColor: mockBackground,
            lightness: 100
        };

        expect(() => generateThemeFile('test-theme', invalidConfig))
            .toThrow();
    });
});
