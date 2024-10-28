import fs from 'fs';
import path from 'path';
import { Theme, Color, BackgroundColor } from '@adobe/leonardo-contrast-colors';
import { ThemeConfig, ThemeOutput } from '../types/theme.js';

export class ThemeGenerator {
    private readonly outputDir: string;

    constructor(outputDir: string = 'dist') {
        this.outputDir = outputDir;
    }

    public generateTheme(config: ThemeConfig): ThemeOutput {
        const backgroundColor = new BackgroundColor(config.backgroundColor);
        
        const colors = config.colors.map(colorConfig => 
            new Color(colorConfig)
        );

        const theme = new Theme({
            colors,
            backgroundColor,
            lightness: config.lightness
        });

        return {
            theme,
            colors: theme.contrastColors
        };
    }

    private ensureOutputDirectory(directory: string): void {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    }

    public saveThemeToFile(themeName: string, themeData: ThemeOutput): void {
        try {
            const themesPath = path.join(process.cwd(), this.outputDir, 'themes');
            this.ensureOutputDirectory(themesPath);

            const filePath = path.join(themesPath, `${themeName}.json`);
            
            fs.writeFileSync(
                filePath, 
                JSON.stringify(themeData.colors, null, 2), 
                { flag: 'w', encoding: 'utf-8' }
            );

            if (!fs.existsSync(filePath)) {
                throw new Error(`Failed to write theme file: ${filePath}`);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to save theme ${themeName}: ${message}`);
        }
    }
}
