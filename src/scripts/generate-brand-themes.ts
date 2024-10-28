import { generateThemeFile } from '../index.js';
import { getAllBrands } from '../brands/index.js';
import { themes } from '../themes/config.js';
import { ThemeConfig } from '../types/theme.js';
import path from 'path';
import fs from 'fs';

async function generateBrandThemes() {
    const distPath = path.join(process.cwd(), 'dist');
    const themesPath = path.join(distPath, 'themes');
    
    if (!fs.existsSync(themesPath)) {
        fs.mkdirSync(themesPath, { recursive: true });
    }

    const brands = getAllBrands();
    
    // Generate each theme for each brand
    for (const brand of brands) {
        for (const [themeName, themeOptions] of Object.entries(themes)) {
            try {
                // Combine brand config with theme options
                const themeConfig: ThemeConfig = {
                    ...brand.config,
                    lightness: themeOptions.lightness
                };

                const outputPath = `${brand.name}-${themeName}`;
                generateThemeFile(outputPath, themeConfig);
                console.log(`✓ Generated ${themeName} theme for ${brand.name}`);
            } catch (error) {
                console.error(`✗ Failed to generate ${themeName} theme for ${brand.name}:`, error);
            }
        }
    }
}

// Run the generation
generateBrandThemes().catch(console.error);
