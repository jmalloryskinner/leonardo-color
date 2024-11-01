import { defaultSchema, SchemaConfig } from './settings/schema.config.js';
import { ThemeVariant, defaultThemes } from './settings/theme.config.js';

export class ConfigManager {
    private static instance: ConfigManager;
    private schema: SchemaConfig;
    private themes: Record<string, ThemeVariant>;

    private constructor() {
        this.schema = defaultSchema;
        this.themes = defaultThemes;
    }

    public static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    public getSchema(): SchemaConfig {
        return this.schema;
    }

    public getThemes(): Record<string, ThemeVariant> {
        return this.themes;
    }
} 