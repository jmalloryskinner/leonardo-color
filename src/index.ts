import { ThemeGenerator } from './services/themeGenerator.js';
import { ThemeConfig } from './types/theme.js';
import { logger } from './utils/logger.js';

export { ThemeConfig };

export function generateThemeFile(themeName: string, config: ThemeConfig): void {
    try {
        const generator = new ThemeGenerator();
        const theme = generator.generateTheme(config);
        generator.saveThemeToFile(themeName, theme);
    } catch (error) {
        logger.error('Failed to generate theme file', { error });
        throw error;
    }
}
