import { generateThemeFile } from '../index.js';
import { ThemeConfig, ThemeSchema } from '../types/theme.js';
import type { CssColor } from '@adobe/leonardo-contrast-colors';
import fs from 'fs';
import path from 'path';

describe('Theme File Generation', () => {
    const testConfig: ThemeConfig = {
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

    it('should generate theme file with correct schema structure', () => {
        generateThemeFile('test-theme', testConfig);

        const outputPath = path.join(process.cwd(), 'dist/design-tokens', 'test-theme.json');
        expect(fs.existsSync(outputPath)).toBe(true);

        const fileContent = JSON.parse(fs.readFileSync(outputPath, 'utf8')) as ThemeSchema;
        expect(fileContent.alto).toBeDefined();
        expect(fileContent.alto.prim).toBeDefined();
        expect(fileContent.alto.prim.colorScale).toBeDefined();
        
        // Additional type-safe assertions
        expect(typeof fileContent.alto).toBe('object');
        expect(typeof fileContent.alto.prim).toBe('object');
        expect(typeof fileContent.alto.prim.colorScale).toBe('object');

        // Check for color presence
        const testColor = fileContent.alto.prim.colorScale['test-color'];
        expect(testColor).toBeDefined();
        
        // Check for color variants
        const colorSteps = Object.keys(testColor);
        expect(colorSteps.length).toBeGreaterThan(0);
        
        const firstStep = testColor[colorSteps[0]];
        expect(firstStep.light).toBeDefined();
        expect(firstStep.dark).toBeDefined();
        expect(firstStep.light.$value).toBeDefined();
        expect(firstStep.dark.$value).toBeDefined();
    });
});
