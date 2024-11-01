import { generateThemeFile } from '../index.js';
import { ThemeConfig } from '../types/theme.js';
import { CssColor } from '@adobe/leonardo-contrast-colors';
import fs from 'fs';
import path from 'path';

// Define expected output structure
interface ThemeOutput {
    alto: {
        prim: {
            colorScale: Record<string, unknown>;
        };
    };
}

describe('Theme File Generation', () => {
    const testThemePath = path.join(process.cwd(), 'dist/design-tokens/test-theme.json');

    beforeEach(() => {
        // Clean up any existing test files
        if (fs.existsSync(testThemePath)) {
            fs.unlinkSync(testThemePath);
        }
    });

    afterEach(() => {
        // Clean up test files
        if (fs.existsSync(testThemePath)) {
            fs.unlinkSync(testThemePath);
        }
    });

    it('should generate theme file with correct schema structure', () => {
        const config: ThemeConfig = {
            colors: [{
                name: 'test-color',
                colorKeys: ['#000000', '#ffffff'] as CssColor[],
                ratios: [3, 4.5]
            }],
            backgroundColor: {
                name: 'bg',
                colorKeys: ['#ffffff'] as CssColor[],
                ratios: [1]
            },
            options: {
                variant: 'light'
            }
        };

        generateThemeFile('test-theme', config);

        // Ensure directory exists
        expect(fs.existsSync(path.dirname(testThemePath))).toBe(true);
        
        // Ensure file exists
        expect(fs.existsSync(testThemePath)).toBe(true);
        
        const fileContent = JSON.parse(fs.readFileSync(testThemePath, 'utf-8')) as ThemeOutput;
        expect(fileContent).toBeDefined();
        expect(fileContent.alto).toBeDefined();
        expect(fileContent.alto.prim).toBeDefined();
        expect(fileContent.alto.prim.colorScale).toBeDefined();
        
        // Additional type-safe assertions
        expect(typeof fileContent.alto).toBe('object');
        expect(typeof fileContent.alto.prim).toBe('object');
        expect(typeof fileContent.alto.prim.colorScale).toBe('object');
    });
});
