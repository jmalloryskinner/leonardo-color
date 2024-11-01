import { generateThemeFile } from '../index.js';
import { getAllBrands } from '../brands/index.js';
import { logger } from '../utils/logger.js';
import { ThemeConfig } from '../types/theme.js';

async function generateBrandThemes(): Promise<void> {
    logger.info('Starting theme generation');
    
    try {
        const brands = getAllBrands();
        logger.info(`Found ${brands.length} brands to process`);
        
        await Promise.all(brands.map(async (brand) => {
            try {
                logger.info(`Generating theme for ${brand.name}`);
                const config: ThemeConfig = {
                    ...brand.config,
                    lightness: 100
                };
                await Promise.resolve(generateThemeFile(brand.name, config));
                logger.info(`✓ Generated theme for ${brand.name}`);
            } catch (error) {
                if (error instanceof Error) {
                    logger.error(`Failed to generate theme for ${brand.name}:`, { error: error.message });
                } else {
                    logger.error(`Failed to generate theme for ${brand.name}:`, { error: 'Unknown error' });
                }
            }
        }));
    } catch (error) {
        if (error instanceof Error) {
            logger.error('Failed to generate themes:', { error: error.message });
        } else {
            logger.error('Failed to generate themes:', { error: 'Unknown error' });
        }
        process.exit(1);
    }
}

// Run the generation
void generateBrandThemes().catch((error: unknown) => {
    if (error instanceof Error) {
        logger.error('Unhandled error:', { error: error.message });
    } else {
        logger.error('Unhandled error:', { error: 'Unknown error' });
    }
    process.exit(1);
});
