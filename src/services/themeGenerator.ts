import path from 'path';
import fs from 'fs';
import { Theme, Color, BackgroundColor } from '@adobe/leonardo-contrast-colors';
import { ConfigManager } from '../core/ConfigManager.js';
import { ThemeConfig, ContrastColors, ThemeOutput, ContrastColor } from '../types/theme.js';
import { DESIGN_TOKENS_DIRECTORY } from '../constants/index.js';

export class ThemeGenerator {
    #configManager: ConfigManager;
    #outputDir: string;

    constructor(outputDir: string = 'dist') {
        this.#configManager = ConfigManager.getInstance();
        this.#outputDir = outputDir;
    }

    public generateTheme(config: ThemeConfig): ThemeOutput {
        const themes = this.#configManager.getThemes();
        const schema = this.#configManager.getSchema();

        // Create array of all colors including background
        const allColors = [
            ...config.colors,
            config.backgroundColor
        ].map(colorConfig => new Color(colorConfig));

        // Generate light theme
        const lightTheme = new Theme({
            colors: allColors,
            backgroundColor: new BackgroundColor(config.backgroundColor),
            ...themes.light
        });

        // Generate dark theme
        const darkTheme = new Theme({
            colors: allColors,
            backgroundColor: new BackgroundColor(config.backgroundColor),
            ...themes.dark
        });

        const output = this.formatOutput(lightTheme.contrastColors, darkTheme.contrastColors);
        return {
            theme: lightTheme,
            colors: output
        };
    }

    private formatOutput(lightColors: ContrastColors, darkColors: ContrastColors): any {
        const schema = this.#configManager.getSchema();
        return {
            [schema.root[0]]: {
                [schema.root[1]]: {
                    [schema.colorScale]: {
                        ...this.formatColorScales(lightColors, darkColors)
                    }
                }
            }
        };
    }

    private formatColorScales(lightColors: ContrastColors, darkColors: ContrastColors): any {
        const colorScales: any = {};
        
        const lightColorGroups = lightColors.slice(1) as ContrastColor[];
        const darkColorGroups = darkColors.slice(1) as ContrastColor[];
        
        for (let i = 0; i < lightColorGroups.length; i++) {
            const lightColor = lightColorGroups[i];
            const darkColor = darkColorGroups[i];
            
            colorScales[lightColor.name] = {};
            
            // Loop through all values/ratios
            lightColor.values.forEach((value, index) => {
                const step = (index + 1) * 100; // 100, 200, 300, etc.
                colorScales[lightColor.name][step] = {
                    light: {
                        $value: value.value,
                        $type: "color",
                        $description: `${value.contrast}:1 against background`
                    },
                    dark: {
                        $value: darkColor.values[index].value,
                        $type: "color",
                        $description: `${darkColor.values[index].contrast}:1 against background`
                    }
                };
            });
        }
        
        return colorScales;
    }

    public saveThemeToFile(themeName: string, themeData: ThemeOutput): void {
        const tokensPath = path.join(process.cwd(), this.#outputDir, DESIGN_TOKENS_DIRECTORY);
        
        if (!fs.existsSync(tokensPath)) {
            fs.mkdirSync(tokensPath, { recursive: true });
        }

        fs.writeFileSync(
            path.join(tokensPath, `${themeName}.json`),
            JSON.stringify(themeData.colors, null, 2)
        );
    }
}
