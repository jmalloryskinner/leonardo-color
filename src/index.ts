import { ThemeGenerator } from './services/themeGenerator.js';
import { ThemeConfig } from './types/theme.js';

export { ThemeConfig };

export function generateThemeFile(themeName: string, config: ThemeConfig): void {
    const generator = new ThemeGenerator();
    const themeOutput = generator.generateTheme(config);
    generator.saveThemeToFile(themeName, themeOutput);
}
