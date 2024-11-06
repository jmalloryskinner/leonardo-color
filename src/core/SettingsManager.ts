import dotenv from 'dotenv';
import { defaultSchema, SchemaConfig } from './settings/SchemaSettings.js';
import { ThemeConfig, defaultThemes, ThemeVariantType, ThemeVariantConfig } from './settings/ThemeSettings.js';

/**
 * Manages application-wide settings for theme generation
 * Implements the Singleton pattern to ensure consistent configuration
 */
export class SettingsManager {
    private static instance: SettingsManager;
    private schema: SchemaConfig;
    private themes: ThemeConfig;

    /**
     * Private constructor to prevent direct instantiation
     * Initializes settings and loads environment configuration
     */
    private constructor() {
        this.schema = defaultSchema;
        this.themes = defaultThemes;
        dotenv.config();
        this.loadEnvironmentConfig();
    }

    /**
     * Gets the singleton instance of SettingsManager
     * Creates instance if it doesn't exist
     */
    public static getInstance(): SettingsManager {
        if (!SettingsManager.instance) {
            SettingsManager.instance = new SettingsManager();
        }
        return SettingsManager.instance;
    }

    /**
     * Returns the current schema configuration
     */
    public getSchema(): SchemaConfig {
        return this.schema;
    }

    /**
     * Returns the current theme configuration
     */
    public getThemes(): ThemeConfig {
        return this.themes;
    }

    /**
     * Gets configuration for a specific theme variant
     * @param variant - The theme variant to get configuration for
     */
    public getThemeVariant(variant: ThemeVariantType): ThemeVariantConfig {
        return this.themes.variants[variant] || 
               this.themes.variants[this.themes.defaultVariant];
    }

    /**
     * Loads configuration from environment variables
     * @private
     */
    private loadEnvironmentConfig(): void {
        // Load root path from environment
        const rootFromEnv = process.env.SCHEMA_ROOT?.split(',') || defaultSchema.root;
        
        // Update schema with environment values
        this.schema = {
            ...defaultSchema,
            root: rootFromEnv,  // Use the entire array as root
            properties: defaultSchema.properties
        };

        // Load and validate theme overrides
        const themeOverrides = process.env.THEME_VARIANTS ? 
            JSON.parse(process.env.THEME_VARIANTS) as Partial<Record<ThemeVariantType, ThemeVariantConfig>> : {};

        // Merge theme overrides with defaults
        this.themes = {
            ...defaultThemes,
            variants: {
                ...defaultThemes.variants,
                ...themeOverrides
            }
        };
    }
} 