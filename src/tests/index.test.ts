import { generateThemeFile } from '../index.js';
import { ThemeConfig, ColorConfig } from '../types/theme.js';
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

    it('should generate and save theme file', () => {
        const config: ThemeConfig = {
            colors: [mockColor],
            backgroundColor: mockBackground,
            lightness: 100
        };

        generateThemeFile('test-theme', config);

        expect(fs.existsSync(testThemePath)).toBe(true);
        const fileContent = JSON.parse(fs.readFileSync(testThemePath, 'utf-8'));
        expect(fileContent).toBeDefined();
        expect(Array.isArray(fileContent)).toBe(true);
        expect(fileContent[0]).toHaveProperty('background');
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
