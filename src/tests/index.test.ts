import { generateThemeFile } from '../index.js';
import { ThemeConfig, ColorConfig } from '../types/theme.js';
import { DESIGN_TOKENS_DIRECTORY } from '../constants/index.js';
import fs from 'fs';
import path from 'path';

interface ThemeColorStep {
    light: {
        $value: string;
        $type: 'color';
        $description: string;
    };
    dark: {
        $value: string;
        $type: 'color';
        $description: string;
    };
}

interface ThemeColorScale {
    [colorName: string]: {
        [step: string]: ThemeColorStep;
    };
}

interface ThemeStructure {
    alto: {
        prim: {
            colorScale: ThemeColorScale;
        };
    };
}

describe('Theme File Generation', () => {
    const testThemePath = path.join(process.cwd(), 'dist', DESIGN_TOKENS_DIRECTORY, 'test-theme.json');
    
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
        const dir = path.dirname(testThemePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    afterAll(() => {
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
        const fileContent = JSON.parse(fs.readFileSync(testThemePath, 'utf-8')) as ThemeStructure;
        
        expect(fileContent).toBeDefined();
        // Check for alto.prim.colorScale structure
        expect(fileContent.alto).toBeDefined();
        expect(fileContent.alto.prim).toBeDefined();
        expect(fileContent.alto.prim.colorScale).toBeDefined();

        // Check color structure
        const colorScale = fileContent.alto.prim.colorScale;
        expect(colorScale['test-color']).toBeDefined();
        expect(colorScale['test-color']['100']).toBeDefined();
        expect(colorScale['test-color']['100'].light).toHaveProperty('$value');
        expect(colorScale['test-color']['100'].light).toHaveProperty('$type', 'color');
        expect(colorScale['test-color']['100'].light).toHaveProperty('$description');
        expect(colorScale['test-color']['100'].dark).toBeDefined();
    });

    it('should throw error for invalid color values', () => {
        const invalidConfig: ThemeConfig = {
            colors: [{
                ...mockColor,
                colorKeys: ['#XYZ000']
            }],
            backgroundColor: mockBackground,
            lightness: 100
        };

        expect(() => generateThemeFile('test-theme', invalidConfig))
            .toThrow();
    });
});
