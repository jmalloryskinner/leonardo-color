import { generateThemeFile } from '../index.js';
import { ThemeConfig } from '../types/theme.js';
import { CssColor } from '@adobe/leonardo-contrast-colors';
import path from 'path';
import fs from 'fs';

const BRANDS_DIR = path.join(process.cwd(), 'src/config/brands');

// Define type for brand config file structure
interface BrandConfigFile {
    colors: Array<{
        name: string;
        colorKeys: string[];
        ratios: number[];
    }>;
    backgroundColor: {
        name: string;
        colorKeys: string[];
        ratios: number[];
    };
}

// Generate themes for each brand config file
fs.readdirSync(BRANDS_DIR).forEach(file => {
    if (file.endsWith('.json')) {
        const brandName = path.basename(file, '.json');
        const configPath = path.join(BRANDS_DIR, file);
        const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as BrandConfigFile;

        // Convert the config data to a proper ThemeConfig
        const config: ThemeConfig = {
            colors: configData.colors.map(color => ({
                name: color.name,
                colorKeys: color.colorKeys as CssColor[],
                ratios: color.ratios
            })),
            backgroundColor: {
                name: configData.backgroundColor.name,
                colorKeys: configData.backgroundColor.colorKeys as CssColor[],
                ratios: configData.backgroundColor.ratios
            },
            options: {
                variant: 'light'
            }
        };

        generateThemeFile(brandName, config);
    }
});
