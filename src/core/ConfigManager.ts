import dotenv from 'dotenv';
import { defaultSchema, SchemaConfig } from './settings/schema.config.js';
import { ThemeVariant, defaultThemes } from './settings/theme.config.js';

export class ConfigManager {
    private static instance: ConfigManager;
    private schema!: SchemaConfig;
    private themes: Record<string, ThemeVariant>;

    private constructor() {
        this.themes = defaultThemes;
        dotenv.config();
        this.loadEnvironmentConfig();
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

    private loadEnvironmentConfig(): void {
        this.schema = {
            ...defaultSchema,
            ...this.loadCustomSchema()
        };
    }

    private loadCustomSchema(): Partial<SchemaConfig> {
        return {
            root: process.env.SCHEMA_ROOT?.split(',') || defaultSchema.root,
            colorScale: process.env.SCHEMA_COLOR_SCALE || defaultSchema.colorScale,
        };
    }
} 