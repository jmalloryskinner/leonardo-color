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
     * Used for generating theme token structure
     */
    public getSchema(): SchemaConfig {
        return this.schema;
    }

    /**
     * Returns the current theme configuration
     * Contains all theme variants and their settings
     */
    public getThemes(): ThemeConfig {
        return this.themes;
    }

    /**
     * Gets configuration for a specific theme variant
     * Falls back to default variant if specified variant doesn't exist
     * @param variant - The theme variant to get configuration for
     */
    public getThemeVariant(variant: ThemeVariantType): ThemeVariantConfig {
        return this.themes.variants[variant] || 
               this.themes.variants[this.themes.defaultVariant];
    }

    /**
     * Loads configuration from environment variables
     * Allows runtime customization of schema and theme settings
     * @private
     */
    private loadEnvironmentConfig(): void {
        // Load schema root from environment or use default
        const rootFromEnv = process.env.SCHEMA_ROOT?.split(',') || defaultSchema.root;
        const root: [string, string] = rootFromEnv.length === 2 
            ? [rootFromEnv[0], rootFromEnv[1]]
            : defaultSchema.root;

        // Update schema with environment values
        this.schema = {
            ...defaultSchema,
            root,
            colorScale: process.env.SCHEMA_COLOR_SCALE || defaultSchema.colorScale
        };

        // Load and validate theme overrides from environment
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