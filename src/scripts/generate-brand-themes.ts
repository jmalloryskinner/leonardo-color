import { generateThemeFile } from '../index.js';
import { getAllBrands } from '../brands/index.js';
import { ThemeConfig } from '../types/theme.js';
import { themes } from '../themes/config.js';
import path from 'path';
import fs from 'fs';

async function generateBrandThemes() {
    const distPath = path.join(process.cwd(), 'dist');
    const themesPath = path.join(distPath, 'themes');
    
    if (!fs.existsSync(themesPath)) {
        fs.mkdirSync(themesPath, { recursive: true });
    }

    const brands = getAllBrands();
    
    // Generate one theme file per brand containing both light and dark variants
    for (const brand of brands) {
        try {
            // Create theme config by combining brand config with theme settings
            const themeConfig: ThemeConfig = {
                ...brand.config,
                lightness: 100, // Default to light theme settings
                contrast: themes.light.contrast,
                saturation: themes.light.saturation
            };

            generateThemeFile(brand.name, themeConfig);
            console.log(`✓ Generated theme for ${brand.name}`);
        } catch (error) {
            console.error(`✗ Failed to generate theme for ${brand.name}:`, error);
        }
    }
}

// Run the generation
generateBrandThemes().catch(console.error);
